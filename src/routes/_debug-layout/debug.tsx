import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import * as notion from '#/services/notion'
import { isClient } from '#/utils/ssr.ts'

const fetchPagesOfView = createServerFn().handler(() =>
  notion.fetchPagesOfView({ data: process.env.POSTS_VIEW_ID! }),
)

export const Route = createFileRoute('/_debug-layout/debug')({
  loader: async () => {
    if (isClient()) {
      console.log('LOADER CALLED ON CLIENT')
    }
    return {
      viewQueryResults: await fetchPagesOfView(),
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { viewQueryResults } = Route.useLoaderData()

  return (
    <div>
      <pre className="text-xs" onClick={() => console.log(viewQueryResults)}>
        {JSON.stringify(viewQueryResults, null, 2)}
      </pre>
    </div>
  )
}
