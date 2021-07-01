process.env.PORT = "0"; // free port for test server
process.env.SERVICE = "off"; // disable service

const qs = require("querystring");
const axios = require("axios");
const { connection, Reserved } = require("../src/db");

let server;
let port;

const correctData = [
  {
    user: "1001",
    doctor: "0000",
    slot: new Date(2021, 6, 1, 10).getTime(),
  },
];
const incorrectDataParams = [
  {
    doctor: "0000",
    slot: new Date(2021, 6, 1, 10).getTime(),
  },
  {
    user: "1001",
    slot: new Date(2021, 6, 1, 10).getTime(),
  },
  {
    user: "1001",
    doctor: "0000",
  },
  {},
];
const incorrectDataSlot = [
  {
    user: "1001",
    doctor: "1000",
    slot: new Date(2021, 6, 1, 10).getTime(),
  },
  {
    user: "1001",
    doctor: "0000",
    slot: new Date(2021, 6, 1, 11).getTime(),
  },
];
const incorrectDataUser = [
  {
    user: "0001",
    doctor: "0000",
    slot: new Date(2021, 6, 1, 10).getTime(),
  },
];

beforeAll(() => {
  server = require("../src/index");
  port = server.address().port;
});

afterAll(async () => {
  server.close();
  for (let data of correctData) {
    await Reserved.deleteOne({
      ...data,
      time: data.slot,
      slot: undefined,
    }).exec();
  }
  await connection.close();
});

test("reserve free slot", async () => {
  for (let data of correctData) {
    const res = await axios.post(
      `http://localhost:${port}/reserve`,
      qs.stringify(data)
    );
    expect(res.data).toEqual({ success: true, data });
  }
});

test("reserve non-empty slot", async () => {
  for (let data of correctData) {
    const res = await axios.post(
      `http://localhost:${port}/reserve`,
      qs.stringify(data)
    );
    expect(res.data).toEqual({
      success: false,
      error: "slot already reserved",
    });
  }
});

test("incorrect data: params", async () => {
  for (let data of incorrectDataParams) {
    const res = await axios.post(
      `http://localhost:${port}/reserve`,
      qs.stringify(data)
    );
    expect(res.data).toEqual({
      success: false,
      error: "not enough parameters",
    });
  }
});

test("incorrect data: slot", async () => {
  for (let data of incorrectDataSlot) {
    const res = await axios.post(
      `http://localhost:${port}/reserve`,
      qs.stringify(data)
    );
    expect(res.data).toEqual({
      success: false,
      error: "slot doesn't exist",
    });
  }
});

test("incorrect data: user", async () => {
  for (let data of incorrectDataUser) {
    const res = await axios.post(
      `http://localhost:${port}/reserve`,
      qs.stringify(data)
    );
    expect(res.data).toEqual({
      success: false,
      error: "user doesn't exist",
    });
  }
});
