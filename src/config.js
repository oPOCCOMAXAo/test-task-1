function parsePort() {
  const res = parseInt(process.env.PORT);
  return Number.isInteger(res) ? res : 3000;
}

// somehow build config
module.exports = {
  dbUrl: "mongodb://localhost:27017/test",
  port: parsePort(),
  service: process.env.SERVICE !== "off",
  logFile: "./send.log",
};
