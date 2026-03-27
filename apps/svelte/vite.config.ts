import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { devtools } from '@tanstack/devtools-vite';

export default defineConfig({
  plugins: [devtools(), tailwindcss(), sveltekit(), devtoolsJson()],
});
