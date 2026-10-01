import { ReviewCard } from "./ReviewCard";
import type { ClientReview } from "@/lib/content/schema";

/**
 * Reference ve sloupcích. Na profilu v Archer Reality jsou ve slideru,
 * kde je většina schovaná za šipkami — tady jsou všechny vidět a čitelné
 * i pro vyhledávač.
 */
export function ReviewList({ reviews }: { reviews: ClientReview[] }) {
  return (
    <ul className="gap-6 sm:columns-2 lg:columns-3">
      {reviews.map((review) => (
        <li key={review.id} className="mb-6 break-inside-avoid">
          <ReviewCard review={review} />
        </li>
      ))}
    </ul>
  );
}
