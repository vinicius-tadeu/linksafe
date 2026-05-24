import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../server.js'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('POST /auth/register', () => {
  it('deve criar usuário e retornar 201', async () => {
    const response = await request(app.server)
      .post('/auth/register')
      .send({
        email: `test-${Date.now()}@teste.com`,
        password: '123456',
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('email')
  })

  it('deve retornar 400 se email inválido', async () => {
    const response = await request(app.server)
      .post('/auth/register')
      .send({
        email: 'emailinvalido',
        password: '123456',
      })

    expect(response.status).toBe(400)
  })

  it('deve retornar 409 se email já existe', async () => {
    const email = `dup-${Date.now()}@teste.com`

    await request(app.server).post('/auth/register').send({
      email,
      password: '123456',
    })

    const response = await request(app.server)
      .post('/auth/register')
      .send({ email, password: '123456' })

    expect(response.status).toBe(409)
  })
})

describe('POST /auth/login', () => {
  it('deve retornar token com credenciais corretas', async () => {
    const email = `login-${Date.now()}@teste.com`

    await request(app.server).post('/auth/register').send({
      email,
      password: '123456',
    })

    const response = await request(app.server)
      .post('/auth/login')
      .send({ email, password: '123456' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
  })

  it('deve retornar 401 com credenciais erradas', async () => {
    const response = await request(app.server)
      .post('/auth/login')
      .send({
        email: 'naoexiste@teste.com',
        password: 'senhaerrada',
      })

    expect(response.status).toBe(401)
  })
})