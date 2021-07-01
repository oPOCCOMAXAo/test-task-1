const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    spec: String,
    slots: [Date],
  },
  { versionKey: false }
);

schema.statics.slotExists = async function (id, time) {
  return (await this.countDocuments({ _id: id, slots: { $all: [time] } })) > 0;
};

module.exports = schema;
