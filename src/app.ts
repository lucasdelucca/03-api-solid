import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { checkInRoutes } from './http/controllers/check-ins/routes'
import { gymRoutes } from './http/controllers/gyms/routes'
import { userRoutes } from './http/controllers/users/routes'

export const app = fastify()

app.register(fastifyCookie)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  verify: {
    extractToken: (request) => {
      if (request.url === '/token/refresh') {
        return request.cookies && request.cookies.refreshToken
      } else {
        return (
          request.headers.authorization &&
          request.headers.authorization.split(' ')[1]
        )
      }
    },
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(userRoutes)
app.register(gymRoutes)
app.register(checkInRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_COOKIE') {
    return reply
      .status(401)
      .send({ message: 'invalid jwt token', code: error.code })
  }
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'validation error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like Datadog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'internal server error' })
})
