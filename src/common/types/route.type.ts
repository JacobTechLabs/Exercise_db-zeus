import type { OpenAPIHono } from '@hono/zod-openapi'

// Extend Hono's context variables
declare module 'hono' {
  interface ContextVariableMap {
    requestId: string
  }
}

export interface Routes {
  controller: OpenAPIHono
  initRoutes: () => void
}
