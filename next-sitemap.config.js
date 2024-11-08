/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://notes.henr.ee',
  generateRobotsTxt: false, // Since we're creating it manually
  exclude: ['/admin/*', '/api/*', '/[id]'], // Exclude dynamic paste pages and admin/API routes
  generateIndexSitemap: false,
  changefreq: {
    '/': 'daily',
    '/paste': 'daily',
    '/encryption': 'daily'
  },
  priority: {
    '/': 1.0,
    '/paste': 0.8,
    '/encryption': 0.7
  }
}
