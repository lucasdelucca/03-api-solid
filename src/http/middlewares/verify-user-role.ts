import { FastifyReply, FastifyRequest } from 'fastify'

export function verfifyUserRole(roleToVerify: 'MEMBER' | 'ADMIN') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user

    if (role !== roleToVerify) {
      return reply.status(401).send({ message: 'unauthorized' })
    }
  }
}
