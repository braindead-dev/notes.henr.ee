/** @type {import('next-sitemap').IConfig} */
// Note: This config is now deprecated in favor of app/sitemap.ts
// which dynamically generates the sitemap including public pastes.
// Keeping this file for backwards compatibility but it won't be used.
module.exports = {
  siteUrl: "https://notes.henr.ee",
  generateRobotsTxt: false,
  exclude: ["*"], // Exclude all - using app/sitemap.ts instead
  generateIndexSitemap: false,
};
