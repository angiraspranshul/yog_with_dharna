import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://angira-group.gitlab.io',
  base: '/yog-with-dharna',
  vite: {
    plugins: [tailwindcss()],
  },
});
