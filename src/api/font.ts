import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createIsomorphicFn } from '@tanstack/react-start'
import { joinURL } from 'ufo'

const loadFontFile = createIsomorphicFn()
  .server((name: string) =>
    readFile(resolve(fileURLToPath(import.meta.url), '../../../public/assets/fonts', name)),
  )
  .client((name: string) => fetch(joinURL('/assets/fonts', name)).then(res => res.arrayBuffer()))

export async function loadFonts() {
  const [NotoSerif] = await Promise.all([
    loadFontFile('NotoSerifSC-Bold.otf'),
    // loadFontFile('Inter-Regular.ttf'),
  ])
  return { NotoSerif }
}
