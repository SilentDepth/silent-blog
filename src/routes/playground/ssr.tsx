import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { postsQueryOptions } from '#/services/blog'

export const Route = createFileRoute('/playground/ssr')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(postsQueryOptions())
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useSuspenseQuery(postsQueryOptions())

  return (
    <div className="p-10">
      <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
