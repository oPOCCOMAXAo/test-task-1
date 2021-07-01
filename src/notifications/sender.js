const fs = require("fs");
const { format24HData } = require("./utils");

/**
 * @implements {ISender}
 */
class Sender {
  /**
   * @param format {FormatFunction} - format function for message for current Sender instance
   * @param file {String}
   */
  constructor(format = format24HData, file = "send.log") {
    this.format = format;
    this.file = file;
  }

  /**
   * @param data {Data}
   */
  send(data) {
    fs.appendFileSync(this.file, this.format(data) + "\n");
  }
}

module.exports = Sender;
