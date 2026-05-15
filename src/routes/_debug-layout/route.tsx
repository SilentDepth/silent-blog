import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'

const devOnly = createMiddleware().server(({ next }) => {
  if (!import.meta.env.DEV) {
    throw notFound()
  }
  return next()
})

export const Route = createFileRoute('/_debug-layout')({
  server: {
    middleware: [devOnly],
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <Outlet />
    </div>
  )
}
