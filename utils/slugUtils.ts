// utils/slugUtils.ts

export function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace spaces and non-alphanumeric characters with hyphens
      .replace(/(^-|-$)+/g, '');    // Remove leading or trailing hyphens
  }
  
  export function generateRandomString(length: number = 6): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  