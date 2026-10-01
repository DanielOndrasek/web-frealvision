/**
 * Hvězdičky. Půlhvězdy vědomě neřešíme — u průměru se zaokrouhluje
 * a číslo je stejně napsané slovy vedle.
 */
export function Stars({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "lg";
}) {
  const px = size === "lg" ? "h-5 w-5" : "h-4 w-4";
  const rounded = Math.round(rating);

  return (
    <span
      className="inline-flex gap-0.5"
      role="img"
      aria-label={`Hodnocení ${rating} z 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`${px} ${i <= rounded ? "text-dot" : "text-line-strong"}`}
          fill="currentColor"
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}
