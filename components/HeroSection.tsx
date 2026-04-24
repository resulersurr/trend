import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-b from-accent-glow via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            <span className="text-xs font-medium text-accent">Trend İçerikler Güncel</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Keşfet, Takip Et,{" "}
            <span className="bg-gradient-to-r from-accent to-rose-400 bg-clip-text text-transparent">
              Trendi Yakala
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Etkinlik, mekan, kampanya veya rehber — hangi içerik türü olursa olsun, en güncel ve en popüler
            içerikleri tek bir platformda keşfedin.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/explore"
              className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent/90 hover:shadow-accent/40"
            >
              Keşfetmeye Başla
            </Link>
            <Link
              href="/explore?trending=true"
              className="rounded-full border border-border px-8 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent/40 hover:bg-accent/5"
            >
              Trend İçerikler
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
