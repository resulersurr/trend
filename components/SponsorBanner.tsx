import type { SponsorBlockType } from "@/types";

export default function SponsorBanner({ sponsor }: { sponsor: SponsorBlockType }) {
  if (!sponsor.isActive) return null;

  return (
    <a
      href={sponsor.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-2xl border border-border transition-all hover:border-accent/30"
    >
      <div className="relative">
        <img
          src={sponsor.image}
          alt={sponsor.title}
          className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-48"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <span className="rounded-md bg-accent/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            Sponsor
          </span>
          <p className="mt-1 text-sm font-medium text-white">{sponsor.title}</p>
        </div>
      </div>
    </a>
  );
}
