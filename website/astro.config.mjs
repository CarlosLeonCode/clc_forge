import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://carlosleoncode.github.io',
  base: process.env.ASTRO_BASE || '/clc_forge',
  vite: {
    plugins: [tailwindcss()],
  },
});
