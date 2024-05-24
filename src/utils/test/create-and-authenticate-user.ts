import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

interface CreateAndAuthenticateUserDTO {
  app: FastifyInstance
  role?: 'ADMIN' | 'MEMBER'
}

export async function createAndAuthenticateUser({
  app,
}: CreateAndAuthenticateUserDTO) {
  await prisma.user.create({
    data: {
      id: randomUUID(),
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await bcrypt.hash('123456', 6),
      created_at: new Date(),
      role: 'ADMIN',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return { token }
}
