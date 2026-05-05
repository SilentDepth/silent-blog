import 'nitro/runtime-config'
import type { ServerRuntimeContext } from 'srvx'

declare global {
  interface Request {
    readonly runtime?: ServerRuntimeContext
  }
}

export {}
