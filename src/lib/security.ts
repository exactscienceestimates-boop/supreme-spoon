// Allowed MIME types for claim uploads
export const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES = 10;

// Strip HTML tags and control characters from user input
export function sanitizeString(input: string, maxLength = 500): string {
  return input
    .replace(/<[^>]*>/g, "")           // strip HTML tags
    .replace(/[^\x20-\x7E\n\r\t]/g, "") // strip non-printable chars
    .trim()
    .slice(0, maxLength);
}

export function sanitizeEmail(email: string): string {
  const clean = email.trim().toLowerCase().slice(0, 254);
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(clean)) throw new Error("Invalid email address");
  return clean;
}

export function sanitizePhone(phone: string): string {
  // Keep only digits, spaces, hyphens, parens, plus
  return phone.replace(/[^0-9\s\-().+]/g, "").trim().slice(0, 20);
}

export function validateSquareFootage(value: number): number {
  if (isNaN(value) || value < 200 || value > 50000) {
    throw new Error("Square footage must be between 200 and 50,000");
  }
  return Math.round(value);
}

export function validatePitch(pitch: string): string {
  const allowed = ["low", "medium", "steep"];
  if (!allowed.includes(pitch)) throw new Error("Invalid pitch value");
  return pitch;
}

export function validateStories(stories: number): number {
  if (isNaN(stories) || stories < 1 || stories > 10) {
    throw new Error("Stories must be between 1 and 10");
  }
  return Math.round(stories);
}

export function validateFile(file: File): void {
  if (!ALLOWED_FILE_TYPES.has(file.type)) {
    throw new Error(`File type not allowed: ${file.type}`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large: ${file.name} (max 10MB)`);
  }
  // Block executable-looking filenames
  const dangerous = /\.(exe|bat|sh|cmd|ps1|js|php|py|rb|jar)$/i;
  if (dangerous.test(file.name)) {
    throw new Error(`File type not permitted: ${file.name}`);
  }
}
