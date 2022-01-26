const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config();
const db = require("./models/db");


app.use(cors({
  origin: true,
}));
app.use(express.json());

db.create_db();
app.use("/api", require("./routers/route"));


app.get('*', (req, res) => {
  res.send("hello world")
})


if (process.env.ENV) {
  app.listen(require('./config/env').server.port, () => {
    console.log("server is up and running")
  })
}