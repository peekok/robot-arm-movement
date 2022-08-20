const mysql = require("mysql");
require("dotenv").config();
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

const addMovement = async (joint, direction, position) => {
  db.query(
    "INSERT INTO robot.movements (Timestamp, joint, direction, position) VALUES (now(), ?, ?, ?)",
    [joint, direction, position],
    (err, result) => {
      if (err) {
        console.log(`MYSQL 🗄 : ${err}`);
      } else {
        console.log("MYSQL 🗄 : Movement added");
      }
    }
  );
};

const addCurrent = async (joint, direction, position) => {
  db.query("DELETE FROM robot.currentPosition", (err, result) => {
    if (err) {
      console.log(`MYSQL 🗄 : ${err}`);
    } else {
      console.log("MYSQL 🗄 : Table cleared");
    }
  });
  db.query(
    "INSERT INTO robot.currentPosition (Timestamp, joint, direction, position) VALUES (now(), ?, ?, ?)",
    [joint, direction, position],
    (err, result) => {
      if (err) {
        console.log(`MYSQL 🗄 : ${err}`);
      } else {
        console.log("MYSQL 🗄 : Current position added");
      }
    }
  );
};
// Function to get current position and return it as an object
const getCurrentJoint = async () => {
  const current = [];
  db.query("SELECT * FROM robot.currentPosition", (err, result) => {
    if (err) {
      console.log(`MYSQL 🗄 : ${err}`);
    } else {
      if (!result[0]) return;
      current.push(result[0].joint);
      console.log("MYSQL 🗄 : Current Joint retrieved");
    }
  });
  return current;
};

const getCurrentPosition = async () => {
  const current = [];
  db.query("SELECT * FROM robot.currentPosition", (err, result) => {
    if (err) {
      console.log(`MYSQL 🗄 : ${err}`);
    } else {
      if (!result[0]) return;
      current.push(result[0].position);
      console.log("MYSQL 🗄 : Current Position retrieved");
    }
  });
  return current;
};

const getCurrentDirection = async () => {
  const current = [];
  db.query("SELECT * FROM robot.currentPosition", (err, result) => {
    if (err) {
      console.log(`MYSQL 🗄 : ${err}`);
    } else {
      if (!result[0]) return;
      current.push(result[0].direction);
      console.log("MYSQL 🗄 : Current Direction retrieved");
    }
  });
  return current;
};

const getCurrentDate = async () => {
  const current = [];
  db.query("SELECT * FROM robot.currentPosition", (err, result) => {
    if (err) {
      console.log(`MYSQL 🗄 : ${err}`);
    } else {
      if (!result[0]) return;
      current.push(`${result[0].Timestamp}, from database 🗄.`);
      console.log("MYSQL 🗄 : Current Date retrieved");
    }
  });
  return current;
};

const allRequires = {
  addMovement,
  addCurrent,
  getCurrentJoint,
  getCurrentPosition,
  getCurrentDirection,
  getCurrentDate,
};
module.exports = allRequires;
