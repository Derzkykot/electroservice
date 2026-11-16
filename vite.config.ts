import { defineConfig } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { services } from './src/data';

// The workflow supplies Pages' real base path; local development stays at /.
const base = `/${(process.env.PAGES_BASE_PATH || '').replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/');

export default defineConfig({
  base,
  plugins: [{
    name: 'static-service-entrypoints',
    apply: 'build',
    async closeBundle() {
      // GitHub Pages has no SPA rewrite rules. Real entry files let service
      // links and browser refresh work without a redirect/404 workaround.
      const out = resolve('dist');
      const html = await readFile(resolve(out, 'index.html'), 'utf8');
      for (const { slug } of services) {
        const directory = resolve(out, 'services', slug);
        await mkdir(directory, { recursive: true });
        await writeFile(resolve(directory, 'index.html'), html);
      }
      await writeFile(resolve(out, '.nojekyll'), '');
    },
  }],
});
