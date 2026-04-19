import 'react-notion-x/styles.css'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { joinURL } from 'ufo'
import PageRenderer from '#/components/PageRenderer'
import { parseNotionPage, postQueryOptions } from '#/services/blog'
import { createSeoMeta } from '#/utils/seo'
import { isClient, isServer, prepareQueryData } from '#/utils/ssr'
import { Uuid } from '#/utils/types'

export const Route = createFileRoute('/_default-layout/$slugOrId/')({
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
  head: async ({ params, loaderData }) => {
    const parsedPage = loaderData ? parseNotionPage(loaderData.raw.page) : undefined
    const url = `/${(parsedPage?.slug || parsedPage?.id) ?? params.slugOrId}`
    return {
      meta: [
        ...createSeoMeta({
          ...parsedPage,
          url,
          image: joinURL(url, 'image.webp'),
        }),
      ],
    }
  },
  headers: () => ({
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=604800',
  }),
  staleTime: 5 * 60_000,
  pendingComponent: PendingComponent,
  component: RouteComponent,
})

function PendingComponent() {
  return <PageRenderer skeleton title="Lorem ipsum dolor sit amet" />
}

function RouteComponent() {
  const { slugOrId } = Route.useParams()
  const { data } = useQuery(postQueryOptions(slugOrId))

  if (!data) return null

  const { title, date } = parseNotionPage(data.raw.page)

  return (
    <div className="px-10">
      <PageRenderer title={title} date={date} recordMap={data} />
    </div>
  )
}
