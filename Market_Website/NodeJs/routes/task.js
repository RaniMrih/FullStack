var mysql = require("mysql");
const usersTable = "tasks";

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:"test4"
});
// ==========================================================================================================================================================

module.exports.getTasks = () => {
  let sql = `SELECT tasks.id , tasks.description , tasks.date , users.name FROM tasks INNER JOIN users ON users.id=tasks.userId;`;
  return new Promise((resolve, reject) => {
    con.query(sql, async (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
};
// ==========================================================================================================================================================

module.exports.postTask = async task => {
  let sql = `INSERT INTO tasks SET ?`;
  return new Promise((resolve, reject) => {
    con.query(sql, task, async (err, result) => {
      if (err) throw err;
      resolve(true);
    });
  });
};
// ==========================================================================================================================================================

module.exports.deleteTask = async task => {
  let sql = `DELETE FROM tasks WHERE id=${task}`;
  return new Promise((resolve, reject) => {
    con.query(sql, async (err, result) => {
      if (err) throw err;
      resolve(true);
    });
  });
};
// ==========================================================================================================================================================
