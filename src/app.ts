import { OpenAPIHono } from '@hono/zod-openapi'
import { Scalar } from '@scalar/hono-api-reference'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { Home } from './pages/home'
import { Routes } from '#common/types'
import type { HTTPException } from 'hono/http-exception'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
export class App {
  private app: OpenAPIHono
  constructor(routes: Routes[]) {
    this.app = new OpenAPIHono()
    this.initializeApp(routes)
  }
  private async initializeApp(routes: Routes[]) {
    try {
      this.initializeGlobalMiddleware()
      this.initializeRoutes(routes)
      this.initializeSwaggerUI()
      this.initializeRouteFallback()
      this.initializeErrorHandler()
    } catch (error) {
      console.error('Failed to initialize application:', error)
      throw new Error('Failed to initialize application')
    }
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      route.initRoutes()
      this.app.route('/api/v1', route.controller)
    })
    this.app.route('/', Home)
    this.app.get('/favicon.ico', (c) => c.redirect('https://cdn.jacobtechlabs.dev/favicon.ico', 301))
    this.initializeHealthCheck()
  }

  private initializeGlobalMiddleware() {
    // Security headers (Helmet-like)
    this.app.use(secureHeaders({
      contentSecurityPolicy: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "https:", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
      crossOriginEmbedderPolicy: false, // Allow for API usage
    }))

    // CORS
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || '*',
        allowMethods: ['GET', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
        maxAge: 86400,
      })
    )

    // Request logging
    this.app.use(logger())

    // Pretty JSON in development
    if (process.env.NODE_ENV !== 'production') {
      this.app.use(prettyJSON())
    }

    // Response timing
    this.app.use(async (c, next) => {
      const start = Date.now()
      await next()
      const end = Date.now()
      c.res.headers.set('X-Response-Time', `${end - start}ms`)
    })

    // Request ID for tracing
    this.app.use(async (c, next) => {
      const requestId = crypto.randomUUID()
      c.set('requestId', requestId)
      c.res.headers.set('X-Request-ID', requestId)
      await next()
    })
  }

  private initializeHealthCheck() {
    // Health check endpoint
    this.app.get('/health', (c) => {
      return c.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        service: 'JacobTechLabs Fitness API',
        environment: process.env.NODE_ENV || 'development',
      }, 200)
    })

    // Readiness check (for Kubernetes/Docker)
    this.app.get('/ready', (c) => {
      return c.json({
        ready: true,
        checks: {
          api: 'ok',
          data: 'ok',
        }
      }, 200)
    })
  }

  private initializeSwaggerUI(): void {
    // OpenAPI documentation for v1
    this.app.doc31('/swagger', (c) => {
      const { protocol: urlProtocol, hostname, port } = new URL(c.req.url)
      const protocol = c.req.header('x-forwarded-proto') ? `${c.req.header('x-forwarded-proto')}:` : urlProtocol

      return {
        openapi: '3.1.0',
        info: {
          version: '1.0.0',
          title: 'JacobTechLabs Fitness API',
          description: `**JacobTechLabs Fitness API** is a developer-first API infrastructure providing access to 5,000+ structured fitness exercises. Built for speed, scalability, and seamless integration into modern fitness applications, health platforms, and workout tools.

**Features**:
- ⚡ **Fast**: Optimized for low-latency responses with intelligent caching
- 🔍 **Search**: Advanced fuzzy search across exercise names, muscles, and equipment
- 📊 **Structured**: Consistent JSON schema with OpenAPI documentation
- 🚀 **Developer-Friendly**: RESTful endpoints with comprehensive examples

**🔗 Useful Links**:
- � Documentation: [docs.jacobtechlabs.dev](https://docs.jacobtechlabs.dev)
- � GitHub: [github.com/jacobtechlabs/api-core](https://github.com/jacobtechlabs/api-core)
- ✉️ Support: [dev@jacobtechlabs.dev](mailto:dev@jacobtechlabs.dev)`
        },
        servers: [
          {
            url: `${protocol}//${hostname}${port ? `:${port}` : ''}`,
            description: 'Production API Server'
          }
        ]
      }
    })

    // API Documentation UI
    this.app.get(
      '/docs',
      Scalar({
        pageTitle: 'JacobTechLabs Fitness API',
        theme: 'kepler',
        isEditable: false,
        layout: 'modern',
        darkMode: true,
        hideDownloadButton: true,
        hideDarkModeToggle: true,
        url: '/swagger',
        favicon: 'https://cdn.jacobtechlabs.dev/favicon.ico',
        defaultOpenAllTags: true,
        hideClientButton: true,
        metaData: {
          applicationName: 'JacobTechLabs Fitness API',
          author: 'JacobTechLabs',
          creator: 'JacobTechLabs',
          publisher: 'JacobTechLabs',
          ogType: 'website',
          robots: 'index follow',
          description: `**JacobTechLabs Fitness API** - Developer-first API infrastructure for fitness applications. Access 5,000+ exercises with rich metadata, search capabilities, and fast responses.

**🔗 Useful Links**:
- � Documentation: [docs.jacobtechlabs.dev](https://docs.jacobtechlabs.dev)
- � GitHub: [github.com/jacobtechlabs/api-core](https://github.com/jacobtechlabs/api-core)
- ✉️ Support: [dev@jacobtechlabs.dev](mailto:dev@jacobtechlabs.dev)`
        }
      })
    )
  }

  private initializeRouteFallback() {
    this.app.notFound((c) => {
      return c.json(
        {
          success: false,
          message: 'Route not found. Visit /docs for API documentation',
          documentation: '/docs',
          support: 'dev@jacobtechlabs.dev'
        },
        404
      )
    })
  }
  private initializeErrorHandler() {
    this.app.onError((err, c) => {
      const error = err as HTTPException
      const requestId = c.get('requestId') || 'unknown'

      // Log error with context
      console.error(`[${requestId}] Error:`, {
        message: error.message,
        status: error.status,
        stack: error.stack,
        path: c.req.path,
        method: c.req.method,
        timestamp: new Date().toISOString(),
      })

      // Return structured error response
      return c.json({
        success: false,
        error: {
          message: error.message || 'Internal Server Error',
          code: error.status || 500,
          requestId,
          documentation: '/docs',
          support: 'dev@jacobtechlabs.dev',
        }
      }, error.status || 500)
    })
  }
  public getApp() {
    return this.app
  }
}
