const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    doctor: {
      type: String,
      ref: "doctor",
    },
    time: Number,
    user: {
      type: String,
      ref: "user",
    },
    // tag used as set of strings for custom flags. example: "2H" - 2H notification was sent
    tag: {
      type: [String],
      required: false,
    },
  },
  { versionKey: false }
);

schema.index({ time: 1, doctor: 1 }, { unique: true });

/**
 * @param doctorId {String}
 * @param userId {String}
 * @param time {Number}
 * @return {Promise<String|undefined>} error or nothing if success
 */
schema.statics.reserve = function (doctorId, userId, time) {
  return new Promise((resolve) => {
    this.create({ doctor: doctorId, user: userId, time }, (err) => {
      if (err) {
        if (err.code === 11000) {
          resolve("slot already reserved");
        } else {
          resolve("internal db error");
        }
      } else {
        resolve();
      }
    });
  });
};

/**
 * @param ids {String[]}
 * @param tag {String}
 * @return {Promise<void>}
 */
schema.statics.addTag = function (ids, tag) {
  return this.updateMany({ _id: { $in: ids } }, { $addToSet: { tag } }).exec();
};

/**
 * @param ids {String[]}
 * @param tag {String}
 * @return {Promise<void>}
 */
schema.statics.removeTag = function (ids, tag) {
  return this.updateMany({ _id: { $in: ids } }, { $pull: { tag } }).exec();
};

/**
 * @param termTime {Number}
 * @param tag {String}
 * @return {Promise<ReadyDocument[]>}
 */
schema.statics.findReadyForNotification = function (termTime, tag) {
  return this.find({ time: { $lt: termTime }, tag: { $ne: tag } }, { tag: 0 })
    .populate("doctor", "spec")
    .populate("user", "name")
    .exec();
};

module.exports = schema;
