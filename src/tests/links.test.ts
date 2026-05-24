import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../server.js'

let token: string

beforeAll(async () => {
  await app.ready()

  const email = `links-${Date.now()}@teste.com`

  await request(app.server).post('/auth/register').send({
    email,
    password: '123456',
  })

  const login = await request(app.server).post('/auth/login').send({
    email,
    password: '123456',
  })

  token = login.body.token
})

afterAll(async () => {
  await app.close()
})

describe('POST /links', () => {
  it('deve criar link e retornar 201', async () => {
    const response = await request(app.server)
      .post('/links')
      .set('Authorization', `Bearer ${token}`)
      .send({ url: 'https://google.com' })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('slug')
    expect(response.body).toHaveProperty('url', 'https://google.com')
  })

  it('deve retornar 401 sem token', async () => {
    const response = await request(app.server)
      .post('/links')
      .send({ url: 'https://google.com' })

    expect(response.status).toBe(401)
  })

  it('deve retornar 400 com URL inválida', async () => {
    const response = await request(app.server)
      .post('/links')
      .set('Authorization', `Bearer ${token}`)
      .send({ url: 'urlinvalida' })

    expect(response.status).toBe(400)
  })
})

describe('GET /links', () => {
  it('deve listar links do usuário', async () => {
    const response = await request(app.server)
      .get('/links')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })

  it('deve retornar 401 sem token', async () => {
    const response = await request(app.server).get('/links')

    expect(response.status).toBe(401)
  })
})