import { createFileRoute, notFound } from '@tanstack/react-router'
import { type } from 'arktype'
import { createOGImage } from '#/api/og-image'
import { parseNotionPage } from '#/services/blog'
import { fetchPageRecordMap } from '#/services/notion'

export const Route = createFileRoute('/_default-layout/$slugOrId/image/webp')({
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
        const image = await createOGImage({ data: page })
        const arrBuf = new ArrayBuffer(image.byteLength)
        new Uint8Array(arrBuf).set(image)
        return new Response(arrBuf, {
          headers: {
            'Content-Type': 'image/webp',
          },
        })
      },
    },
  },
})
