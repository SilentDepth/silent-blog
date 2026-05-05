import { init } from 'satori/standalone'
import wasm from 'satori/yoga.wasm?module'

let initialized = false

export async function initSatori() {
  if (initialized) return

  await init(wasm)
  initialized = true
}
