const mongoose = require("mongoose");

const cursoSchema = new mongoose.Schema({
  nomeDoCurso: { type: String, required: true, trim: true },
});

// expõe "id" em vez de "_id" para ficar equivalente ao json-server
cursoSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model("Curso", cursoSchema);
