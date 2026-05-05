import { createIsomorphicFn } from '@tanstack/react-start'
import { joinURL } from 'ufo'
import { getCloudflareRuntime } from '#/utils/env'
import { getSiteUrl } from '#/utils/ssr'

function fetchFromPublicUrl(name: string) {
  return fetch(joinURL(getSiteUrl(), '/assets/fonts', name)).then(res => res.arrayBuffer())
}

const loadFontFile = createIsomorphicFn()
  .server((name: string) => {
    const cloudflare = process.env.NODE_ENV === 'production' ? getCloudflareRuntime() : undefined

    return cloudflare
      ? cloudflare.env.ASSETS.fetch(joinURL('http://assets.local/assets/fonts', name)).then(res =>
          res.arrayBuffer(),
        )
      : fetchFromPublicUrl(name)
  })
  .client(fetchFromPublicUrl)

export async function loadFonts() {
  const NotoSerif = await loadFontFile('NotoSerifSC-Bold.otf')
  return { NotoSerif }
}
