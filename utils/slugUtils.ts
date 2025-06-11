// utils/slugUtils.ts

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace spaces and non-alphanumeric characters with hyphens
    .replace(/(^-|-$)+/g, ""); // Remove leading or trailing hyphens
}

export function generateRandomString(length: number = 6): string {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Generates a unique ID by combining the slug and a random string.
 * If the slug is empty, returns only the random string without a dash.
 * @param title The title of the paste
 * @returns A unique ID string
 */
export function generateUniqueId(title: string): string {
  const slug = generateSlug(title);
  const randomString = generateRandomString();

  if (slug) {
    return `${slug}-${randomString}`;
  } else {
    return randomString;
  }
}
