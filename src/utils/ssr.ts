import type { QueryClient, AnyUseQueryOptions } from '@tanstack/react-query'

export function isServer() {
  return typeof window === 'undefined'
}

export function isClient() {
  return !isServer()
}

export async function prepareQueryData<T extends AnyUseQueryOptions>(
  client: QueryClient,
  queryOptions: T,
) {
  if (isServer()) {
    return await client.ensureQueryData(queryOptions)
  } else {
    client.prefetchQuery(queryOptions)
  }
}
