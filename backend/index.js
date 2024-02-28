const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello rishbh");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Sever started on port ${PORT}`);
});
