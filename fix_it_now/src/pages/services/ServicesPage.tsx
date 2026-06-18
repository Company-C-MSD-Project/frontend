import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, MapPin, Star, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { AddressAutocomplete } from "@/components/maps/AddressAutocomplete";
import { browseService, type ServiceCategory, type Provider } from "@/services/browse";
import { useCurrentUser } from "@/hooks/use-current-user";
import { setBookingIntent } from "@/lib/booking";
import { formatCurrency } from "@/lib/currency";

const POPULAR = ["Plumbing", "Electrical", "Cleaning", "Masonry", "Carpentry"];

export function ServicesPage() {
  const { profile } = useCurrentUser();
  const bookLink = profile?.username
    ? { to: "/$username/book", params: { username: profile.username } } as const
    : { to: "/login" as const, onClick: () => setBookingIntent({}) };

  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [topProviders, setTopProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let alive = true;
    Promise.all([browseService.listCategories(), browseService.topProviders(4)])
      .then(([cats, top]) => {
        if (!alive) return;
        setServices(cats);
        setTopProviders(top);
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const topRated = topProviders.map((p) => ({
    id: p.id,
    name: p.name,
    title: p.title,
    area: p.area,
    avail: p.availability,
    price: p.hourly,
    rating: p.rating,
  }));

  // Type-ahead: match categories + their sub-services against the query.
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as { slug: string; label: string; sub: string }[];
    const out: { slug: string; label: string; sub: string }[] = [];
    for (const c of services) {
      if (c.name.toLowerCase().includes(q)) out.push({ slug: c.id, label: c.name, sub: "Category" });
      for (const ss of c.subServices ?? []) {
        if (ss.name.toLowerCase().includes(q)) out.push({ slug: c.id, label: ss.name, sub: `in ${c.name}` });
      }
    }
    return out.slice(0, 8);
  }, [query, services]);

  const goTo = (slug: string) => {
    setShowSuggest(false);
    navigate({ to: "/services/$serviceId", params: { serviceId: slug } });
  };
  const runSearch = (explicit?: string) => {
    const q = (explicit ?? query).trim().toLowerCase();
    const cat = q
      ? services.find((c) => c.name.toLowerCase().includes(q) || (c.subServices ?? []).some((ss) => ss.name.toLowerCase().includes(q)))
      : undefined;
    if (cat) { goTo(cat.id); return; }
    setShowSuggest(false);
    document.getElementById("all-categories")?.scrollIntoView({ behavior: "smooth" });
  };

  // Close the suggestions dropdown on outside click.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggest(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero search */}
      <section className="bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto w-full max-w-6xl 4xl:max-w-[1800px] px-4 sm:px-5 3xl:max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[2200px] py-14 sm:py-20 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl" style={{ lineHeight: 1.05 }}>
            Find the Right <span className="text-primary">Expert</span> for Any Job
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Browse 2,400+ verified professionals across 30+ service categories.
          </p>

          <div ref={searchRef} className="relative mx-auto mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm sm:flex-row">
            <div className="relative flex flex-1 items-center gap-2 rounded-xl px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSuggest(true); }}
                onFocus={() => setShowSuggest(true)}
                onKeyDown={(e) => { if (e.key === "Enter") runSearch(); }}
                placeholder="What service do you need?"
                className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              {showSuggest && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-border bg-card text-left shadow-lg">
                  {suggestions.map((s, i) => (
                    <button
                      key={`${s.slug}-${s.label}-${i}`}
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); goTo(s.slug); }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted"
                    >
                      <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="font-medium">{s.label}</span>
                      <span className="ml-auto text-[11px] text-muted-foreground">{s.sub}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 sm:border-l-0">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <AddressAutocomplete
                value={location}
                onChange={setLocation}
                onPlace={(p) => setLocation(p.address)}
                placeholder="Your location"
                className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground sm:w-44"
              />
            </div>
            <button
              type="button"
              onClick={() => runSearch()}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Search Now
            </button>
          </div>

          <div className="mx-auto mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">Popular:</span>
            {POPULAR.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => { setQuery(p); runSearch(p); }}
                className="rounded-full border border-border bg-card px-3 py-1.5 font-medium text-foreground hover:bg-muted transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="all-categories" className="mx-auto w-full max-w-6xl 4xl:max-w-[1800px] px-4 sm:px-5 3xl:max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[2200px] py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Browse All Categories</h2>
          <a href="#" className="text-sm font-medium text-primary hover:underline">View All 30+ Categories →</a>
        </div>
        {loading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Loading categories…</p>
        ) : services.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">No service categories yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {services.map((s) => (
              <Link
                key={s.id}
                to="/services/$serviceId"
                params={{ serviceId: s.id }}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                  {s.emoji}
                </div>
                <div>
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{s.specialists}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Top rated providers */}
      <section className="mx-auto w-full max-w-6xl 4xl:max-w-[1800px] px-4 sm:px-5 3xl:max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[2200px] pb-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Top Rated Providers</h2>
          <a href="#" className="text-sm font-medium text-primary hover:underline">View More →</a>
        </div>
        {topRated.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            {loading ? "Loading providers…" : "No top-rated providers yet."}
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {topRated.map((p) => (
              <div key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="relative h-36" style={{ background: `linear-gradient(135deg, var(--primary) 0%, oklch(0.55 0.10 60) 100%)` }}>
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Top Rated</span>
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-foreground/80 px-2 py-1 text-[11px] font-semibold text-background">
                    <Star className="h-3 w-3 fill-current text-primary" /> {p.rating}
                  </span>
                </div>
                <div className="space-y-2 p-4">
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-primary">{p.title}</p>
                  </div>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {p.area}</p>
                  <p className="text-xs text-success">✓ {p.avail}</p>
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-sm"><span className="text-lg font-bold">{formatCurrency(p.price)}</span><span className="text-xs text-muted-foreground">/hr</span></p>
                    <Link {...bookLink} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Gold CTA */}
      <section className="mx-auto w-full max-w-6xl 4xl:max-w-[1800px] px-4 sm:px-5 3xl:max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[2200px] pb-14">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-primary px-6 py-7 text-primary-foreground sm:flex-row sm:items-center sm:px-10">
          <div>
            <h3 className="text-xl font-bold sm:text-2xl">Upgrade to Gold Membership</h3>
            <p className="mt-1 text-sm opacity-90">Enjoy 0% service fees, priority booking, and extended warranties.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground shadow-sm hover:opacity-90 transition-opacity">
            Subscribe to Gold — LKR 1,000/mo <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-t border-border">
        <div className="mx-auto grid max-w-6xl 4xl:max-w-[1800px] gap-8 px-5 py-12 sm:grid-cols-3">
          {[
            { icon: "🛡️", title: "Secure Escrow", desc: "Payment held safely until you confirm the job is complete to your satisfaction." },
            { icon: "⭐", title: "Verified Pros", desc: "Every professional undergoes a rigorous 5-step background and certification check." },
            { icon: "🕒", title: "24/7 Support", desc: "Our dedicated support team is always ready to assist with any project needs." },
          ].map((t) => (
            <div key={t.title} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">{t.icon}</div>
              <p className="mt-3 font-semibold">{t.title}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}