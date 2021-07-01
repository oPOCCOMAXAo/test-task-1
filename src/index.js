const Koa = require("koa");
const { port, service, logFile } = require("./config");
const {
  Sender,
  Service,
  format2HData,
  format24HData,
} = require("./notifications");

const app = new Koa();
app.use(require("./routes/api").routes());
const server = app.listen(port); // to be able to close it

if (service) {
  new Service(
    new Sender(format2HData, logFile),
    "2h",
    2 * 3600000,
    60000
  ).start();
  new Service(
    new Sender(format24HData, logFile),
    "1d",
    24 * 3600000,
    600000
  ).start();
}

module.exports = server;
