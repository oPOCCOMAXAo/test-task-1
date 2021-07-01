"use strict";
const { Doctor, User, connection } = require("./db");

const doctors = [
  {
    _id: "0000",
    name: "Иванов И",
    spec: "Терапевт",
    slots: [
      new Date(2021, 6, 1, 10),
      new Date(2021, 6, 1, 12),
      new Date(2021, 6, 1, 14),
    ],
  },
  {
    _id: "0001",
    name: "Петров П",
    spec: "Гигапевт",
    slots: [
      new Date(2021, 6, 1, 10),
      new Date(2021, 6, 1, 12),
      new Date(2021, 6, 1, 14),
    ],
  },
  {
    _id: "0002",
    name: "Сидоров С",
    spec: "Мегапевт",
    slots: [
      new Date(2021, 6, 1, 10),
      new Date(2021, 6, 1, 12),
      new Date(2021, 6, 1, 14),
    ],
  },
];

const users = [
  {
    _id: "1000",
    phone: "+11111111111",
    name: "Иванов И",
  },
  {
    _id: "1001",
    phone: "+222222222222",
    name: "Петров П",
  },
  {
    _id: "1002",
    phone: "+333333333333",
    name: "Сидоров С",
  },
];

async function init() {
  try {
    await Doctor.insertMany(doctors, { ordered: false });
  } catch (e) {
    if (e.code !== 11000 /* duplicate */) {
      console.error(e);
    }
  }

  try {
    await User.insertMany(users, { ordered: false });
  } catch (e) {
    if (e.code !== 11000) {
      console.error(e);
    }
  }

  await connection.close();
}

init().catch(console.error);
