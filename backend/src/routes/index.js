const { Router } = require("express");
const alunos = require("../controllers/alunoController");
const cursos = require("../controllers/cursoController");

// Express 4 não apanha erros de handlers async sozinho
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function resource(c) {
  const r = Router();
  r.get("/", wrap(c.list));
  r.post("/", wrap(c.create));
  r.get("/:id", wrap(c.get));
  r.put("/:id", wrap(c.replace));
  r.patch("/:id", wrap(c.patch));
  r.delete("/:id", wrap(c.remove));
  return r;
}

const router = Router();
router.use("/alunos", resource(alunos));
router.use("/cursos", resource(cursos));

module.exports = router;
