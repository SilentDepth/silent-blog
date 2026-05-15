import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { random } from 'es-toolkit'
import type { ComponentProps } from 'react'
import { Suspense } from 'react'
import { tv } from 'tailwind-variants'
import MingcuteQuoteRightFill from '~icons/mingcute/quote-right-fill'
import Text from '#/components/Text'
import type { PostInfo } from '#/services/blog'
import { postsQueryOptions } from '#/services/blog'
import { cn } from '#/utils/classname'
import { Route as PageRoute } from './$slugOrId/route'
import css from './index.module.css'

let animated = false

export const Route = createFileRoute('/_blog-layout/')({
  headers: () => ({
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=604800',
  }),
  staleTime: 5 * 60_000,
  component: Page,
})

function Page() {
  return (
    <main className="px-4 sm:px-10">
      <ul className="max-w-prose mx-auto grid grid-cols-[auto_1fr] gap-x-4 gap-y-8">
        <Suspense
          fallback={
            <>
              {Array.from({ length: 5 }, (_, idx) => (
                <PostItem key={idx} />
              ))}
            </>
          }
        >
          <PostList />
        </Suspense>
      </ul>
    </main>
  )
}

function PostList() {
  const { data: posts } = useSuspenseQuery(postsQueryOptions())

  return posts?.items?.map((it, idx) => (
    <PostItem
      key={it?.id ?? idx}
      data={it}
      className={cn(css.post_item, !animated && css.animate)}
      style={{ '--delay': idx < 9 ? idx * 0.1 + 's' : '0.9s' }}
      onAnimationEnd={() => {
        animated = true
      }}
    />
  ))
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
    summary: 'opacity-75',
  },
  variants: {
    isLight: {
      true: {
        root: [
          'py-4 [&+&]:-mt-8 border-t [&+&]:border-t-0 border-b flex flex-col relative',
          // Light mode
          'border-olive-300',
          // Dark mode
          'dark:border-mist-700',
        ],
        time: 'mb-1',
      },
      false: {
        root: 'grid grid-cols-subgrid gap-y-1',
        title: 'font-serif font-semibold',
        time: 'leading-7',
        summary: 'col-start-2 text-sm',
      },
    },
  },
})

function PostItem({ data, className, ...attrs }: ComponentProps<'li'> & { data?: PostInfo }) {
  const skeleton = !data
  const styles = postStyles(data)

  const title = (
    <p className={styles.title()}>
      <Text value={data?.title ?? 'o'.repeat(30 + random(30))} skeleton={skeleton} />
    </p>
  )

  return (
    <li {...attrs} className={styles.root({ className })}>
      <time dateTime={data?.date} className={styles.time()}>
        <Text
          value={data ? dayjs(data.date).format('YYYY-MM-DD') : '2000-01-01'}
          skeleton={skeleton}
        />
      </time>
      {!data || data.isLight ? (
        title
      ) : (
        <Link
          to={PageRoute.to}
          params={{ slugOrId: data.id }}
          mask={{ to: PageRoute.to, params: { slugOrId: data.slug } }}
        >
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
      {data?.summary && <p className={styles.summary()}>{data.summary}</p>}
    </li>
  )
}
