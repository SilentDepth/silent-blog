import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import MingcuteLoading3Line from '~icons/mingcute/loading-3-line'
import { fetchLinks, fetchPosts } from '#/services/blog'

export const Route = createFileRoute('/_debug-layout/debug')({
  ssr: false,
  component: RouteComponent,
})

function RouteComponent() {
  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['debug', 'posts'],
    queryFn: () => fetchPosts({ data: { raw: true } }),
  })
  const { data: links, isLoading: isLoadingLinks } = useQuery({
    queryKey: ['debug', 'links'],
    queryFn: () => fetchLinks({ data: { raw: true } }),
  })

  return (
    <div className="h-full grid grid-flow-col auto-cols-fr gap-10">
      <div className="overflow-auto">
        <div className="flex items-center">
          <p>Posts</p>
          {isLoadingPosts && <MingcuteLoading3Line className="size-5 animate-spin ml-2" />}
        </div>
        {posts?.items.map((it, idx) => (
          <pre key={it.id} className="text-xs" onClick={() => console.log(posts.raw![idx])}>
            {JSON.stringify(it, null, 2)}
          </pre>
        ))}
      </div>
      <div className="overflow-auto">
        <div className="flex items-center">
          <p>Links</p>
          {isLoadingLinks && <MingcuteLoading3Line className="size-5 animate-spin ml-2" />}
        </div>
        {links?.items.map((it, idx) => (
          <pre key={it.id} className="text-xs" onClick={() => console.log(links.raw![idx])}>
            {JSON.stringify(it, null, 2)}
          </pre>
        ))}
      </div>
    </div>
  )
}
