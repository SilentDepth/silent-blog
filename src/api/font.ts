import { createIsomorphicFn } from '@tanstack/react-start'

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const loadFont = createIsomorphicFn()
  .server(() =>
    readFile(
      resolve(fileURLToPath(import.meta.url), '../../../public/assets/fonts/NotoSerifSC-Bold.otf'),
    ),
  )
  .client(() => fetch('/assets/fonts/NotoSerifSC-Bold.otf').then(res => res.arrayBuffer()))
