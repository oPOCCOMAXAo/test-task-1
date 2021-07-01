const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const { Doctor, Reserved, User } = require("../db");

const router = new Router();

router.use(bodyParser());

router.use(async (ctx, next) => {
  ctx.state.error = null;
  await next();
  if (ctx.state.error !== null) {
    ctx.body = {
      success: false,
      error: ctx.state.error,
    };
  } else {
    ctx.body = {
      success: true,
      data: ctx.state.data,
    };
  }
});

router.post("/reserve", async (ctx) => {
  const {
    state,
    request: { body },
  } = ctx;

  if (body === undefined) {
    state.error = "not enough parameters";
    return;
  }

  const { user, doctor, slot } = body;
  if (!user || !doctor || !slot) {
    state.error = "not enough parameters";
    return;
  }

  if (!(await User.exists(user))) {
    state.error = "user doesn't exist";
    return;
  }

  const slotTime = slot && parseInt(slot);
  if (slotTime < Date.now() || !(await Doctor.slotExists(doctor, slotTime))) {
    state.error = "slot doesn't exist";
    return;
  }

  const err = await Reserved.reserve(doctor, user, slotTime);
  if (err) {
    state.error = err;
  } else {
    state.data = { user, doctor, slot: slotTime };
  }
});

module.exports = router;
