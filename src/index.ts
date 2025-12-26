/**
 * Cloudflare Workers entry point
 * This file handles the serverless deployment
 */

export interface Env {
  ENVIRONMENT: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    // API endpoint example
    if (url.pathname.startsWith('/api/')) {
      return new Response(
        JSON.stringify({
          message: 'Hello from Cloudflare Workers!',
          environment: env.ENVIRONMENT,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }

    // For all other routes, serve static files
    // The actual static file serving is handled by Wrangler's [site] configuration
    return new Response('Not Found', { status: 404 })
  },
}
