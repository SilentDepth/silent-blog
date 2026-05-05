declare module '*.wasm?module' {
  const mod: WebAssembly.Module | Promise<WebAssembly.Module>
  export default mod
}

declare module 'notion-types' {
  interface ExtendedRecordMap {
    raw: {
      page: import('@notionhq/client').GetPageResponse
    }
  }
}
