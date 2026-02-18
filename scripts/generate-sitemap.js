const fs = require('fs')
const path = require('path')

const SITE_URL = process.env.SITE_URL || ''
if (!SITE_URL) {
  console.error('SITE_URL environment variable is required. Example: SITE_URL=https://example.com npm run generate-sitemap')
  process.exit(1)
}

const pages = [
  '/',
  '/skills',
  '/projects',
  '/about',
  '/contact'
]

const urls = pages.map(p => `  <url>\n    <loc>${SITE_URL.replace(/\/$/, '')}${p}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`).join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`

const outDir = path.join(__dirname, '..', 'public')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap, 'utf8')

const robots = `User-agent: *\nAllow: /\nSitemap: ${SITE_URL.replace(/\/$/, '')}/sitemap.xml\n`
fs.writeFileSync(path.join(outDir, 'robots.txt'), robots, 'utf8')

console.log('Wrote sitemap and robots.txt to', outDir)
