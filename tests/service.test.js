const { Sender, Service, sleep } = require("../src/notifications");
const { connection, Reserved } = require("../src/db");
jest.mock("../src/notifications/sender");

const HOUR = 3600000;
const MINUTE = 60000;

// replace current time for service testing purposes
let currentTime = 0;
Date.now = jest.fn(() => currentTime);

const dataBeforeStart = [
  {
    user: "1001",
    doctor: "0001",
    time: Date.now() + 2 * HOUR + MINUTE,
  },
  {
    user: "1000",
    doctor: "0002",
    time: Date.now() + 24 * HOUR + MINUTE,
  },
];
const dataBatch1 = [
  {
    user: "1000",
    doctor: "0000",
    time: Date.now() + 2 * HOUR + 2 * MINUTE,
  },
  {
    user: "1002",
    doctor: "0001",
    time: Date.now() + 24 * HOUR + MINUTE,
  },
];
const dataBatch2 = [
  {
    user: "1002",
    doctor: "0002",
    time: Date.now() + 2 * HOUR + MINUTE,
  },
];

async function clearDb() {
  for (const doc of [].concat(dataBeforeStart, dataBatch1, dataBatch2)) {
    await Reserved.deleteOne(doc).exec();
  }
}

beforeAll(async () => {
  await clearDb();
});

afterAll(async () => {
  await clearDb();
  await connection.close();
});

test("service send", async () => {
  // useFakeTimers affects mongoose, so real waiting needed
  const serviceInterval = 1000;
  const sleepInterval = serviceInterval * 2;

  const sender2h = new Sender();
  const sender1d = new Sender();
  const service2h = new Service(sender2h, "2h", 2 * HOUR, serviceInterval);
  const service1d = new Service(sender1d, "1d", 24 * HOUR, serviceInterval);

  await Reserved.create(dataBeforeStart);
  service2h.start();
  service1d.start();

  await Reserved.create(dataBatch1);
  await sleep(sleepInterval);

  currentTime += MINUTE - serviceInterval / 2;
  await Reserved.create(dataBatch2);
  await sleep(sleepInterval);

  currentTime += MINUTE;
  await sleep(sleepInterval);

  currentTime += HOUR * 12;
  await sleep(sleepInterval);

  expect(sender2h.send.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    Object {
      "name": "Петров П",
      "operationTime": 59500,
      "spec": "Гигапевт",
      "time": 7260000,
    },
  ],
  Array [
    Object {
      "name": "Сидоров С",
      "operationTime": 59500,
      "spec": "Мегапевт",
      "time": 7260000,
    },
  ],
  Array [
    Object {
      "name": "Иванов И",
      "operationTime": 119500,
      "spec": "Терапевт",
      "time": 7320000,
    },
  ],
]
`);

  expect(sender1d.send.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    Object {
      "name": "Петров П",
      "operationTime": 0,
      "spec": "Гигапевт",
      "time": 7260000,
    },
  ],
  Array [
    Object {
      "name": "Иванов И",
      "operationTime": 0,
      "spec": "Терапевт",
      "time": 7320000,
    },
  ],
  Array [
    Object {
      "name": "Сидоров С",
      "operationTime": 59500,
      "spec": "Мегапевт",
      "time": 7260000,
    },
  ],
  Array [
    Object {
      "name": "Сидоров С",
      "operationTime": 59500,
      "spec": "Гигапевт",
      "time": 86460000,
    },
  ],
  Array [
    Object {
      "name": "Иванов И",
      "operationTime": 59500,
      "spec": "Мегапевт",
      "time": 86460000,
    },
  ],
]
`);

  service2h.stop();
  service1d.stop();
}, 20000);
