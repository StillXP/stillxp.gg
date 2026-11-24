import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const contentFile = fileURLToPath(new URL('./src/content.json', import.meta.url));
const requiredKeys = ['person', 'lockIn', 'deepDives', 'experience', 'background'];

// Dev only: the #edit page POSTs the whole content object here and it is written to
// src/content.json. Nothing like this exists in the production build.
function contentEditor(): Plugin {
  return {
    name: 'content-editor',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__content', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end();
          return;
        }
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const missing = requiredKeys.filter((k) => !(k in data));
            if (missing.length) throw new Error(`Missing ${missing.join(', ')}`);
            writeFileSync(contentFile, JSON.stringify(data, null, 2) + '\n');
            res.statusCode = 204;
            res.end();
          } catch (err) {
            res.statusCode = 400;
            res.end(err instanceof Error ? err.message : 'Invalid content');
          }
        });
      });
    },
  };
}

// Build only: copies index.html to dist/work/<slug>/index.html for every case study, so
// /work/<slug>/ loads on any static host (GitHub Pages, Netlify, Vercel) without rewrites.
function caseStudyPages(): Plugin {
  let outDir = 'dist';
  return {
    name: 'case-study-pages',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      const studiesDir = fileURLToPath(new URL('./src/case-studies/', import.meta.url));
      const index = readFileSync(`${outDir}/index.html`, 'utf8');
      for (const file of readdirSync(studiesDir).filter((f) => f.endsWith('.json'))) {
        const { slug, title } = JSON.parse(readFileSync(`${studiesDir}${file}`, 'utf8'));
        const html = index.replace(/<title>[^<]*<\/title>/, `<title>${title.replace(/</g, '&lt;')} · Andrew Still</title>`);
        mkdirSync(`${outDir}/work/${slug}`, { recursive: true });
        writeFileSync(`${outDir}/work/${slug}/index.html`, html);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), contentEditor(), caseStudyPages()],
  resolve: {
    // @stillxp/* are linked from the sibling repo; make sure they share this app's React.
    dedupe: ['react', 'react-dom'],
  },
});
