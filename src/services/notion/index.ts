import { Client } from '@notionhq/client'
import type { QueryDataSourceParameters } from '@notionhq/client'
import { createServerFn, createServerOnlyFn } from '@tanstack/react-start'
import { setResponseHeaders } from '@tanstack/react-start/server'
import { type } from 'arktype'
import { NotionCompatAPI } from 'notion-compat'

const notion = new NotionCompatAPI(new Client({ auth: process.env.NOTION_API_KEY }))

export const getNotion = createServerOnlyFn(() => notion)

export enum PageProperty {
  title = 'title',
  summary = 'summary',
  type = 'type',
  slug = 'slug',
  date = 'date',
  order = 'order',
}

export const fetchViewResults = createServerFn()
  .inputValidator((data: { view_id: string; sorts?: QueryDataSourceParameters['sorts'] }) => data)
  .handler(async ({ data: { view_id, sorts } }) => {
    setResponseHeaders(
      new Headers({
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=604800',
      }),
    )

    // Retrieve the view object to get the filter configuration
    const view = await notion.client.views.retrieve({ view_id })
    return await (async () => {
      // TODO: There is a `filter` prop in the view object. What is that?
      if (type({ data_source_id: 'string', 'quick_filters?': 'object' }).allows(view)) {
        const filterEntries = view.quick_filters ? Object.entries(view.quick_filters) : []
        const res = await notion.client.dataSources.query({
          data_source_id: view.data_source_id,
          filter_properties: Object.keys(PageProperty),
          filter: {
            and: filterEntries.map(it => ({
              property: it[0],
              ...it[1],
            })),
          },
          sorts,
        })
        return res.results
      } else {
        return []
      }
    })()
  })

export const fetchPageRecordMap = createServerFn()
  .inputValidator((data: { id?: string; slug?: string }) => data)
  .handler(async ({ data: { id, slug } }) => {
    setResponseHeaders(
      new Headers({
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=604800',
      }),
    )

    if (id) {
      return notion.getPage(id)
    }
    if (slug) {
      const view = await notion.client.views.retrieve({ view_id: process.env.POSTS_VIEW_ID! })
      if (type({ data_source_id: 'string' }).allows(view)) {
        const res = await notion.client.dataSources.query({
          data_source_id: view.data_source_id,
          filter_properties: [],
          filter: {
            property: PageProperty.slug,
            rich_text: { equals: slug },
          },
        })
        if (res.results.length) {
          return notion.getPage(res.results[0].id)
        }
      }
    }
    return null
  })
