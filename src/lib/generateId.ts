/**
 * ID Generator Utility
 * Generates unique IDs for documents and entities
 */

/**
 * Generate a unique ID
 * Uses crypto.randomUUID() when available, with fallback to Math.random()
 * @returns A unique identifier string
 */
export const generateId = (): string => {
  // Use crypto.randomUUID() if available (modern browsers and Node.js 15+)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate a short, human-readable ID
 * Useful for user-facing identifiers
 * @returns A short unique identifier
 */
export const generateShortId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

/**
 * Generate a nanoid-style ID (21 characters, URL-safe)
 * @returns A compact unique identifier
 */
export const generateNanoId = (): string => {
  const alphabet =
    'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRSTUVWXYZcdefghijkmnpqrstvwxyz';
  let id = '';
  let randomBytes;

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    randomBytes = new Uint8Array(21);
    crypto.getRandomValues(randomBytes);
  } else {
    // Fallback for older browsers
    randomBytes = new Uint8Array(21);
    for (let i = 0; i < 21; i++) {
      randomBytes[i] = Math.floor(Math.random() * 256);
    }
  }

  for (let i = 0; i < 21; i++) {
    id += alphabet[randomBytes[i] & 63];
  }

  return id;
};
