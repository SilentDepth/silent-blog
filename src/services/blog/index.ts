import type {
  GetPageResponse,
  GetDataSourceResponse,
  DatePropertyItemObjectResponse,
  FormulaPropertyItemObjectResponse,
} from '@notionhq/client'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { match, type } from 'arktype'
import type { PickDeep } from 'type-fest'
import { PageProperty } from '#/services/notion'
import * as notion from '#/services/notion'

const POSTS_VIEW_ID = process.env.POSTS_VIEW_ID!
const PAGES_VIEW_ID = process.env.PAGES_VIEW_ID!

const DateProperty = type({
  date: { start: 'string' },
})
const NotionPage = type({
  id: 'string.uuid',
  created_time: 'string',
  properties: {
    title: {
      title: type({ plain_text: 'string' }).array(),
    },
    slug: {
      rich_text: type({ plain_text: 'string' }).array(),
    },
    date: type.or(DateProperty, { formula: DateProperty }),
  },
})

export const fetchPosts = createServerFn()
  .inputValidator((data?: { raw?: boolean }) => data)
  .handler(async ({ data: { raw } = {} }) => {
    const pages = await notion.fetchViewResults({
      data: {
        view_id: POSTS_VIEW_ID,
        sorts: [{ property: PageProperty.date, direction: 'descending' }],
      },
    })
    return {
      items: pages.map(parseNotionPage),
      raw: raw ? pages : undefined,
    }
  })

export const postsQueryOptions = () =>
  queryOptions({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(),
    staleTime: 5 * 60_000,
  })

export const fetchLinks = createServerFn()
  .inputValidator((data?: { raw?: boolean }) => data)
  .handler(async ({ data: { raw } = {} }) => {
    const pages = await notion.fetchViewResults({
      data: {
        view_id: PAGES_VIEW_ID,
        sorts: [{ property: PageProperty.order, direction: 'ascending' }],
      },
    })
    return {
      items: pages.map(parseNotionPage),
      raw: raw ? pages : undefined,
    }
  })

export const linksQueryOptions = () =>
  queryOptions({
    queryKey: ['links'],
    queryFn: () => fetchLinks(),
    staleTime: 15 * 60_000,
  })

export const postQueryOptions = (slugOrId: string) =>
  queryOptions({
    queryKey: ['post', slugOrId],
    queryFn: () => {
      return notion.fetchPageRecordMap({
        data: match({
          'string.uuid': id => ({ id }),
          string: slug => ({ slug }),
          default: 'never',
        })(slugOrId),
      })
    },
    staleTime: 5 * 60_000,
  })

/**/

export function parseNotionPage(page: GetPageResponse | GetDataSourceResponse) {
  const _page = NotionPage.assert(page)
  return {
    id: _page.id,
    title: _page.properties.title.title.map(it => it.plain_text).join(''),
    slug: _page.properties.slug.rich_text.map(it => it.plain_text).join(''),
    date: getDatePropertyValue(_page.properties.date),
    isLight: match
      .case({ properties: { type: { type: '"select"', select: { name: '"Light"' } } } }, () => true)
      .default(() => false)(page),
  }
}

export type PostInfo = ReturnType<typeof parseNotionPage>

function getDatePropertyValue(
  property:
    | PickDeep<DatePropertyItemObjectResponse, 'date.start'>
    | PickDeep<FormulaPropertyItemObjectResponse, 'formula.date.start'>,
) {
  return match
    .case({ date: { start: 'string' } }, property => property.date.start)
    .case({ formula: { date: { start: 'string' } } }, property => property.formula.date.start)
    .default(() => undefined)(property)
}
