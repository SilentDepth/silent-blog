import satori, { init as initWasm } from 'satori/standalone'
// @ts-ignore
import yogaWasm from 'satori/yoga.wasm'
import { loadFonts } from '#/api/font'
import IMG_LOGO from '#/assets/images/pengin_outline.png?inline'

await initWasm(yogaWasm)

const WIDTH = 1200
const HEIGHT = 630
const EM = 80

function hashString(value: string) {
  let hash = 2166136261

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

function createSeededRandom(seed: number) {
  let current = seed

  return () => {
    current += 0x6d2b79f5
    let next = Math.imul(current ^ (current >>> 15), current | 1)
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61)
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296
  }
}

function hslToHex(hue: number, saturation: number, lightness: number) {
  const normalizedHue = ((hue % 360) + 360) % 360
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
  const segment = normalizedHue / 60
  const secondary = chroma * (1 - Math.abs((segment % 2) - 1))
  const match = lightness - chroma / 2

  let red = 0
  let green = 0
  let blue = 0

  if (segment >= 0 && segment < 1) {
    red = chroma
    green = secondary
  } else if (segment < 2) {
    red = secondary
    green = chroma
  } else if (segment < 3) {
    green = chroma
    blue = secondary
  } else if (segment < 4) {
    green = secondary
    blue = chroma
  } else if (segment < 5) {
    red = secondary
    blue = chroma
  } else {
    red = chroma
    blue = secondary
  }

  const toHex = (channel: number) =>
    Math.round((channel + match) * 255)
      .toString(16)
      .padStart(2, '0')

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`
}

function createTitleVisualCode(title: string) {
  const random = createSeededRandom(hashString(title))
  const baseHue = random() * 360
  const hues = [0, 1, 2].map(idx => (baseHue + idx * 120 + (random() * 36 - 18) + 360) % 360)
  const colors = hues.map(hue => hslToHex(hue, 0.28, 0.35))
  const stops = [14 + random() * 14, 42 + random() * 16, 70 + random() * 16].map(
    stop => `${stop.toFixed(2)}%`,
  )

  return `linear-gradient(to bottom left, #394447, #090b0c 80%, ${colors.map((color, idx) => `${color}`).join(',')})`
}

export async function createOGImage(data: { title: string }) {
  const { NotoSerif } = await loadFonts()

  return satori(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        padding: EM,
        backgroundColor: '#090b0c',
        backgroundImage: [
          'linear-gradient(to bottom left, #394447, #090b0c 60%, #090b0c00)',
          `url("data:image/svg+xml,%3Csvg width='80' height='24' viewBox='0 0 40 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6.172L6.172 0h5.656L0 11.828V6.172zm40 5.656L28.172 0h5.656L40 6.172v5.656zM6.172 12l12-12h3.656l12 12h-5.656L20 3.828 11.828 12H6.172zm12 0L20 10.172 21.828 12h-3.656z' fill='%23fff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        ].join(','),
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
          display: 'flex',
          width: WIDTH * 0.8 - EM,
          fontSize: EM,
          position: 'absolute',
          left: EM,
          bottom: HEIGHT * 0.2,
        }}
      >
        <span
          style={{
            lineHeight: 1,
            color: '#d0d6d8',
          }}
        >
          {data.title}
        </span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Serif',
          weight: 400,
          style: 'normal',
          data: NotoSerif,
        },
      ],
    },
  )
}
