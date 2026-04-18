import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite-plus'

const config = defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    semi: false,
    singleQuote: true,
    arrowParens: 'avoid',
    sortImports: {
      groups: ['external', 'internal', 'parent', 'sibling'],
      internalPattern: ['#'],
      partitionByNewline: false,
    },
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(),
    nitro(),
    react(),
    icons({
      compiler: 'jsx',
      jsx: 'react',
      autoInstall: true,
    }),
  ],
})

export default config
