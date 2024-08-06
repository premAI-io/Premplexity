import type { RegisterRoutes } from "$types/index"
import { FastifySchema } from "fastify"
import { JSONSchema7 } from "json-schema"

const response200 = {
  type: "string"
} as const satisfies JSONSchema7

const schema: FastifySchema = {
  summary: "API Documentation",
  description: "This endpoint provides access to the API documentation, detailing available endpoints and their usage.",
  tags: ["api"],
  response: {
    200: response200
  }
} as const satisfies FastifySchema

const route: RegisterRoutes = (server) => {
  server.route({
    method: "GET",
    url: "/docs",
    schema,
    config: {},
    handler: async (request, reply) => {
      const out = `
          <!doctype html>
          <html>
            <head>
              <title> Premplexity DOCS </title>
              <meta charset="utf-8"/>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
              <style>
                body { margin: 0; padding: 0; }
                a[href="https://redocly.com/redoc/"] {
                  display: none !important;
                }
              </style>
            </head>
            <body>
              <redoc spec-url="/api/schema"></redoc>
              <script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"> </script>
            </body>
          </html>
      `

      void reply.type("text/html")
      return reply.send(out)
    }
  })

}

export default route
