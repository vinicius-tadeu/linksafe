# 🔐 LinkSafe

Encurtador de URLs com analytics e segurança, construído com Node.js, Fastify e TypeScript.

## Tecnologias

- **Fastify** — framework web rápido e eficiente
- **TypeScript** — tipagem estática
- **PostgreSQL** — banco de dados relacional
- **Prisma ORM** — acesso ao banco com type-safety
- **JWT** — autenticação stateless
- **bcrypt** — criptografia de senhas
- **Docker** — ambiente de desenvolvimento isolado
- **Zod** — validação de dados

## Funcionalidades

- Cadastro e login de usuários com JWT
- Criação de links encurtados com slug automático ou personalizado
- Redirecionamento com registro de cliques
- Analytics por link (total de cliques, dispositivo, navegador)
- Tratamento de erros padronizado

## Como rodar localmente

### Pré-requisitos
- Node.js 20+
- Docker

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/linksafe.git
cd linksafe

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Suba o banco de dados
docker-compose up -d

# Rode as migrations
npx prisma migrate dev

# Gere o client do Prisma
npx prisma generate

# Inicie o servidor
npm run dev
```

## 🔑 Variáveis de ambiente

```env
DATABASE_URL="postgresql://user:password@localhost:5432/linksafe?schema=public"
JWT_SECRET="sua-chave-secreta"
```

## Rotas

### Auth
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/register` | Cadastro de usuário |
| POST | `/auth/login` | Login e geração de token |

### Links
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/links` | Criar link encurtado | ✅ |
| GET | `/links` | Listar meus links | ✅ |
| GET | `/links/:id/analytics` | Analytics do link | ✅ |
| GET | `/:slug` | Redirecionar para URL | ❌ |

## Exemplo de uso

### Criar um link
```bash
curl -X POST http://localhost:3000/links \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://google.com"}'
```

### Resposta
```json
{
  "id": "cmpjzav3t0000r0om4ml0l927",
  "slug": "YErKot",
  "url": "https://google.com",
  "active": true,
  "expiresAt": null,
  "createdAt": "2026-05-24T16:15:19.289Z",
  "userId": "cmpjywlgf0000zwomomiyqar3"
}
```