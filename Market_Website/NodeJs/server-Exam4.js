var bodyParser = require("body-parser");
const taskHandler = require("./routes/task");
const usersHandler = require("./routes/family");

const express = require("express");
var app = express();

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

const cors = require("cors");
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// ==========================================================================================================================================================

app.get("/getFamily", async (req, res) => {
  users = await usersHandler.getFamily();
  console.log("users",users)
  res.send(users);
});
// ==========================================================================================================================================================

app.get("/getTasks", async (req, res) => {
  tasks = await taskHandler.getTasks();
  res.send(tasks);
});
// ==========================================================================================================================================================

app.post("/addTask", async (req, res) => {
  console.log("task add:", req.body);
  add = await taskHandler.postTask(req.body);
  res.send(add);
});
// ==========================================================================================================================================================

app.post("/delete", async (req, res) => {
  console.log("Delete : ", req.body.id);
  let deleted = await taskHandler.deleteTask(req.body.id);
  res.send(deleted);
});
// ==========================================================================================================================================================

app.listen(5000);
