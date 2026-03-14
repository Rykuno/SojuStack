import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    ignorePatterns: ['apps/api/generated/*'],
    singleQuote: true,
    jsxSingleQuote: true,
    printWidth: 100,
  },
  lint: { options: { typeAware: true, typeCheck: true } },
});
