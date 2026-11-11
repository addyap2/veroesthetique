import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(output);
/* the legal page goes live only once every « À COMPLÉTER » blank is filled */
const mentionsSource = await readFile(resolve(root, 'mentions-legales.html'), 'utf8');
const mentionsPretes = !mentionsSource.includes('À COMPLÉTER');
const fichiers = ['index.html', 'confidentialite.html', '404.html', 'favicon.ico', 'styles.css', 'script.js', 'assets', '.nojekyll'];
if (mentionsPretes) fichiers.push('mentions-legales.html');
for (const file of fichiers) {
  await cp(resolve(root, file), resolve(output, file), { recursive: true });
}

/* Absolute URLs (canonical, share image, sitemap) need the public domain.
   SITE_URL wins; on Vercel the production domain is exposed automatically. */
const brut = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '');
const site = brut.replace(/\/+$/, '');

/* fingerprint CSS/JS so browsers fetch changes at once and cache unchanged files */
const empreinte = async f => createHash('sha256').update(await readFile(resolve(output, f))).digest('hex').slice(0, 10);
const versions = { 'styles.css': await empreinte('styles.css'), 'script.js': await empreinte('script.js'), 'assets/video/vero.fr.vtt': await empreinte('assets/video/vero.fr.vtt') };
for (const page of ['index.html', 'confidentialite.html', '404.html', ...(mentionsPretes ? ['mentions-legales.html'] : [])]) {
  const fichier = resolve(output, page);
  let html = await readFile(fichier, 'utf8');
  html = html.replace('<!-- build:mentions -->', mentionsPretes ? ' · <a href="mentions-legales.html">Mentions légales</a>' : '');
  for (const [f, v] of Object.entries(versions)) html = html.replaceAll(`${f}"`, `${f}?v=${v}"`);
  await writeFile(fichier, html);
}

const pages = { 'index.html': '/', 'confidentialite.html': '/confidentialite.html', ...(mentionsPretes ? { 'mentions-legales.html': '/mentions-legales.html' } : {}) };
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
        name: 'Véro Esthétique Beauté',
        slogan: 'Votre beauté, vos envies, votre moment.',
        description: 'Institut de beauté à Fréjus : soins du visage PHYT’S, massages, épilations, cils, maquillage, beauté des mains et des pieds.',
        telephone: '+33782772946',
        priceRange: '€€',
        address: { '@type': 'PostalAddress', streetAddress: '608 avenue de Lattre de Tassigny', postalCode: '83600', addressLocality: 'Fréjus', addressCountry: 'FR' },
        geo: { '@type': 'GeoCoordinates', latitude: 43.4317889, longitude: 6.750117 },
        openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '19:30' }],
        sameAs: ['https://www.planity.com/vero-esthetique-beaute-83600-frejus', 'https://www.instagram.com/veroesthetiquebeaute/'],
        url: `${site}/`,
        image: `${site}/assets/images/partage.jpg`,
        logo: `${site}/assets/apple-touch-icon.png`
      };
            const video = {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: 'Bienvenue dans mon univers — Véro Esthétique Beauté',
        description: 'Véro se présente : esthéticienne à Fréjus depuis plus de trente ans, elle vous accueille sur rendez-vous pour épilations, soins du visage, massages et maquillage.',
        thumbnailUrl: `${site}/assets/images/video-poster.webp`,
        uploadDate: '2026-11-11',
        duration: 'PT24S',
        contentUrl: `${site}/assets/originals/1000164361.mp4`,
        inLanguage: 'fr',
        transcript: 'Bonjour, moi c’est Véro. Avec 30 ans d’expérience professionnelle, j’ai enfin mon espace beauté pour vous accueillir. Besoin d’une épilation, un soin du visage, un massage détente, ou un maquillage, mise en beauté ? Je vous reçois sur rendez-vous, avenue de Lattre de Tassigny. Véro Esthétique Beauté, à très vite !'
      };
      seo += `\n  <meta property="og:image" content="${site}/assets/images/partage.jpg">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">\n  <meta property="og:image:alt" content="Carte de visite Véro Esthétique Beauté : 07 82 77 29 46, votre beauté, vos envies, votre moment.">\n  <script type="application/ld+json">${JSON.stringify(schema)}</script>\n  <script type="application/ld+json">${JSON.stringify(video)}</script>`;
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
if (!mentionsPretes) console.warn('Mentions légales : informations « À COMPLÉTER » manquantes, page non publiée.');
console.log(`Site statique prêt dans dist/${site ? ` pour ${site}` : ' (sans domaine : pas d’URL canonique ni d’image de partage absolue)'}.`);
