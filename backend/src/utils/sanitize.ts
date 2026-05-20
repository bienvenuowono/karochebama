import DOMPurify from 'isomorphic-dompurify';

/**
 * Nettoie une chaîne de caractères contre les attaques XSS.
 */
export const sanitize = (text: string): string => {
  if (typeof text !== 'string') return text;
  return DOMPurify.sanitize(text).trim();
};

/**
 * Nettoie récursivement tous les champs de type String d'un objet.
 */
export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const result = { ...obj };
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const val = result[key];
      if (typeof val === 'string') {
        result[key] = sanitize(val) as any;
      } else if (val !== null && typeof val === 'object') {
        result[key] = sanitizeObject(val);
      }
    }
  }
  return result;
};
