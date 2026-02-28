/**
 * Polyfill localStorage.getItem for Node.js environments.
 *
 * @vue/devtools-kit@7.7.6 calls localStorage.getItem at module initialisation
 * without properly guarding against non-browser environments. In some Node.js
 * contexts (knip, vitest config resolution) `localStorage` is partially defined
 * (e.g. as an empty object) so the `typeof localStorage === "undefined"` guard
 * inside devtools-kit passes, but `localStorage.getItem` is still not a
 * function, causing a runtime error.
 *
 * Importing this file before `vite-plugin-vue-devtools` ensures the polyfill
 * is in place before devtools-kit runs.
 */
if (
  typeof globalThis !== 'undefined' &&
  typeof (globalThis as Record<string, unknown>).localStorage?.toString ===
    'undefined'
) {
  ;(globalThis as Record<string, unknown>).localStorage = {
    getItem: (_key: string) => null,
    setItem: (_key: string, _value: string) => undefined,
    removeItem: (_key: string) => undefined,
    clear: () => undefined,
    key: (_index: number) => null,
    length: 0
  }
}
