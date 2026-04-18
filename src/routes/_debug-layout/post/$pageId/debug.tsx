import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { postQueryOptions } from '#/services/blog'

export const Route = createFileRoute('/_debug-layout/post/$pageId/debug')({
  component: RouteComponent,
})

function RouteComponent() {
  const { pageId } = Route.useParams()
  const { data } = useQuery(postQueryOptions(pageId))

  return (
    <div>
      <pre className="text-xs" onClick={() => console.log(data)}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
