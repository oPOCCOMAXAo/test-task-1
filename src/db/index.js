const mongoose = require("mongoose");
const { dbUrl } = require("../config");

// named imports for better types support
const DoctorSchema = require("./doctor.schema");
const UserSchema = require("./user.schema");
const ReservedSchema = require("./reserved.schema");

// named connection used to be able to close it
const connection = mongoose.createConnection(dbUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  connection,
  DoctorSchema,
  UserSchema,
  ReservedSchema,
  /** @type mongoose.Model<DoctorSchema> */
  Doctor: connection.model("doctor", DoctorSchema),
  /** @type mongoose.Model<UserSchema> */
  User: connection.model("user", UserSchema),
  /** @type mongoose.Model<ReservedSchema> */
  Reserved: connection.model("reserved", ReservedSchema),
};
