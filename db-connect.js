const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "test",
    password: "T1st@localhost",
    database: "mano_db",
    waitForConnections: "true",
    connectLimit: 10,
    queneLimit: 0
});

module.exports = pool.promise();