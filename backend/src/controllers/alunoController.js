const Aluno = require("../models/Aluno");
const crud = require("./crud");

module.exports = crud(Aluno, { filterFields: ["idCurso", "anoCurricular", "nome", "apelido"] });
