import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/playground/@{$name}')({
  component: RouteComponent,
})

function RouteComponent() {
  const { name } = Route.useParams()

  return <div>Hello "/playground/@{name}"!</div>
}
