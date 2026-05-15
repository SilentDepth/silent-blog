import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { twMerge as cn } from 'tailwind-merge'
import { tv } from 'tailwind-variants'
import NotionRenderer from '#/components/NotionRenderer'
import { parseNotionPage, postQueryOptions } from '#/services/blog'

export const Route = createFileRoute('/_debug-layout/$slugOrId/debug')({
  component: RouteComponent,
})

const tabStyle = tv({
  base: 'px-3 py-1.5 text-sm',
  variants: {
    isCurrent: {
      true: 'font-medium text-white bg-black',
    },
  },
})

const TABS = [
  { value: 'parsed', label: 'Parsed' },
  { value: 'raw', label: 'Raw data' },
]

const classNames = {
  dlItem: 'px-4 py-2',
  dt: 'text-gray-500',
} as const

function RouteComponent() {
  const [currTab, setCurrTab] = useState<string>('parsed')

  const { slugOrId } = Route.useParams()
  const { data } = useQuery(postQueryOptions(slugOrId))

  const { title, date } = data ? parseNotionPage(data.raw.page) : {}

  return (
    <>
      <header className="flex-none px-4 py-2 border-b border-gray-300 flex gap-2">
        {TABS.map(tab => (
          <button
            key={tab.value}
            type="button"
            className={tabStyle({ isCurrent: currTab === tab.value })}
            onClick={() => setCurrTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </header>
      {currTab === 'parsed' && (
        <div
          className="grid divide-x divide-gray-300 overflow-hidden"
          style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)' }}
        >
          <dl className="text-sm divide-y divide-gray-300">
            <div className={classNames.dlItem}>
              <dt className={classNames.dt}>
                <code>title</code>
              </dt>
              <dd>{title}</dd>
            </div>
            <div className={classNames.dlItem}>
              <dt className={classNames.dt}>
                <code>date</code>
              </dt>
              <dd>{date}</dd>
            </div>
          </dl>
          <div className={cn(classNames.dlItem, 'overflow-auto')}>
            <p className={classNames.dt}>Content</p>
            {data && <NotionRenderer recordMap={data} />}
          </div>
        </div>
      )}
      {currTab === 'raw' && (
        <div className="flex-1 p-4 overflow-auto">
          <pre className="text-xs" onClick={() => console.log(data)}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </>
  )
}
