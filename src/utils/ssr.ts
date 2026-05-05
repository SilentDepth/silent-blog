import type { EnsureQueryDataOptions, QueryClient } from '@tanstack/react-query'
import { createIsomorphicFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { hasProtocol, withProtocol } from 'ufo'

export const isServer = createIsomorphicFn()
  .server(() => true)
  .client(() => false)

export function isClient() {
  return !isServer()
}

type PreparedQueryOptions = EnsureQueryDataOptions<any, any, any, any, never>
type PreparedQueryData<TQueryOptions extends PreparedQueryOptions> =
  TQueryOptions extends EnsureQueryDataOptions<any, any, infer TData, any, never> ? TData : never

export async function prepareQueryData<TQueryOptions extends PreparedQueryOptions>(
  client: QueryClient,
  queryOptions: TQueryOptions,
): Promise<PreparedQueryData<TQueryOptions> | void> {
  if (isServer()) {
    return await client.ensureQueryData(queryOptions)
  } else {
    void client.prefetchQuery(queryOptions)
  }
}

export const getSiteUrl = createIsomorphicFn()
  .server(() => {
    let origin = process.env.SITE_URL || process.env.VERCEL_URL || new URL(getRequest().url).origin
    if (!hasProtocol(origin)) {
      origin = withProtocol(origin, 'http:')
    }
    return origin
  })
  .client(() => location.origin)
