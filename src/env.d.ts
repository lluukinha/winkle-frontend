// <reference types="vite/client" />
/*
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
*/

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TITLE: string;
  readonly BACKEND_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
