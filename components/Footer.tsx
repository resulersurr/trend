import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <span className="text-sm font-bold text-white">T</span>
              </div>
              <span className="text-lg font-bold text-foreground">Trend</span>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              İçerik keşif platformu. Etkinlik, mekan, kampanya veya rehber — her türlü içeriği keşfedin.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Platform</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/" className="transition-colors hover:text-foreground">Ana Sayfa</Link></li>
              <li><Link href="/explore" className="transition-colors hover:text-foreground">Keşfet</Link></li>
              <li><Link href="/explore?trending=true" className="transition-colors hover:text-foreground">Trend</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Kategoriler</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/explore?category=etkinlik" className="transition-colors hover:text-foreground">Etkinlik</Link></li>
              <li><Link href="/explore?category=mekan" className="transition-colors hover:text-foreground">Mekan</Link></li>
              <li><Link href="/explore?category=kampanya" className="transition-colors hover:text-foreground">Kampanya</Link></li>
              <li><Link href="/explore?category=rehber" className="transition-colors hover:text-foreground">Rehber</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Yasal</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><span className="cursor-pointer transition-colors hover:text-foreground">Kullanım Şartları</span></li>
              <li><span className="cursor-pointer transition-colors hover:text-foreground">Gizlilik Politikası</span></li>
              <li><span className="cursor-pointer transition-colors hover:text-foreground">KVKK</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted">© 2026 Trend. Tüm hakları saklıdır.</p>
          <div className="flex gap-4">
            <span className="text-xs text-muted transition-colors hover:text-foreground">Twitter</span>
            <span className="text-xs text-muted transition-colors hover:text-foreground">Instagram</span>
            <span className="text-xs text-muted transition-colors hover:text-foreground">LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
