/**
 * Email domain typo detection utility
 * Detects common typos in email domains and suggests corrections
 */

const COMMON_DOMAINS = [
  // Global
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "live.com",
  "aol.com",
  "mail.com",
  "protonmail.com",
  "proton.me",

  // German/Austrian/Swiss
  "web.de",
  "gmx.de",
  "gmx.at",
  "gmx.ch",
  "gmx.net",
  "t-online.de",
  "freenet.de",
  "1und1.de",
  "online.de",
  "arcor.de",
  "vodafone.de",
  "posteo.de",
  "mailbox.org",
  "bluewin.ch",
  "sunrise.ch",
  "a1.at",
  "aon.at",

  // Italian
  "libero.it",
  "virgilio.it",
  "alice.it",
  "tin.it",
  "tiscali.it",
  "fastwebnet.it",
  "tim.it",
  "email.it",
  "pec.it",
  "aruba.it",
  "inwind.it",
  "iol.it",
  "kataweb.it",
  "poste.it",
  "telecomitalia.it",

  // French
  "orange.fr",
  "free.fr",
  "sfr.fr",
  "laposte.net",
  "wanadoo.fr",

  // Dutch
  "ziggo.nl",
  "kpnmail.nl",
  "xs4all.nl",

  // Belgian
  "telenet.be",
  "skynet.be",
  "proximus.be",
];

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  // Initialize first column
  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }

  // Initialize first row
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1, // deletion
        );
      }
    }
  }

  return matrix[a.length][b.length];
}

/**
 * Get email suggestion if a typo is detected in the domain
 * @param email - The email address to check
 * @returns The suggested corrected email, or null if no suggestion
 */
export function getEmailSuggestion(email: string): string | null {
  if (!email || !email.includes("@")) {
    return null;
  }

  const [localPart, domain] = email.split("@");

  if (!domain || !localPart) {
    return null;
  }

  const lowerDomain = domain.toLowerCase();

  // If domain exactly matches a known domain, no suggestion needed
  if (COMMON_DOMAINS.includes(lowerDomain)) {
    return null;
  }

  // Find the closest matching domain
  let closestDomain: string | null = null;
  let minDistance = Infinity;

  for (const knownDomain of COMMON_DOMAINS) {
    const distance = levenshteinDistance(lowerDomain, knownDomain);

    if (distance < minDistance) {
      minDistance = distance;
      closestDomain = knownDomain;
    }
  }

  // Only suggest if the distance is small enough (likely a typo)
  // Threshold of 2 catches: gmail.con, gmial.com, homail.com, etc.
  if (closestDomain && minDistance > 0 && minDistance <= 2) {
    return `${localPart}@${closestDomain}`;
  }

  return null;
}
