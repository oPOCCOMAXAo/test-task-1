const pad00 = (n) => n.toString().padStart(2, "0");

const formatTime = (timestamp) => {
  let date = new Date(timestamp);
  return `${pad00(date.getHours())}:${pad00(date.getMinutes())}`;
};

/**
 * @param d {Data}
 * @return {string}
 */
const format2HData = (d) =>
  `${new Date(d.operationTime).toISOString()} | Привет ${d.name}! \
Вам через 2 часа к ${d.spec} в ${formatTime(d.time)}!`;

/**
 * @param d {Data}
 * @return {string}
 */
const format24HData = (d) =>
  `${new Date(d.operationTime).toISOString()} | Привет ${d.name}! \
Напоминаем что вы записаны к ${d.spec} на завтра в ${formatTime(d.time)}!`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

module.exports = {
  formatTime,
  format2HData,
  format24HData,
  sleep,
};
