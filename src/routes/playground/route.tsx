import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/playground')({
  loader: () => {
    if (!import.meta.env.DEV) {
      throw notFound()
    }
  },
  component: Outlet,
})
