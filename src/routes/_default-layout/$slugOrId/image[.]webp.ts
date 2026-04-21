import { createFileRoute, notFound } from '@tanstack/react-router'
import { type } from 'arktype'
import sharp from 'sharp'
import { parseNotionPage } from '#/services/blog'
import { fetchPageRecordMap } from '#/services/notion'
import { createOGImage } from '#/utils/og-image'

export const Route = createFileRoute('/_default-layout/$slugOrId/image.webp')({
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
        const image = await sharp(Buffer.from(svg)).webp({ lossless: true }).toBuffer()
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
