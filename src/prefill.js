"use strict";
const { Doctor, User, connection } = require("./db");

const doctors = [
  {
    _id: "0000",
    name: "Иванов И",
    spec: "Терапевт",
  },
  {
    _id: "0001",
    name: "Петров П",
    spec: "Гигапевт",
  },
  {
    _id: "0002",
    name: "Сидоров С",
    spec: "Мегапевт",
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

  const slots = [];
  for (let day = 1; day < 30; day++) {
    for (let hour = 8; hour < 17; hour += 2) {
      slots.push(new Date(2021, 6, day, hour));
    }
  }

  await Doctor.updateMany(
    { _id: { $in: doctors.map((d) => d._id) } },
    { slots }
  );

  await connection.close();
}

init().catch(console.error);
