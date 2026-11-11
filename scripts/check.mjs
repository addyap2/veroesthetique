import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', 'confidentialite.html', 'mentions-legales.html'];
const documents = new Map();
let references = 0;

for (const page of pages) {
  const html = await readFile(resolve(root, page), 'utf8');
  assert.match(html, /<html lang="fr">/, `${page}: langue française manquante`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${page}: un seul titre principal attendu`);
  assert.match(html, /name="viewport"/, `${page}: viewport manquant`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${page}: identifiants en double`);
  for (const tag of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(tag[0], /\balt="[^"]*"/, `${page}: texte alternatif manquant`);
  }
  documents.set(page, { html, ids: new Set(ids) });
}

for (const [page, { html }] of documents) {
  const urls = [...html.matchAll(/\b(?:src|href|poster)="([^"]+)"/g)].map(match => match[1]);
  for (const srcset of html.matchAll(/\bsrcset="([^"]+)"/g)) {
    urls.push(...srcset[1].split(',').map(item => item.trim().split(/\s+/)[0]));
  }
  for (const url of urls) {
    if (/^(?:tel:|sms:|https?:|data:)/.test(url)) continue;
    const [file, anchor] = url.split('#');
    const target = resolve(root, dirname(page), file || page);
    assert.ok(!relative(root, target).startsWith('..'), `Chemin hors du site : ${url}`);
    await access(target);
    if (anchor) {
      const targetPage = relative(root, target);
      assert.ok(documents.get(targetPage)?.ids.has(anchor), `${page}: ancre introuvable ${url}`);
    }
    references++;
  }
}

const originalDir = resolve(root, 'assets/originals');
const manifest = JSON.parse(await readFile(resolve(originalDir, 'manifest.json'), 'utf8'));
assert.equal(Object.keys(manifest).length, 9, 'Les huit photos et la vidéo sont attendues');
for (const [file, expected] of Object.entries(manifest)) {
  const data = await readFile(resolve(originalDir, file));
  assert.equal(data.length, expected.bytes, `${file}: taille originale modifiée`);
  assert.equal(createHash('sha256').update(data).digest('hex'), expected.sha256, `${file}: original modifié`);
}
assert.equal((await readdir(originalDir)).filter(file => file.endsWith('.jpg')).length, 8);
console.log(`OK : ${pages.length} pages françaises, ${references} liens/ressources locaux, 9 originaux intacts.`);
