const mysql = require("mysql2/promise");
const fs = require("fs");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  port: 3306,
  multipleStatements: true,
};

async function initializeDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    await connection.query("CREATE DATABASE IF NOT EXISTS Commerce");
    await connection.query("USE Commerce");

    const schema = fs.readFileSync("./db.sql", "utf8");
    await connection.query(schema);

    console.log("Base de données initialisée avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base :", error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initializeDatabase();

module.exports = { initializeDatabase };
