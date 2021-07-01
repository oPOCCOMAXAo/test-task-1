const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    _id: String,
    phone: String,
    name: String,
  },
  { versionKey: false }
);

schema.statics.exists = async function (id) {
  return (await this.countDocuments({ _id: id })) > 0;
};

module.exports = schema;
