import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock the axios wrapper before importing the service under test.
vi.mock("./http", () => ({
  http: { get: vi.fn(), patch: vi.fn() },
}));

import { http } from "./http";
import { profileService } from "./profile";

const mockGet = http.get as unknown as ReturnType<typeof vi.fn>;

describe("profileService.me() — backend -> ProfileMe mapping", () => {
  beforeEach(() => vi.clearAllMocks());

  it("maps snake_case backend fields onto the UI shape", async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        id: 7,
        email: "alice@example.com",
        username: "alice",
        display_name: "Alice Anderson",
        avatar_url: null,
        role: "provider",
        phone: "0771234567",
        address: "42 Palm Grove",
        district: "Colombo",
        bio: "Plumber",
      },
    });

    const me = await profileService.me();

    expect(mockGet).toHaveBeenCalledWith("/me");
    expect(me.id).toBe("7"); // coerced to string
    expect(me.displayName).toBe("Alice Anderson");
    expect(me.avatarUrl).toBeNull();
    expect(me.role).toBe("provider");
    expect(me.district).toBe("Colombo");
  });

  it("applies safe defaults when fields are missing", async () => {
    mockGet.mockResolvedValueOnce({ data: { id: 1 } });

    const me = await profileService.me();

    expect(me.id).toBe("1");
    expect(me.email).toBeNull();
    expect(me.displayName).toBeNull();
    expect(me.role).toBe("homeowner"); // default role
  });
});

describe("profileService.homeownerStats() — numeric coercion + defaults", () => {
  beforeEach(() => vi.clearAllMocks());

  it("coerces snake_case stats and fills defaults", async () => {
    mockGet.mockResolvedValueOnce({
      data: { total_bookings: 5, active_projects: 2, total_spent: "Rs 12000" },
    });

    const stats = await profileService.homeownerStats();

    expect(stats.totalBookings).toBe(5);
    expect(stats.activeProjects).toBe(2);
    expect(stats.totalSpent).toBe("Rs 12000");
    expect(stats.reviewsGiven).toBe(0); // default when absent
    expect(stats.memberSince).toBe("—"); // em dash default
  });
});
