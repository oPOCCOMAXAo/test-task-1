const fs = require("fs");
const { Sender, format2HData, format24HData } = require("../src/notifications");

const logFile = "./send.log";
const sendData = [
  {
    name: "Петров П",
    operationTime: new Date(2020, 0, 31, 10).getTime(),
    spec: "Гигапевт",
    time: new Date(2020, 1, 1, 10).getTime(),
  },
  {
    name: "Иванов И",
    operationTime: new Date(2020, 1, 1, 10).getTime(),
    spec: "Терапевт",
    time: new Date(2020, 1, 1, 12).getTime(),
  },
  {
    name: "Сидоров С",
    operationTime: new Date(2020, 1, 1, 12).getTime(),
    spec: "Окулист",
    time: new Date(2020, 1, 2, 12).getTime(),
  },
];

function clearLog() {
  if (fs.existsSync(logFile)) {
    fs.unlinkSync(logFile);
  }
}

beforeEach(() => {
  clearLog();
});

afterEach(() => {
  clearLog();
});

test("sender 1d", () => {
  const sender = new Sender(format24HData, logFile);
  for (const data of sendData) {
    sender.send(data);
  }
  expect(fs.readFileSync(logFile).toString()).toMatchInlineSnapshot(`
"2020-01-31T08:00:00.000Z | Привет Петров П! Напоминаем что вы записаны к Гигапевт на завтра в 10:00!
2020-02-01T08:00:00.000Z | Привет Иванов И! Напоминаем что вы записаны к Терапевт на завтра в 12:00!
2020-02-01T10:00:00.000Z | Привет Сидоров С! Напоминаем что вы записаны к Окулист на завтра в 12:00!
"
`);
});

test("sender 2h", () => {
  const sender = new Sender(format2HData, logFile);
  for (const data of sendData) {
    sender.send(data);
  }
  expect(fs.readFileSync(logFile).toString()).toMatchInlineSnapshot(`
"2020-01-31T08:00:00.000Z | Привет Петров П! Вам через 2 часа к Гигапевт в 10:00!
2020-02-01T08:00:00.000Z | Привет Иванов И! Вам через 2 часа к Терапевт в 12:00!
2020-02-01T10:00:00.000Z | Привет Сидоров С! Вам через 2 часа к Окулист в 12:00!
"
`);
});
