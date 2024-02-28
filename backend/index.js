const express = require("express");
const mainRouter = require("./routes/index");

const app = express();

const PORT = 3000;

app.use(express.json());

app.use("/api/v1", mainRouter);

app.listen(PORT, () => {
  console.log(`Sever started on port ${PORT}`);
});
