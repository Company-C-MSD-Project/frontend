import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { tokens } from "@/lib/api-client";

export const Route = createFileRoute("/oauth/callback")({
  component: OAuthCallback,
});

/**
 * Lands here after the backend's Google OAuth success handler redirects with tokens
 * in the URL fragment (#access_token=…&refresh_token=…). Stores them, then sends the
 * user to /login, whose session-detection effect routes on to the right dashboard.
 */
function OAuthCallback() {
  useEffect(() => {
    try {
      const raw = window.location.hash.replace(/^#/, "");
      const params = new URLSearchParams(raw);
      const access = params.get("access_token");
      const refresh = params.get("refresh_token");
      if (access) tokens.set(access, refresh);
    } finally {
      // Clear the fragment from history and continue.
      window.location.replace("/login");
    }
  }, []);

  return (
    <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">
      Signing you in…
    </div>
  );
}
