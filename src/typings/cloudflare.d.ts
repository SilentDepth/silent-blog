declare module 'cloudflare:workers' {
  export const env: {
    ASSETS: {
      fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>
    }
  }
}
