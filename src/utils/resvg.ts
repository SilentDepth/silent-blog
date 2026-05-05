import { initWasm } from '@resvg/resvg-wasm'
import wasm from '@resvg/resvg-wasm/index_bg.wasm?module'

let initialized = false

export async function initResvg() {
  if (initialized) return

  await initWasm(wasm)
  initialized = true
}
