/// <reference types="vite/client" />

interface ViteTypeOptions {}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_WEB_URL: string;
  readonly VITE_STORAGE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
