import { FastifyRequest, FastifyReply } from 'fastify'
import { ZodError } from 'zod'

export async function errorHandler(
  error: Error,
  req: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Dados inválidos',
      errors: error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    })
  }

  if (error.message === 'Email já cadastrado') {
    return reply.status(409).send({ message: error.message })
  }

  if (error.message === 'Credenciais inválidas') {
    return reply.status(401).send({ message: error.message })
  }

  if (error.message === 'Link não encontrado') {
    return reply.status(404).send({ message: error.message })
  }

  if (error.message === 'Slug já está em uso') {
    return reply.status(409).send({ message: error.message })
  }

  if (error.message === 'Link inativo') {
    return reply.status(410).send({ message: error.message })
  }

  if (error.message === 'Link expirado') {
    return reply.status(410).send({ message: error.message })
  }

  console.error(error)
  return reply.status(500).send({ message: 'Erro interno do servidor' })
}