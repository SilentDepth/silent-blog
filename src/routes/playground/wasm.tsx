import { Resvg } from '@resvg/resvg-wasm'
import { createFileRoute } from '@tanstack/react-router'
import satori from 'satori/standalone'
import { initResvg } from '#/utils/resvg'
import { initSatori } from '#/utils/satori'

await initSatori()
await initResvg()

function randomColor() {
  return (
    '#' +
    Math.round(0xffffff * Math.random())
      .toString(16)
      .padStart(6, '0')
  )
}

function createImage() {
  return satori(
    <div
      style={{
        width: 400,
        height: 300,
        boxSizing: 'border-box',
        border: '10px solid #f0f',
        backgroundColor: randomColor(),
      }}
    />,
    {
      width: 400,
      height: 300,
      fonts: [],
    },
  )
}

export const Route = createFileRoute('/playground/wasm')({
  server: {
    handlers: {
      GET: async () => {
        const svg = await createImage()
        const image = new Resvg(svg).render().asPng()
        const arrBuf = new ArrayBuffer(image.byteLength)
        new Uint8Array(arrBuf).set(image)
        return new Response(arrBuf, {
          headers: {
            'Content-Type': 'image/png',
          },
        })
      },
    },
  },
})
