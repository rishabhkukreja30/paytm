const zod = require("zod");

const signUpBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firtName: zod.string(),
  lastName: zod.string(),
});

module.exports = {
  signUpBody,
};
