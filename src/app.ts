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
    // CSP must whitelist Scalar CDN domains so /docs renders properly
    this.app.use(
      secureHeaders({
        contentSecurityPolicy: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', 'https://fonts.googleapis.com', 'https://fonts.scalar.com'],
          scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', 'https://cdn.tailwindcss.com'],
          imgSrc: ["'self'", 'https:', 'data:', 'blob:'],
          connectSrc: ["'self'", 'https://cdn.jsdelivr.net'],
          fontSrc: ["'self'", 'https://cdn.jsdelivr.net', 'https://fonts.gstatic.com', 'https://fonts.scalar.com'],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"]
        },
        crossOriginEmbedderPolicy: false // Allow for API usage
      })
    )

    // CORS
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || '*',
        allowMethods: ['GET', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
        maxAge: 86400
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
      return c.json(
        {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          service: 'JacobTechLabs Fitness API',
          environment: process.env.NODE_ENV || 'development'
        },
        200
      )
    })

    // Readiness check (for Kubernetes/Docker)
    this.app.get('/ready', (c) => {
      return c.json(
        {
          ready: true,
          checks: {
            api: 'ok',
            data: 'ok'
          }
        },
        200
      )
    })
  }

  private initializeSwaggerUI(): void {
    // Shared OpenAPI spec generator for v1
    const openApiDocHandler = (c: { req: { url: string; header: (name: string) => string | undefined } }) => {
      const { protocol: urlProtocol, hostname, port } = new URL(c.req.url)
      const protocol = c.req.header('x-forwarded-proto') ? `${c.req.header('x-forwarded-proto')}:` : urlProtocol

      return {
        openapi: '3.1.0',
        info: {
          version: '1.0.0',
          title: 'JacobTechLabs Fitness API',
          description: [
            '**JacobTechLabs Fitness API** is a developer-first API infrastructure providing access to 5,000+ structured fitness exercises.',
            'Built for speed, scalability, and seamless integration into modern fitness applications, health platforms, and workout tools.',
            '',
            '## Features',
            '- \u26a1 **Fast** \u2014 Optimized for sub-100ms responses with intelligent caching',
            '- \ud83d\udd0d **Search** \u2014 Advanced fuzzy search across exercise names, muscles, and equipment',
            '- \ud83d\udcca **Structured** \u2014 Consistent JSON schema with full OpenAPI 3.1 documentation',
            '- \ud83d\ude80 **Developer-Friendly** \u2014 RESTful endpoints with comprehensive examples',
            '- \ud83d\udd12 **Reliable** \u2014 99.9% uptime with health and readiness probes',
            '',
            '## Quick Start',
            '```bash',
            'curl https://api.jacobtechlabs.xyz/api/v1/exercises?limit=5',
            '```',
            '',
            '## Links',
            '- \ud83d\udcd6 [Documentation](https://docs.jacobtechlabs.dev)',
            '- \ud83d\udcbb [GitHub](https://github.com/jacobtechlabs/api-core)',
            '- \u2709\ufe0f [Support](mailto:dev@jacobtechlabs.dev)'
          ].join('\n'),
          contact: {
            name: 'JacobTechLabs Engineering',
            email: 'dev@jacobtechlabs.dev',
            url: 'https://jacobtechlabs.dev'
          },
          license: {
            name: 'AGPL-3.0',
            url: 'https://github.com/jacobtechlabs/api-core/blob/main/LICENSE'
          }
        },
        servers: [
          {
            url: `${protocol}//${hostname}${port ? `:${port}` : ''}/api/v1`,
            description: 'Current Server'
          },
          {
            url: 'https://api.jacobtechlabs.xyz/api/v1',
            description: 'Production'
          }
        ],
        tags: [
          { name: 'EXERCISES', description: 'Core exercise endpoints \u2014 browse, search, filter, and retrieve exercises' },
          { name: 'BODYPARTS', description: 'Reference data for body part categories' },
          { name: 'MUSCLES', description: 'Reference data for target and secondary muscles' },
          { name: 'EQUIPMENTS', description: 'Reference data for exercise equipment types' }
        ],
        externalDocs: {
          description: 'Full Developer Documentation',
          url: 'https://docs.jacobtechlabs.dev'
        }
      }
    }

    // Serve OpenAPI spec at both /swagger and /openapi.json
    this.app.doc31('/swagger', openApiDocHandler)
    this.app.doc31('/openapi.json', openApiDocHandler)

    // JacobTechLabs enterprise dark-mode branding for Scalar UI
    const jacobTechLabsTheme = `
      /* -- JacobTechLabs Enterprise Dark Theme -- */
      :root {
        --jtl-brand-deep: #0a0e1a;
        --jtl-brand-surface: #111827;
        --jtl-brand-elevated: #1e293b;
        --jtl-brand-border: rgba(56, 189, 248, 0.12);
        --jtl-accent-cyan: #22d3ee;
        --jtl-accent-blue: #38bdf8;
        --jtl-text-primary: #f1f5f9;
        --jtl-text-secondary: #94a3b8;
      }

      .dark-mode {
        --scalar-background-1: var(--jtl-brand-deep);
        --scalar-background-2: var(--jtl-brand-surface);
        --scalar-background-3: var(--jtl-brand-elevated);
        --scalar-background-4: rgba(56, 189, 248, 0.06);
        --scalar-background-accent: rgba(34, 211, 238, 0.08);

        --scalar-color-1: var(--jtl-text-primary);
        --scalar-color-2: var(--jtl-text-secondary);
        --scalar-color-3: #64748b;
        --scalar-color-accent: var(--jtl-accent-cyan);

        --scalar-border-color: var(--jtl-brand-border);
        --scalar-scrollbar-color: rgba(56, 189, 248, 0.15);
        --scalar-scrollbar-color-active: rgba(56, 189, 248, 0.3);

        --scalar-button-1: var(--jtl-accent-cyan);
        --scalar-button-1-color: #020617;
        --scalar-button-1-hover: var(--jtl-accent-blue);

        --scalar-color-green: #34d399;
        --scalar-color-red: #f87171;
        --scalar-color-yellow: #fbbf24;
        --scalar-color-blue: var(--jtl-accent-blue);
        --scalar-color-orange: #fb923c;
        --scalar-color-purple: #a78bfa;

        --scalar-shadow-1: 0 1px 3px rgba(0, 0, 0, 0.4);
        --scalar-shadow-2: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(56, 189, 248, 0.08);
      }

      /* Sidebar branding */
      .dark-mode .sidebar {
        --scalar-sidebar-background-1: #070b14;
        --scalar-sidebar-item-hover-color: var(--jtl-accent-cyan);
        --scalar-sidebar-item-hover-background: rgba(34, 211, 238, 0.05);
        --scalar-sidebar-item-active-background: rgba(34, 211, 238, 0.1);
        --scalar-sidebar-border-color: var(--jtl-brand-border);
        --scalar-sidebar-color-active: var(--jtl-accent-cyan);
        --scalar-sidebar-search-background: var(--jtl-brand-surface);
        --scalar-sidebar-search-border-color: var(--jtl-brand-border);
      }

      /* Code blocks styling */
      .dark-mode pre {
        background: var(--jtl-brand-surface) !important;
        border: 1px solid var(--jtl-brand-border) !important;
        border-radius: 8px !important;
      }
    `

    // API Documentation UI at /docs
    this.app.get(
      '/docs',
      Scalar({
        pageTitle: 'JacobTechLabs Fitness API \u2014 Developer Reference',
        url: '/swagger',
        favicon: 'https://cdn.jacobtechlabs.dev/favicon.ico',
        darkMode: true,
        forceDarkModeState: 'dark',
        hideDarkModeToggle: true,
        hideDownloadButton: false,
        defaultOpenAllTags: true,
        hideClientButton: false,
        isEditable: false,
        layout: 'modern',
        customCss: jacobTechLabsTheme,
        defaultHttpClient: {
          targetKey: 'shell',
          clientKey: 'curl'
        },
        metaData: {
          title: 'JacobTechLabs Fitness API Reference',
          description:
            'Developer-first API infrastructure providing access to 5,000+ structured fitness exercises. Built with Bun & Hono for modern fitness applications.',
          ogType: 'website',
          robots: 'index, follow'
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
        timestamp: new Date().toISOString()
      })

      // Return structured error response
      return c.json(
        {
          success: false,
          error: {
            message: error.message || 'Internal Server Error',
            code: error.status || 500,
            requestId,
            documentation: '/docs',
            support: 'dev@jacobtechlabs.dev'
          }
        },
        error.status || 500
      )
    })
  }
  public getApp() {
    return this.app
  }
}
