import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

type Network = keyof typeof site.social;

const icons: Record<Network, { label: string; path: React.ReactNode }> = {
  facebook: {
    label: "Facebook",
    path: (
      <path d="M14 8.5V7c0-.7.3-1 1-1h1.5V3.5H14c-2 0-3.5 1.3-3.5 3.4V8.5H8V11h2.5v9.5H14V11h2.3l.4-2.5H14Z" />
    ),
  },
  linkedin: {
    label: "LinkedIn",
    path: (
      <path d="M6.9 8.9H3.8v11.3h3.1V8.9ZM5.3 3.5a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6ZM20.2 13.9c0-3-1.6-4.4-3.8-4.4-1.7 0-2.5.95-3 1.6V8.9H10.3c.04.9 0 11.3 0 11.3h3.1v-6.3c0-.3 0-.6.1-.8.25-.6.8-1.2 1.7-1.2 1.2 0 1.7.9 1.7 2.3v6h3.1v-6.3Z" />
    ),
  },
  youtube: {
    label: "YouTube",
    path: (
      <path d="M21.3 8.1a2.4 2.4 0 0 0-1.7-1.7C18.1 6 12 6 12 6s-6.1 0-7.6.4A2.4 2.4 0 0 0 2.7 8.1 25 25 0 0 0 2.3 12c0 1.3.1 2.6.4 3.9a2.4 2.4 0 0 0 1.7 1.7c1.5.4 7.6.4 7.6.4s6.1 0 7.6-.4a2.4 2.4 0 0 0 1.7-1.7c.3-1.3.4-2.6.4-3.9s-.1-2.6-.4-3.9ZM10.1 14.9V9.1l5 2.9-5 2.9Z" />
    ),
  },
  instagram: {
    label: "Instagram",
    path: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17" cy="7" r="1.2" />
      </>
    ),
  },
};

/** Je vyplněný aspoň jeden profil? Jinak nemá smysl ukazovat ani nadpis. */
export const hasSocialProfiles = Object.values(site.social).some(Boolean);

export function SocialIcons({
  className,
  size = 20,
  inverse = false,
}: {
  className?: string;
  size?: number;
  /** Na černé ploše (patička). */
  inverse?: boolean;
}) {
  // Jen sítě s vyplněným profilem v lib/site.ts
  const networks = (Object.keys(icons) as Network[]).filter((key) => site.social[key]);
  if (networks.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {networks.map((key) => (
        <li key={key}>
          <a
            href={site.social[key]}
            target="_blank"
            rel="me noopener"
            title={icons[key].label}
            className={cn(
              "grid size-10 place-items-center border transition-colors duration-150",
              inverse
                ? "border-line-inverse text-ink-inverse-muted hover:border-ink-inverse hover:text-ink-inverse"
                : "border-line text-ink-muted hover:border-ink hover:text-ink",
            )}
          >
            <span className="sr-only">{icons[key].label}</span>
            <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              {icons[key].path}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
