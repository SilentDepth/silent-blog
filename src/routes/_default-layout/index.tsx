import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { Suspense } from 'react'
import { tv } from 'tailwind-variants'
import MingcuteQuoteRightFill from '~icons/mingcute/quote-right-fill'
import { Route as PostRoute } from '#/routes/_default-layout/post/$pageId/route'
import { postsQueryOptions } from '#/services/blog'

export const Route = createFileRoute('/_default-layout/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(postsQueryOptions())
  },
  headers: () => ({
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=604800',
  }),
  staleTime: 5 * 60_000,
  // pendingComponent: () => <Page skeleton />,
  component: Page,
})

function Page() {
  return (
    <main className="px-8">
      <Suspense fallback={<p>Loading</p>}>
        <PostList />
      </Suspense>
    </main>
  )
}

const postStyles = tv({
  slots: {
    root: 'col-span-full',
    title: 'prose-base',
    time: 'text-sm tabular-nums text-olive-500',
  },
  variants: {
    isLight: {
      true: {
        root: 'py-2 [&+&]:-mt-4 border-t [&+&]:border-t-0 border-b border-olive-300 flex flex-col relative',
        time: 'mb-1',
      },
      false: {
        root: 'grid grid-cols-subgrid',
        title: 'font-serif font-semibold',
        time: 'leading-7',
      },
    },
  },
})

function PostList() {
  const { data: posts } = useSuspenseQuery(postsQueryOptions())

  return (
    <ul className="max-w-prose mx-auto grid grid-cols-[auto_1fr] gap-4">
      {posts?.map(page => {
        const styles = postStyles(page)
        const title = <p className={styles.title()}>{page.title}</p>
        return (
          <li key={page.id} className={styles.root()}>
            <span className={styles.time()}>{dayjs(page.createdTime).format('YYYY-MM-DD')}</span>
            {page.isLight ? (
              title
            ) : (
              <Link to={PostRoute.to} params={{ pageId: page.id }}>
                {title}
              </Link>
            )}
            {page.isLight && (
              <MingcuteQuoteRightFill className="size-8 text-olive-300 absolute top-0 right-0" />
            )}
          </li>
        )
      })}
    </ul>
  )
}
