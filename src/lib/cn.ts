type ClassValue = string | number | null | undefined | false | ClassValue[];

/**
 * Joins conditional class names.
 *
 * Deliberately hand-rolled rather than pulling in clsx + tailwind-merge: this UI
 * never overrides a utility that a variant already sets, so conflict resolution
 * would be ~7 KB of runtime buying nothing.
 */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];

  for (const value of values) {
    if (!value) continue;
    if (Array.isArray(value)) {
      const nested = cn(...value);
      if (nested) out.push(nested);
    } else {
      out.push(String(value));
    }
  }

  return out.join(' ');
}
