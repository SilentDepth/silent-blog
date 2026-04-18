import type { GetPageResponse } from '@notionhq/client'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { match, type } from 'arktype'
import * as notion from '#/services/notion'

const POSTS_VIEW_ID = process.env.POSTS_VIEW_ID!

const NotionPage = type({
  id: 'string.uuid',
  created_time: 'string',
  properties: {
    title: {
      title: type({ plain_text: 'string' }).array(),
    },
  },
})

export const fetchPosts = createServerFn().handler(async () => {
  const recordMaps = await notion.fetchPagesOfView({ data: POSTS_VIEW_ID })
  return recordMaps.map(recordMap => parseNotionPage(recordMap.raw.page))
})

export const postsQueryOptions = () =>
  queryOptions({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(),
    staleTime: 5 * 60_000,
  })

export const postQueryOptions = (pageId: string) =>
  queryOptions({
    queryKey: ['post', pageId],
    queryFn: () => notion.fetchPageRecordMap({ data: pageId }),
    staleTime: 5 * 60_000,
  })

export function parseNotionPage(page: GetPageResponse) {
  const _page = NotionPage.assert(page)
  return {
    id: _page.id,
    title: _page.properties?.title.title.map(it => it.plain_text).join(''),
    createdTime: _page.created_time,
    isLight: match
      .case({ properties: { type: { type: '"select"', select: { name: '"Light"' } } } }, () => true)
      .default(() => false)(page),
  }
}
