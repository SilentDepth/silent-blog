declare module 'notion-types' {
  interface ExtendedRecordMap {
    raw: {
      page: import('@notionhq/client').GetPageResponse
    }
  }
}
