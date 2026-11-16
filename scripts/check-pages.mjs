import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import ts from 'typescript';

const base = `/${(process.env.PAGES_BASE_PATH || '').replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/');
const out = resolve('dist');
const slugs = [...(await readFile('src/data.ts', 'utf8')).matchAll(/slug:'([^']+)'/g)].map(m => m[1]);
assert.equal(slugs.length, 4, 'Expected four service routes');
const index = await readFile(resolve(out, 'index.html'), 'utf8');
for (const slug of slugs) {
  assert.equal(await readFile(resolve(out, 'services', slug, 'index.html'), 'utf8'), index);
}
let checked = 0;
async function checkUrl(url, file) {
  if (/^(data:|https?:|#)/.test(url)) return;
  const clean = url.split(/[?#]/)[0];
  if (clean.startsWith('/')) assert.ok(clean.startsWith(base), `Wrong base: ${url}`);
  const path = clean.startsWith('/') ? resolve(out, decodeURIComponent(clean.slice(base.length))) : resolve(dirname(file), decodeURIComponent(clean));
  assert.ok((await stat(path)).isFile(), `Missing asset: ${url}`);
  checked++;
}
for (const match of index.matchAll(/(?:src|href)="([^"]+)"/g)) await checkUrl(match[1], resolve(out, 'index.html'));
for (const name of await readdir(resolve(out, 'assets'))) {
  if (!name.endsWith('.css')) continue;
  const file = resolve(out, 'assets', name);
  for (const match of (await readFile(file, 'utf8')).matchAll(/url\(["']?([^\s)"']+)["']?\)/g)) await checkUrl(match[1], file);
}
// Verify the actual router helper against root, nested and refreshed URLs.
const source = (await readFile('src/urls.ts', 'utf8')).replaceAll('import.meta.env.BASE_URL', JSON.stringify(base));
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { siteUrl, pagePath } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
assert.equal(pagePath(base), '');
assert.equal(pagePath(base.slice(0, -1) || '/'), '');
for (const slug of slugs) {
  const route = `services/${slug}`;
  assert.equal(pagePath(siteUrl(route)), route);
  assert.equal(pagePath(siteUrl(`${route}/`)), route);
}
assert.equal(siteUrl('#services'), `${base}#services`);
for (const name of ['hero-background.png', 'services-cabinet.png', 'project-crane-cabinet.png', 'project-hoist.png', 'project-contactors.png', 'motor-transparent.png']) {
  await checkUrl(siteUrl(`images/${name}`), resolve(out, 'index.html'));
}
console.log(`Pages checks passed: base=${base}, ${slugs.length} direct service entrypoints, ${checked} asset references.`);
