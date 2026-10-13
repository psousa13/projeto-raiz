# Atividade Prática #1 — Consumo e Implementação de APIs RESTful

Aplicação de gestão de alunos e cursos: front-end (HTML/CSS/JS + Fetch API), API simulada (JSON-Server) e API real (Node.js + Express + MongoDB Atlas + Mongoose), documentada com Swagger.

## Links

- **Front-end (público):** _por fazer (deploy ainda não realizado)_
- **API real:** _por fazer (deploy ainda não realizado)_
- **Swagger:** _por fazer (disponível em `/api-docs` após o deploy; localmente em http://localhost:3001/api-docs)_

## Estrutura

```
projeto-raiz/
├── frontend/     Interface web (HTML/CSS/JS)
├── backend/      API RESTful (Express + Mongoose, MVC) + Swagger em backend/docs/
├── mock-server/  JSON-Server configurado
├── mock-data/    bd.json original
├── tests/        Coleção Postman
└── README.md
```

## Pré-requisitos

- Node.js >= 18 e npm
- Postman (para correr a coleção)
- Conta MongoDB Atlas (cluster gratuito) — só para o backend real

## Parte 1–3: JSON-Server + Frontend

```bash
cd mock-server
npm install
npm start
```

- API: http://localhost:3000/alunos e http://localhost:3000/cursos
- Frontend: http://localhost:3000 (o json-server serve `../frontend` como estático)
- Em `frontend/config.js`, `API_URL` fica `""` (mesma origem).

### Testes Postman

Importar `tests/alunos-cursos.postman_collection.json` e correr a coleção (variável `baseUrl` = `http://localhost:3000`).
A mesma coleção funciona contra a API real: mudar `baseUrl` e trocar `"idCurso": 1` do POST/PUT por um id de curso real (ObjectId).

## Parte 4: API real (Express + MongoDB Atlas)

1. No Atlas: criar cluster, utilizador de base de dados e, em *Network Access*, permitir o IP (`0.0.0.0/0` para o Render).
2. Configurar o backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env     # preencher MONGODB_URI
   npm run seed             # migra mock-data/bd.json para o Atlas
   npm start                # http://localhost:3001
   ```
3. Endpoints (equivalentes ao json-server): `GET/POST /alunos`, `GET/PUT/PATCH/DELETE /alunos/:id`, idem `/cursos`.
   Os documentos expõem `id` (em vez de `_id`) e `idCurso` é o `id` do curso.

## Parte 5: Deploy

**API (Render → Web Service)**
- Root Directory: `backend` · Build: `npm install` · Start: `npm start`
- Variáveis de ambiente: `MONGODB_URI`, opcionalmente `CORS_ORIGIN=<URL do front-end>`

**Front-end (Vercel ou Render Static Site)**
- Root Directory: `frontend` (sem build)
- Editar `frontend/config.js`: `window.API_URL = "<URL da API no Render>";` e fazer commit.

Depois do deploy, preencher os links no topo deste README.

## Parte 6: Swagger

Disponível em `/api-docs` (ex.: http://localhost:3001/api-docs). Definição em `backend/docs/swagger.js`.

## Git

Commits regulares; usar branches por parte (ex.: `feat/mock-server`, `feat/backend`).
