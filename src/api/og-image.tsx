import { createServerFn } from '@tanstack/react-start'
import satori from 'satori'
import sharp from 'sharp'

import IMG_LOGO from '#/assets/images/pengin_outline.png?inline'

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const WIDTH = 1200
const HEIGHT = 630
const EM = 80

export const createOGImage = createServerFn()
  .inputValidator((data: { title: string }) => data)
  .handler(async ({ data }) => {
    const fontData = await readFile(
      resolve(fileURLToPath(import.meta.url), '../../assets/fonts/NotoSerifSC-Bold.otf'),
    )
    const svg = await satori(
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          padding: EM,
          background: `radial-gradient(100% 100% at 100% 0%, #4b585b, #161b1d 80%)`,
          position: 'relative',
        }}
      >
        <img
          src={IMG_LOGO}
          alt=""
          style={{
            width: EM * 0.6,
            height: EM * 0.6,
            position: 'absolute',
            top: EM,
            right: EM,
          }}
        />
        <div
          style={{
            fontSize: EM,
            color: 'white',
            width: WIDTH * 0.8 - EM,
            position: 'absolute',
            left: EM,
            bottom: HEIGHT * 0.2,
          }}
        >
          {data.title}
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            data: fontData,
            name: 'Noto Serif',
            weight: 400,
            style: 'normal',
          },
        ],
      },
    )
    return sharp(Buffer.from(svg)).toFormat('webp').toBuffer()
  })
