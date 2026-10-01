/** Spojení tříd bez další závislosti. Falsy hodnoty vypadnou. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
