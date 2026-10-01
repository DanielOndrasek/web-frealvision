import { Stars } from "./Stars";
import type { ClientReview } from "@/lib/content/schema";

/** „2025-03“ → „březen 2025“; celé datum → „12. 3. 2025“. */
function formatReviewDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  if (day) return `${day}. ${month}. ${year}`;
  const months = [
    "leden", "únor", "březen", "duben", "květen", "červen",
    "červenec", "srpen", "září", "říjen", "listopad", "prosinec",
  ];
  return `${months[month - 1]} ${year}`;
}

export function ReviewCard({ review }: { review: ClientReview }) {
  return (
    <figure className="flex h-full flex-col border border-line bg-surface p-7 sm:p-8">
      <span aria-hidden className="font-serif text-6xl leading-[0.6] text-ink">
        “
      </span>

      {review.rating ? (
        <div className="mt-6">
          <Stars rating={review.rating} />
        </div>
      ) : null}

      <blockquote className="mt-5 flex-1 text-[1.0625rem] leading-relaxed text-ink">
        <p>{review.text}</p>
      </blockquote>

      <figcaption className="mt-7 flex items-center gap-3 border-t border-line pt-5">
        <span aria-hidden className="size-1.5 shrink-0 bg-dot" />
        <span className="min-w-0">
          <span className="block text-sm font-semibold">{review.author}</span>
          {review.context || review.date ? (
            <span className="block text-xs text-ink-subtle">
              {[review.context, review.date ? formatReviewDate(review.date) : null]
                .filter(Boolean)
                .join(" · ")}
            </span>
          ) : null}
        </span>
      </figcaption>
    </figure>
  );
}
