var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:"test4"
});
// ==========================================================================================================================================================

module.exports.getFamily = user => {
  let sql = `SELECT * FROM users`;
  return new Promise((resolve, reject) => {
    con.query(sql, async (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
};
