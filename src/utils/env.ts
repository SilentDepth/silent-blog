import { createServerOnlyFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

export const isVercel = createServerOnlyFn(() => Boolean(process.env.VERCEL))

export const isCloudflare = createServerOnlyFn(() => Boolean(getCloudflareRuntime()))

export const getCloudflareRuntime = createServerOnlyFn(() => getRequest().runtime?.cloudflare)
