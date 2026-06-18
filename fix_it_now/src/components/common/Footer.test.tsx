import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => <a href={to}>{children}</a>,
}));

import { Footer } from "./Footer";

describe("Footer", () => {
  it("includes links to the Terms of Service and Privacy Policy", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: /Terms of Service/i })).toHaveAttribute("href", "/terms");
    expect(screen.getByRole("link", { name: /Privacy Policy/i })).toHaveAttribute("href", "/privacy");
  });
});
