import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ─── Class Name Merger ────────────────────────────────────────────────────────
/**
 * Merge Tailwind classes intelligemment en résolvant les conflits.
 * Utilisation : cn('px-4 py-2', isActive && 'bg-primary-600', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── Formatage Monétaire ──────────────────────────────────────────────────────
/**
 * Formate un montant en devise.
 * @example formatPrice(1250.5) → "1 250,50 €"
 */
export function formatPrice(
  amount: number,
  currency = 'EUR',
  locale = 'fr-FR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ─── Formatage de Date ────────────────────────────────────────────────────────
/**
 * Formate une date en chaîne lisible.
 * @example formatDate('2026-05-23') → "23 mai 2026"
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  },
  locale = 'fr-FR'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(d);
}

/**
 * Formate une date relative (il y a X minutes, etc.).
 * @example formatRelativeDate(new Date()) → "il y a quelques secondes"
 */
export function formatRelativeDate(date: string | Date, locale = 'fr-FR'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffSeconds < 60) return rtf.format(-diffSeconds, 'second');
  if (diffMinutes < 60) return rtf.format(-diffMinutes, 'minute');
  if (diffHours < 24) return rtf.format(-diffHours, 'hour');
  if (diffDays < 30) return rtf.format(-diffDays, 'day');

  return formatDate(d);
}

// ─── Formatage de Nombres ─────────────────────────────────────────────────────
/**
 * Formate un nombre avec séparateurs.
 * @example formatNumber(1234567) → "1 234 567"
 */
export function formatNumber(value: number, locale = 'fr-FR'): string {
  return new Intl.NumberFormat(locale).format(value);
}

// ─── Async Utilities ──────────────────────────────────────────────────────────
/**
 * Pause asynchrone — utile pour les tests ou les animations séquentielles.
 * @example await sleep(300)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Debounce ─────────────────────────────────────────────────────────────────
/**
 * Retarde l'exécution d'une fonction jusqu'à ce que le délai soit écoulé.
 * Préférer le hook useDebounce pour les composants React.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ─── String Utilities ─────────────────────────────────────────────────────────
/**
 * Tronque une chaîne de caractères à une longueur maximale.
 * @example truncate("Hello World", 8) → "Hello..."
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Convertit une chaîne en slug URL-friendly.
 * @example slugify("Hello World!") → "hello-world"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Capitalise la première lettre d'une chaîne.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ─── Array Utilities ──────────────────────────────────────────────────────────
/**
 * Groupe un tableau d'objets par une clé.
 * @example groupBy(users, 'role') → { ADMIN: [...], USER: [...] }
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const group = String(item[key]);
      result[group] = result[group] ?? [];
      result[group].push(item);
      return result;
    },
    {} as Record<string, T[]>
  );
}

// ─── Object Utilities ─────────────────────────────────────────────────────────
/**
 * Retire les clés avec valeurs undefined/null d'un objet.
 * Utile pour nettoyer les paramètres de query avant envoi API.
 */
export function cleanObject<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined && value !== null)
  ) as Partial<T>;
}

// ─── Type Guards ──────────────────────────────────────────────────────────────
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}
