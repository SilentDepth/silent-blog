import 'react-notion-x/styles.css'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import dayjs from 'dayjs'
import type { ExtendedRecordMap } from 'notion-types'
import type { ComponentProps, PropsWithChildren } from 'react'
import { Suspense, useContext, createContext } from 'react'
import { joinURL } from 'ufo'
import NotionRenderer from '#/components/NotionRenderer'
import Text from '#/components/Text'
import { parseNotionPage, postQueryOptions } from '#/services/blog'
import { cn } from '#/utils/classname'
import { createSeoMeta } from '#/utils/seo'
import { getSiteUrl, isClient, isServer, prepareQueryData } from '#/utils/ssr'
import { Uuid } from '#/utils/types'
import css from './route.module.css'

export const Route = createFileRoute('/_blog-layout/$slugOrId')({
  loader: async ({ params, context }) => {
    const data = await prepareQueryData(context.queryClient, postQueryOptions(params.slugOrId))
    if (data) {
      const parsed = parseNotionPage(data.raw.page)
      if (isClient() && !Uuid.allows(params.slugOrId) && parsed.slug) {
        throw redirect({
          params: { slugOrId: parsed.slug },
          mask: {
            to: '.',
            params: { slugOrId: parsed.id },
          },
        })
      } else {
        return data
      }
    } else if (isServer()) {
      throw notFound()
    }
  },
  headers: () => ({
    'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    'CDN-Cache-Control': 'max-age=172800',
  }),
  staleTime: 5 * 60_000,
  head: async ({ params, loaderData }) => {
    const parsedPage = loaderData ? parseNotionPage(loaderData.raw.page) : undefined
    const url = joinURL(getSiteUrl(), `${(parsedPage?.slug || parsedPage?.id) ?? params.slugOrId}`)
    return {
      meta: [
        ...createSeoMeta({
          ...parsedPage,
          description: parsedPage?.summary,
          url,
          image: joinURL(url, 'image.png'),
        }),
      ],
    }
  },
  pendingComponent: PageRenderer,
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={<PageRenderer />}>
      <PostProvider>
        <PageRenderer />
      </PostProvider>
    </Suspense>
  )
}

const PostContext = createContext<
  | {
      title: string
      date?: string
      recordMap: ExtendedRecordMap
    }
  | undefined
>(undefined)

function PostProvider({ children }: PropsWithChildren) {
  const { slugOrId } = Route.useParams()
  const { data } = useSuspenseQuery(postQueryOptions(slugOrId))
  const parsed = data && parseNotionPage(data.raw.page)

  return (
    <PostContext value={data && parsed ? { ...parsed, recordMap: data } : undefined}>
      {children}
    </PostContext>
  )
}

function PageRenderer({ className, ...attrs }: Omit<ComponentProps<'div'>, 'children'>) {
  const ctx = useContext(PostContext)

  return (
    <div {...attrs} className={cn('px-4 sm:px-10', ctx && css.post_entering, className)}>
      <header className="max-w-prose mx-auto mb-4">
        <h1 className={cn('text-3xl font-black mb-2', ctx && 'font-serif')}>
          {ctx ? <Text value={ctx.title} /> : <Text value="Lorem ipsum dolor sit amet" skeleton />}
        </h1>
        <p className="text-sm prepend-zws text-gray-500">
          {ctx?.date && dayjs(ctx.date).format('YYYY-MM-DD')}
        </p>
      </header>
      <div className="notion-wrapper max-w-prose mx-auto">
        {ctx ? (
          <NotionRenderer recordMap={ctx.recordMap} />
        ) : (
          <div>
            <div className="notion-text">
              <Text
                value="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad beatae culpa distinctio eaque ex, laborum possimus repellat sequi suscipit. Blanditiis deleniti facilis fuga itaque non numquam omnis porro rem temporibus."
                skeleton
              />
            </div>
            <div className="notion-text">
              <Text
                value="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab amet blanditiis dolorem excepturi explicabo?"
                skeleton
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
