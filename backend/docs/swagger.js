// Especificação OpenAPI 3 servida em /api-docs
const idParam = {
  name: "id", in: "path", required: true,
  schema: { type: "string", example: "<ObjectId>" },
};
const json = (ref) => ({ "application/json": { schema: { $ref: `#/components/schemas/${ref}` } } });
const jsonArray = (ref) => ({
  "application/json": { schema: { type: "array", items: { $ref: `#/components/schemas/${ref}` } } },
});
const err = (description) => ({
  description,
  content: json("Erro"),
});

function resourcePaths(tag, path, schema, inputSchema, extraListParams = []) {
  return {
    [`/${path}`]: {
      get: {
        tags: [tag], summary: `Listar ${path}`, parameters: extraListParams,
        responses: { 200: { description: "Lista", content: jsonArray(schema) } },
      },
      post: {
        tags: [tag], summary: `Criar (${path})`,
        requestBody: { required: true, content: json(inputSchema) },
        responses: { 201: { description: "Criado", content: json(schema) }, 400: err("Dados inválidos") },
      },
    },
    [`/${path}/{id}`]: {
      get: {
        tags: [tag], summary: `Obter por id (${path})`, parameters: [idParam],
        responses: { 200: { description: "OK", content: json(schema) }, 400: err("id inválido"), 404: err("Não encontrado") },
      },
      put: {
        tags: [tag], summary: `Substituir (${path})`, parameters: [idParam],
        requestBody: { required: true, content: json(inputSchema) },
        responses: { 200: { description: "Atualizado", content: json(schema) }, 400: err("Dados inválidos"), 404: err("Não encontrado") },
      },
      patch: {
        tags: [tag], summary: `Atualizar parcialmente (${path})`, parameters: [idParam],
        requestBody: { required: true, content: json(inputSchema) },
        responses: { 200: { description: "Atualizado", content: json(schema) }, 400: err("Dados inválidos"), 404: err("Não encontrado") },
      },
      delete: {
        tags: [tag], summary: `Apagar (${path})`, parameters: [idParam],
        responses: { 204: { description: "Apagado" }, 404: err("Não encontrado"), 409: err("Conflito (curso com alunos)") },
      },
    },
  };
}

module.exports = {
  openapi: "3.0.3",
  info: { title: "API Alunos & Cursos", version: "1.0.0", description: "Atividade Prática #1 — API RESTful" },
  servers: [{ url: "/" }],
  tags: [{ name: "Alunos" }, { name: "Cursos" }],
  paths: {
    ...resourcePaths("Alunos", "alunos", "Aluno", "AlunoInput", [
      { name: "idCurso", in: "query", schema: { type: "string" } },
      { name: "anoCurricular", in: "query", schema: { type: "integer" } },
    ]),
    ...resourcePaths("Cursos", "cursos", "Curso", "CursoInput"),
  },
  components: {
    schemas: {
      AlunoInput: {
        type: "object",
        required: ["nome", "apelido", "idCurso", "anoCurricular"],
        properties: {
          nome: { type: "string", example: "<nome>" },
          apelido: { type: "string", example: "<apelido>" },
          idCurso: { type: "string", example: "<ObjectId do curso>" },
          anoCurricular: { type: "integer", minimum: 1, maximum: 6, example: 1 },
        },
      },
      Aluno: {
        allOf: [
          { type: "object", properties: { id: { type: "string", example: "<ObjectId>" } } },
          { $ref: "#/components/schemas/AlunoInput" },
        ],
      },
      CursoInput: {
        type: "object",
        required: ["nomeDoCurso"],
        properties: { nomeDoCurso: { type: "string", example: "<nome do curso>" } },
      },
      Curso: {
        allOf: [
          { type: "object", properties: { id: { type: "string", example: "<ObjectId>" } } },
          { $ref: "#/components/schemas/CursoInput" },
        ],
      },
      Erro: { type: "object", properties: { error: { type: "string" } } },
    },
  },
};
