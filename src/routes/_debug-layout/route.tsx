import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_debug-layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-dvh p-10 flex flex-col overflow-hidden">
      <Outlet />
    </div>
  )
}
