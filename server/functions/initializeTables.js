const mysql = require("mysql");
require("dotenv").config();
const initializeTables = async () => {
  const db = mysql.createConnection({
    host: process.env["DBHOST"],
    user: process.env["DBUSER"],
    password: process.env["DBPASS"],
  });
  db.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("MYSQL 🗄 : Connected to database");
    }
  });

  db.query("CREATE DATABASE IF NOT EXISTS robot", (err, result) => {
    if (err) {
      console.log(`MYSQL 🗄 : ${err}`);
    } else {
      console.log("MYSQL 🗄 : robot Database created");
    }
  });
  db.query("USE robot", (err, result) => {
    if (err) {
      console.log(`MYSQL 🗄 : ${err}`);
    } else {
      console.log("MYSQL 🗄 : robot Database selected");
    }
  });
  db.query(
    "CREATE TABLE IF NOT EXISTS movements (id INT AUTO_INCREMENT PRIMARY KEY, Timestamp datetime, joint VARCHAR(15), direction VARCHAR(15), position INT)",
    (err, result) => {
      if (err) {
        console.log(`MYSQL 🗄 : ${err}`);
      } else {
        console.log("MYSQL 🗄 : Movement Table created");
      }
    }
  );
  db.query(
    "CREATE TABLE IF NOT EXISTS currentPosition (Timestamp datetime, joint VARCHAR(15), direction VARCHAR(15), position INT)",
    (err, result) => {
      if (err) {
        console.log(`MYSQL 🗄 : ${err}`);
      } else {
        console.log("MYSQL 🗄 : Current Table created");
      }
    }
  );
};

module.exports = initializeTables;
