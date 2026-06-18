import { createFileRoute, redirect } from "@tanstack/react-router";
import { useNewApi, tokens } from "@/lib/api-client";
import { authApi } from "@/lib/auth-api";

export const Route = createFileRoute("/dashboard/homeowner")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    if (useNewApi()) {
      if (!tokens.access) throw redirect({ to: "/login" });
      const s = await authApi.getSession();
      if (s?.user.username) throw redirect({ to: "/$username/dashboard", params: { username: s.user.username }, replace: true });
      throw redirect({ to: "/login" });
    }
    const { supabase } = await import("@/integrations/supabase/client");
    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) throw redirect({ to: "/login" });
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", sess.session.user.id)
      .maybeSingle();
    if (data?.username) {
      throw redirect({ to: "/$username/dashboard", params: { username: data.username }, replace: true });
    }
    throw redirect({ to: "/login" });
  },
  component: () => null,
});
