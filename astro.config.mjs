import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// On GitLab Pages, derive the base path from the actual Pages URL so the site
// works both with a unique domain (served at /) and a path-based domain
// (served at /yog-with-dharna). Locally, the base is /.
const pagesUrl = process.env.CI_PAGES_URL;
const base = pagesUrl ? new URL(pagesUrl).pathname : '/';
const site = pagesUrl ? new URL(pagesUrl).origin : 'http://localhost:4321';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  vite: {
    plugins: [tailwindcss()],
  },
});
