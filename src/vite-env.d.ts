/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string;
  // add other custom env vars here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
