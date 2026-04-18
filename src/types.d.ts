import { GetPageResponse } from '@notionhq/client'

declare module 'notion-types' {
  interface ExtendedRecordMap {
    raw: {
      page: GetPageResponse
    }
  }
}
