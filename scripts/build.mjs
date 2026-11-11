import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(output);
for (const file of ['index.html', 'confidentialite.html', 'styles.css', 'script.js', 'assets', '.nojekyll']) {
  await cp(resolve(root, file), resolve(output, file), { recursive: true });
}
console.log('Site statique prêt dans dist/. Aucun service externe ni secret requis.');
