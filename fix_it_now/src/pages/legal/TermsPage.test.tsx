import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => <a href={to}>{children}</a>,
}));
vi.mock("@/components/common/Navbar", () => ({ Navbar: () => <div data-testid="navbar" /> }));
vi.mock("@/components/common/Footer", () => ({ Footer: () => <div data-testid="footer" /> }));

import { TermsPage } from "./TermsPage";

describe("TermsPage", () => {
  it("renders the Terms page with updated metadata", () => {
    render(<TermsPage />);

    expect(screen.getByRole("heading", { name: /Terms of Service/i })).toBeInTheDocument();
    expect(screen.getByText(/Effective date: June 18, 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/Version 1\.2/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back to Sign Up/i })).toHaveAttribute("href", "/signup");
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});
