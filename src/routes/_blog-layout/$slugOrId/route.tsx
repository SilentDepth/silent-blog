import 'react-notion-x/styles.css'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import type { ComponentProps } from 'react'
import { Suspense } from 'react'
import { twMerge as cn } from 'tailwind-merge'
import { joinURL } from 'ufo'
import PageRenderer from '#/components/PageRenderer'
import { parseNotionPage, postQueryOptions } from '#/services/blog'
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
  pendingComponent: PendingComponent,
  component: RouteComponent,
})

function PendingComponent() {
  return (
    <PageLayoutRenderer>
      <PageRenderer skeleton title="Lorem ipsum dolor sit amet" />
    </PageLayoutRenderer>
  )
}

function RouteComponent() {
  const { slugOrId } = Route.useParams()
  const { data } = useSuspenseQuery(postQueryOptions(slugOrId))

  if (!data) return <PageRenderer skeleton title="Lorem ipsum dolor sit amet" />

  const { title, date } = parseNotionPage(data.raw.page)

  return (
    <PageLayoutRenderer className={css.post_content}>
      <PageRenderer title={title} date={date} recordMap={data} />
    </PageLayoutRenderer>
  )
}

function PageLayoutRenderer({ className, children, ...attrs }: ComponentProps<'div'>) {
  return (
    <div {...attrs} className={cn('px-4 sm:px-10', className)}>
      <Suspense>{children}</Suspense>
    </div>
  )
}
