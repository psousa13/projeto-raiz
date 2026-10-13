const mongoose = require("mongoose");

const httpError = (status, message) => Object.assign(new Error(message), { status });

function checkId(id) {
  if (!mongoose.isValidObjectId(id)) throw httpError(400, "id inválido");
}

// Gera os handlers CRUD de um model. `hooks.beforeDelete` permite regras extra.
module.exports = function crud(Model, { filterFields = [], beforeDelete } = {}) {
  return {
    list: async (req, res) => {
      const filter = {};
      for (const f of filterFields) if (req.query[f] !== undefined) filter[f] = req.query[f];
      res.json(await Model.find(filter));
    },

    get: async (req, res) => {
      checkId(req.params.id);
      const doc = await Model.findById(req.params.id);
      if (!doc) throw httpError(404, "não encontrado");
      res.json(doc);
    },

    create: async (req, res) => {
      const { id, _id, ...data } = req.body; // ignora ids vindos do cliente
      res.status(201).json(await Model.create(data));
    },

    replace: async (req, res) => {
      checkId(req.params.id);
      const { id, _id, ...data } = req.body;
      const doc = await Model.findByIdAndUpdate(req.params.id, data, {
        new: true,
        overwrite: true,
        runValidators: true,
      });
      if (!doc) throw httpError(404, "não encontrado");
      res.json(doc);
    },

    patch: async (req, res) => {
      checkId(req.params.id);
      const { id, _id, ...data } = req.body;
      const doc = await Model.findByIdAndUpdate(req.params.id, data, {
        new: true,
        runValidators: true,
      });
      if (!doc) throw httpError(404, "não encontrado");
      res.json(doc);
    },

    remove: async (req, res) => {
      checkId(req.params.id);
      if (beforeDelete) await beforeDelete(req.params.id);
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) throw httpError(404, "não encontrado");
      res.status(204).end();
    },
  };
};

module.exports.httpError = httpError;
