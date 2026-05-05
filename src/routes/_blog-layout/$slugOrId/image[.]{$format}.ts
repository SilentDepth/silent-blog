import { Resvg } from '@resvg/resvg-wasm'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { type } from 'arktype'
import { parseNotionPage } from '#/services/blog'
import { fetchPageRecordMap } from '#/services/notion'
import { createOGImage } from '#/utils/og-image'
import { initResvg } from '#/utils/resvg'

await initResvg()

export const Route = createFileRoute('/_blog-layout/$slugOrId/image.{$format}')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const recordMap = await fetchPageRecordMap({
          data: type('string.uuid').allows(params.slugOrId)
            ? { id: params.slugOrId }
            : { slug: params.slugOrId },
        })
        if (!recordMap) throw notFound()

        const page = parseNotionPage(recordMap.raw.page)
        const svg = await createOGImage(page)

        switch (params.format) {
          case 'png':
          default: {
            const image = new Resvg(svg).render().asPng()
            const arrBuf = new ArrayBuffer(image.byteLength)
            new Uint8Array(arrBuf).set(image)
            return new Response(arrBuf, {
              headers: {
                'Content-Type': 'image/png',
              },
            })
          }
        }
      },
    },
  },
})
