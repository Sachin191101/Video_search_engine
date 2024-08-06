
const mySql = require("mysql");
require('dotenv').config();

const db = mySql.createConnection({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    database: process.env.MYSQLDATABASE,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    charset: 'utf8mb4'
});

db.connect((err) => {
    if(err) {
        console.log("error occured", err);
        return;
    }
    console.log("connection successful");
})

module.exports = db;