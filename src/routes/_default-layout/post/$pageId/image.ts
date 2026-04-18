import { createFileRoute } from '@tanstack/react-router'
import { createOGImage } from '#/api/og-image.tsx'
import { parseNotionPage } from '#/services/blog'
import { fetchPageRecordMap } from '#/services/notion'

export const Route = createFileRoute('/_default-layout/post/$pageId/image')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const recordMap = await fetchPageRecordMap({ data: params.pageId })
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
