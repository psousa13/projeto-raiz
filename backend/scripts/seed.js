// Migra mock-data/bd.json para o MongoDB Atlas (apaga as coleções e volta a criar).
// Uso: npm run seed
require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Curso = require("../src/models/Curso");
const Aluno = require("../src/models/Aluno");
const data = require(path.join(__dirname, "../../mock-data/bd.json"));

(async () => {
  await connectDB();
  await Promise.all([Curso.deleteMany({}), Aluno.deleteMany({})]);

  const idMap = new Map(); // id antigo (número) -> novo ObjectId
  for (const c of data.cursos) {
    const doc = await Curso.create({ nomeDoCurso: c.nomeDoCurso });
    idMap.set(c.id, doc._id);
  }
  await Aluno.insertMany(
    data.alunos.map(({ id, idCurso, ...rest }) => ({ ...rest, idCurso: idMap.get(idCurso) }))
  );

  console.log(`Migrados: ${data.cursos.length} cursos, ${data.alunos.length} alunos`);
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
