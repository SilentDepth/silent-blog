import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { random } from 'es-toolkit'
import { tv } from 'tailwind-variants'
import MingcuteQuoteRightFill from '~icons/mingcute/quote-right-fill'
import Text from '#/components/Text'
import type { PostInfo } from '#/services/blog'
import { postsQueryOptions } from '#/services/blog'
import { cn } from '#/utils/classname'
import { isServer } from '#/utils/ssr'
import { Route as PostRoute } from './post/$pageId/route'

export const Route = createFileRoute('/_default-layout/')({
  loader: async ({ context }) => {
    const queryOptions = postsQueryOptions()
    if (isServer()) {
      await context.queryClient.ensureQueryData(queryOptions)
    } else {
      context.queryClient.prefetchQuery(queryOptions)
    }
  },
  headers: () => ({
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=604800',
  }),
  staleTime: 5 * 60_000,
  component: Page,
})

function Page() {
  const { data: posts = [], isLoading } = useQuery(postsQueryOptions())

  return (
    <main className="px-10">
      <PostList posts={isLoading ? undefined : posts} />
    </main>
  )
}

const postStyles = tv({
  slots: {
    root: 'col-span-full',
    title: 'prose-base',
    time: [
      'text-sm tabular-nums',
      // Light mode
      'text-olive-500',
      // Dark mode
      'dark:text-mist-500',
    ],
  },
  variants: {
    isLight: {
      true: {
        root: [
          'py-2 [&+&]:-mt-4 border-t [&+&]:border-t-0 border-b flex flex-col relative',
          // Light mode
          'border-olive-300',
          // Dark mode
          'dark:border-mist-700',
        ],
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

function PostList({ posts }: { posts?: PostInfo[] }) {
  return (
    <ul className="max-w-prose mx-auto grid grid-cols-[auto_1fr] gap-4">
      {(posts ?? Array.from<undefined>({ length: 5 })).map((it, idx) => (
        <PostItem key={it?.id ?? idx} data={it} />
      ))}
    </ul>
  )
}

function PostItem({ data }: { data?: PostInfo }) {
  const skeleton = !data
  const styles = postStyles(data)

  const title = (
    <p className={styles.title()}>
      <Text value={data?.title ?? 'o'.repeat(30 + random(30))} skeleton={skeleton} />
    </p>
  )

  return (
    <li className={styles.root()}>
      <span className={styles.time()}>
        <Text
          value={data ? dayjs(data.createdTime).format('YYYY-MM-DD') : '2000-01-01'}
          skeleton={skeleton}
        />
      </span>
      {!data || data.isLight ? (
        title
      ) : (
        <Link to={PostRoute.to} params={{ pageId: data.id }}>
          {title}
        </Link>
      )}
      {data?.isLight && (
        <MingcuteQuoteRightFill
          className={cn(
            'size-8 absolute top-0 right-0',
            // Light mode
            'text-olive-300',
            // Dark mode
            'dark:text-mist-700',
          )}
        />
      )}
    </li>
  )
}
