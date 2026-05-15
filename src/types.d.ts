import 'nitro/runtime-config'
import * as React from 'react'
import type { ServerRuntimeContext } from 'srvx'

declare global {
  interface Request {
    readonly runtime?: ServerRuntimeContext
  }
}

declare module 'react' {
  interface CSSProperties extends React.CSSProperties {
    [prop: `--${string}`]: string | number
  }
}

export {}
