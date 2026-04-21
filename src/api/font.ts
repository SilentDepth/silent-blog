import { joinURL } from 'ufo'

const loadFontFile = (name: string) =>
  fetch(joinURL(`${process.env.SITE_URL || process.env.VERCEL_URL || ''}/assets/fonts`, name)).then(
    res => res.arrayBuffer(),
  )

export async function loadFonts() {
  const [NotoSerif] = await Promise.all([
    loadFontFile('NotoSerifSC-Bold.otf'),
    // loadFontFile('Inter-Regular.ttf'),
  ])
  return { NotoSerif }
}
