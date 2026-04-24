import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/contents", label: "Icerikler" },
  { href: "/admin/contents/new", label: "Yeni Icerik" },
  { href: "/admin/ai-content", label: "AI Icerik" },
];

export default function AdminSidebar() {
  return (
    <aside className="w-full border-b border-border bg-card/60 md:w-64 md:border-b-0 md:border-r">
      <div className="p-4 md:p-5">
        <p className="text-xs uppercase tracking-wider text-muted">Admin Panel</p>
        <h2 className="mt-1 text-lg font-semibold text-foreground">Trend Control</h2>
      </div>
      <nav className="space-y-1 px-3 pb-4 md:px-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-lg border border-transparent px-3 py-2 text-sm text-muted transition hover:border-accent/30 hover:bg-accent/10 hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
