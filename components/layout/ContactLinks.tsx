import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 5.2 2 2 0 0 1 6 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" stroke="currentColor" strokeWidth="1.6" />
      <path d="m3.5 7 8.5 6 8.5-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

/** Telefon a e-mail pod sebou s ikonami. */
export function ContactLinks({
  className,
  inverse = false,
}: {
  className?: string;
  /** Na černé ploše (patička). */
  inverse?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-2 text-sm", className)}>
      <a
        href={site.phoneHref}
        className="group flex items-center gap-2.5 font-semibold whitespace-nowrap"
      >
        <PhoneIcon />
        <span className="tnum group-hover:underline group-hover:underline-offset-4">
          {site.phone}
        </span>
      </a>
      <a
        href={`mailto:${site.email}`}
        className={cn(
          "group flex items-center gap-2.5 whitespace-nowrap",
          inverse ? "text-ink-inverse-muted" : "text-ink-muted",
        )}
      >
        <MailIcon />
        <span className="group-hover:underline group-hover:underline-offset-4">
          {site.email}
        </span>
      </a>
    </div>
  );
}
