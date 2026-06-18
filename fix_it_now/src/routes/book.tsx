import { createFileRoute, redirect } from "@tanstack/react-router";
import { useNewApi, tokens } from "@/lib/api-client";
import { authApi } from "@/lib/auth-api";

type Search = { subService?: string; provider?: string; step?: number };

export const Route = createFileRoute("/book")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    subService: typeof s.subService === "string" ? s.subService : undefined,
    provider: typeof s.provider === "string" ? s.provider : undefined,
    step: typeof s.step === "number" ? s.step : undefined,
  }),
  beforeLoad: async ({ search }) => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams();
    if (search.subService) sp.set("subService", search.subService);
    if (search.provider) sp.set("provider", search.provider);
    if (search.step) sp.set("step", String(search.step));
    const qs = sp.toString() ? "?" + sp.toString() : "";

    // New API: resolve the username from the JWT session and forward to
    // /$username/book (was using supabase.auth, which is null under the new API).
    if (useNewApi()) {
      if (!tokens.access) throw redirect({ to: "/login", search: { redirect: `/book${qs}` } as any });
      const s = await authApi.getSession();
      if (s?.user.username) {
        throw redirect({ to: "/$username/book", params: { username: s.user.username }, search: search as any, replace: true });
      }
      throw redirect({ to: "/login" });
    }

    const { supabase } = await import("@/integrations/supabase/client");
    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) {
      throw redirect({ to: "/login", search: { redirect: `/book${qs}` } as any });
    }
    const { data: prof } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", sess.session.user.id)
      .maybeSingle();
    if (prof?.username) {
      throw redirect({
        to: "/$username/book",
        params: { username: prof.username },
        search: search as any,
        replace: true,
      });
    }
    throw redirect({ to: "/login" });
  },
  component: () => null,
});
