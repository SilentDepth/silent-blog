import { joinURL } from 'ufo'
import { getSiteUrl } from '#/utils/ssr'

const loadFontFile = (name: string) =>
  fetch(joinURL(getSiteUrl(), 'assets/fonts', name)).then(res => res.arrayBuffer())

export async function loadFonts() {
  const [NotoSerif] = await Promise.all([
    loadFontFile('NotoSerifSC-Bold.otf'),
    // loadFontFile('Inter-Regular.ttf'),
  ])
  return { NotoSerif }
}
