import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { registerService, loginService } from './auth.service.js'

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export async function registerController(req: FastifyRequest, reply: FastifyReply) {
  const { email, password } = registerSchema.parse(req.body)

  const result = await registerService(email, password)

  return reply.status(201).send(result)
}

export async function loginController(req: FastifyRequest, reply: FastifyReply) {
  const { email, password } = loginSchema.parse(req.body)

  const result = await loginService(email, password)

  return reply.status(200).send(result)
}