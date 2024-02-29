const zod = require("zod");

const signUpBody = zod.object({
  username: zod.string().email().max(30).min(3),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

const signInBody = zod.object({
  username: zod.string().email().max(30).min(3),
  password: zod.string(),
});

module.exports = {
  signUpBody,
  signInBody,
};
