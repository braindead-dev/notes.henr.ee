/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://notes.henr.ee",
  generateRobotsTxt: false,
  exclude: ["/admin", "/admin/*", "/api/*", "/[id]", "/auth/*", "/assets/*"],
  generateIndexSitemap: false,
  changefreq: "daily",
  priority: 0.7,
  transform: async (config, path) => {
    let priority = 0.7;
    if (path === "/") priority = 1.0;
    if (path === "/paste") priority = 0.8;
    if (path === "/encryption") priority = 0.7;

    return {
      loc: path,
      changefreq: config.changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
