import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AddressAutocomplete } from "@/components/maps/AddressAutocomplete";

// With VITE_GOOGLE_MAPS_API_KEY empty (set in vitest.config), the component renders
// a plain controlled input (graceful fallback) and never loads the Maps SDK.
describe("AddressAutocomplete (fallback behaviour without a Maps key)", () => {
  it("renders a controlled input showing the provided value", () => {
    render(
      <AddressAutocomplete value="42 Palm Grove, Colombo 3" onChange={() => {}} placeholder="address" />,
    );
    const input = screen.getByPlaceholderText("address") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("42 Palm Grove, Colombo 3");
  });

  it("calls onChange as the user types", () => {
    const onChange = vi.fn();
    render(<AddressAutocomplete value="" onChange={onChange} placeholder="address" />);
    fireEvent.change(screen.getByPlaceholderText("address"), { target: { value: "Kandy" } });
    expect(onChange).toHaveBeenCalledWith("Kandy");
  });
});
