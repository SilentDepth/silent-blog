import { Client } from '@notionhq/client'
import { createServerFn } from '@tanstack/react-start'
import { setResponseHeaders } from '@tanstack/react-start/server'
import { NotionCompatAPI } from 'notion-compat'

export const notion = new NotionCompatAPI(new Client({ auth: process.env.NOTION_API_KEY }))

export const fetchPagesOfView = createServerFn()
  .inputValidator((data: string) => data)
  .handler(async ({ data: view_id }) => {
    const viewQuery = await notion.client.views.queries.create({
      view_id,
    })
    const { results } = await notion.client.views.queries.results({
      view_id,
      query_id: viewQuery.id,
    })
    return Promise.all(results.map(async ({ id }) => fetchPageRecordMap({ data: id })))
  })

export const fetchPageRecordMap = createServerFn()
  .inputValidator((data: string) => data)
  .handler(async ({ data: pageId }) => {
    setResponseHeaders(
      new Headers({
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=604800',
      }),
    )
    return notion.getPage(pageId)
  })
