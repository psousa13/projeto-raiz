const Curso = require("../models/Curso");
const Aluno = require("../models/Aluno");
const crud = require("./crud");

module.exports = crud(Curso, {
  // não deixa apagar cursos com alunos associados
  beforeDelete: async (id) => {
    if (await Aluno.exists({ idCurso: id })) {
      throw crud.httpError(409, "curso tem alunos associados");
    }
  },
});
