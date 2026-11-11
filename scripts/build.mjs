import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(output);
for (const file of ['index.html', 'confidentialite.html', '404.html', 'styles.css', 'script.js', 'assets', '.nojekyll']) {
  await cp(resolve(root, file), resolve(output, file), { recursive: true });
}

/* Absolute URLs (canonical, share image, sitemap) need the public domain.
   SITE_URL wins; on Vercel the production domain is exposed automatically. */
const brut = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '');
const site = brut.replace(/\/+$/, '');

const pages = { 'index.html': '/', 'confidentialite.html': '/confidentialite.html' };
for (const [page, chemin] of Object.entries(pages)) {
  const fichier = resolve(output, page);
  let html = await readFile(fichier, 'utf8');
  let seo = '';
  if (site) {
    seo += `<link rel="canonical" href="${site}${chemin}">\n  <meta property="og:url" content="${site}${chemin}">`;
    if (page === 'index.html') {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'BeautySalon',
        name: 'Véro Esthétique',
        slogan: 'Votre beauté, vos envies, votre moment.',
        description: 'Institut de beauté : soins du visage PHYT’S, soins du corps, épilations, beauté du regard, des mains et des pieds.',
        telephone: '+33782772946',
        url: `${site}/`,
        image: `${site}/assets/images/partage.jpg`,
        logo: `${site}/assets/apple-touch-icon.png`
      };
      seo += `\n  <meta property="og:image" content="${site}/assets/images/partage.jpg">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">\n  <meta property="og:image:alt" content="Carte de visite Véro Esthétique : 07 82 77 29 46, votre beauté, vos envies, votre moment.">\n  <script type="application/ld+json">${JSON.stringify(schema)}</script>`;
    }
  }
  html = html.replace('<!-- build:seo -->', seo);
  await writeFile(fichier, html);
}

await writeFile(resolve(output, 'robots.txt'), `User-agent: *\nAllow: /\n${site ? `Sitemap: ${site}/sitemap.xml\n` : ''}`);
if (site) {
  const urls = Object.values(pages).map(c => `  <url><loc>${site}${c}</loc></url>`).join('\n');
  await writeFile(resolve(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}
console.log(`Site statique prêt dans dist/${site ? ` pour ${site}` : ' (sans domaine : pas d’URL canonique ni d’image de partage absolue)'}.`);
