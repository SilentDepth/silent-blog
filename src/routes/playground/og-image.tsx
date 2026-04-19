import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAsync } from 'react-use'
import satori from 'satori'
import { loadFont } from '#/api/font'
import IMG_LOGO from '#/assets/images/pengin_outline.png?inline'

const font = loadFont()

export const Route = createFileRoute('/playground/og-image')({
  component: RouteComponent,
})

const WIDTH = 1200
const HEIGHT = 630
const EM = 80

function RouteComponent() {
  const { value } = useAsync(async () => {
    return satori(
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          padding: EM,
          background: `radial-gradient(100% 100% at 100% 0%, oklch(45% 0.017 213.2), oklch(21.8% 0.008 223.9) 80%)`,
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
          这是一行测试文本
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            data: await font,
            name: 'Noto Serif',
            weight: 400,
            style: 'normal',
          },
        ],
      },
    )
  }, [])

  const [small, setSmall] = useState(true)

  return (
    <div className="p-10">
      <div
        className="mx-auto"
        style={{ width: WIDTH, height: HEIGHT, scale: small ? '50%' : undefined }}
        onClick={() => setSmall(val => !val)}
        dangerouslySetInnerHTML={{ __html: value ?? '' }}
      />
      <div
        className="font-serif font-bold mx-auto overflow-hidden"
        style={{ width: WIDTH, height: HEIGHT, scale: small ? '50%' : undefined }}
        onClick={() => setSmall(val => !val)}
      >
        <div
          className="size-full bg-radial-[at_0_0] from-mist-600 to-mist-900 to-80% relative"
          style={{ fontSize: EM, lineHeight: 1.05, padding: EM }}
        >
          <img
            src={IMG_LOGO}
            alt=""
            className="absolute"
            style={{ width: EM * 0.6, height: EM * 0.6, top: EM, right: EM }}
          />
          <div
            className="text-white absolute"
            style={{ width: WIDTH * 0.8 - EM, left: EM, bottom: HEIGHT * 0.2 }}
          >
            这是一行测试文本
          </div>
        </div>
      </div>
    </div>
  )
}
