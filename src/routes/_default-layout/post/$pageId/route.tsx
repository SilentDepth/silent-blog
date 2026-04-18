import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'
import dayjs from 'dayjs'
import type { ExtendedRecordMap } from 'notion-types'
import { NotionRenderer } from 'react-notion-x'

import Text from '#/components/Text.tsx'
import { parseNotionPage, postQueryOptions } from '#/services/blog'
import { createSeoMeta } from '#/utils/seo'
import 'react-notion-x/styles.css'
import { isServer } from '#/utils/ssr'
import { Uuid } from '#/utils/types'

export const Route = createFileRoute('/_default-layout/post/$pageId')({
  loader: async ({ params, context }) => {
    const { pageId } = params
    if (Uuid.allows(pageId)) {
      const queryOptions = postQueryOptions(pageId)
      if (isServer()) {
        return context.queryClient.ensureQueryData(queryOptions)
      } else {
        context.queryClient.prefetchQuery(queryOptions)
      }
    } else {
      throw notFound()
    }
  },
  head: ({ params, loaderData }) => ({
    meta: [
      ...createSeoMeta({
        ...(loaderData ? parseNotionPage({ ...loaderData.raw.page }) : undefined),
        url: `/post/${params.pageId}`,
        image: `/post/${params.pageId}/image`,
      }),
    ],
  }),
  headers: () => ({
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=604800',
  }),
  staleTime: 5 * 60_000,
  component: Page,
  pendingComponent: PendingComponent,
})

function PendingComponent() {
  return <PageRenderer skeleton title="Lorem ipsum dolor sit amet" />
}

function Page() {
  const { pageId } = Route.useParams()
  const { data: recordMap } = useSuspenseQuery(postQueryOptions(pageId))
  const { title, createdTime } = parseNotionPage(recordMap.raw.page)

  return (
    <div className="px-10">
      <PageRenderer title={title} createdTime={createdTime} recordMap={recordMap} />
    </div>
  )
}

interface PageRenderProps {
  skeleton?: boolean
  title: string
  createdTime?: string
  recordMap?: ExtendedRecordMap
}

function PageRenderer({ skeleton, title, createdTime, recordMap }: PageRenderProps) {
  return (
    <>
      <header className="max-w-prose mx-auto mb-4">
        <h1 className="text-3xl font-serif font-black mb-2">
          <Text value={title} skeleton={skeleton} />
        </h1>
        <p className="text-sm text-olive-500 prepend-zws">
          {createdTime && dayjs(createdTime).format('YYYY-MM-DD')}
        </p>
      </header>
      <div className="notion-wrapper max-w-prose mx-auto">
        {recordMap ? (
          <NotionRenderer recordMap={recordMap} />
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
    </>
  )
}
