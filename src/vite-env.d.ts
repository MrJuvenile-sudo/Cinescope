/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TMDB_CREDENTIAL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
