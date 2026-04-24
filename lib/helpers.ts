export function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatViewCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return String(count);
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    published: "Yayında",
    draft: "Taslak",
    archived: "Arşivlendi",
  };
  return map[status] ?? status;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    draft: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    archived: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };
  return map[status] ?? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
}
