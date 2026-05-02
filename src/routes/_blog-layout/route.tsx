import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'
import { twMerge as cn } from 'tailwind-merge'
import MingcuteArrowLeftLine from '~icons/mingcute/arrow-left-line'
import ThemeToggle from '#/components/ThemeToggle'
import { linksQueryOptions } from '#/services/blog'
import { prepareQueryData } from '#/utils/ssr'
import { Route as PageRoute } from './$slugOrId'

export const Route = createFileRoute('/_blog-layout')({
  loader: async ({ context }) => {
    await prepareQueryData(context.queryClient, linksQueryOptions())
  },
  component: DefaultLayout,
  notFoundComponent: Error404,
})

function DefaultLayout({ children = <Outlet /> }: PropsWithChildren) {
  return (
    <div>
      <LayoutHeader />
      {children}
      <LayoutFooter />
    </div>
  )
}

function LayoutHeader() {
  return (
    <header className="px-10 py-4">
      <div className="max-w-prose mx-auto py-4 flex items-center gap-4">
        <HomeLink />
        <div className="contents text-sm *:first:ml-auto">
          <TopLinks />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

function HomeLink() {
  return (
    <Link to="/" className="flex items-center group">
      {({ isActive }) => (
        <>
          <div
            className={cn(
              'size-8 rounded-md grid place-items-center *:row-start-1 *:col-start-1 overflow-hidden',
              isActive
                ? 'bg-olive-50 dark:bg-mist-700'
                : 'bg-olive-100 dark:bg-mist-700 border border-black/5',
            )}
            style={{ fontSize: 20 }}
          >
            <span
              className={cn(
                'transition duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]',
                isActive ? '' : '-translate-x-8',
              )}
            >
              🐧
            </span>
            <MingcuteArrowLeftLine
              className={cn(
                'size-5 group-hover:text-sky-500 transition duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]',
                isActive ? 'translate-x-8' : '',
              )}
            />
          </div>
          <strong className="font-light ml-[0.5em]">SILENT BLOG</strong>
        </>
      )}
    </Link>
  )
}

function TopLinks() {
  const { data: links } = useQuery(linksQueryOptions())

  return (
    <>
      {links?.items.map(it => (
        <Link
          key={it.id}
          to={PageRoute.to}
          params={{ slugOrId: it.id }}
          mask={{
            to: PageRoute.to,
            params: { slugOrId: it.slug },
          }}
        >
          {it.title}
        </Link>
      ))}
    </>
  )
}

function LayoutFooter() {
  return (
    <footer className="py-8 flex justify-center items-center">
      <p className="flex items-center gap-[0.5em]">
        🐧<span className="text-sm text-olive-500 dark:text-mist-500">2026</span>
      </p>
    </footer>
  )
}

function Error404() {
  return (
    <DefaultLayout>
      <div className="max-w-prose mx-auto">
        <p>
          <span className="text-2xl">404</span>
          <br />
          <span className="text-gray-500">Not Found</span>
        </p>
      </div>
    </DefaultLayout>
  )
}
