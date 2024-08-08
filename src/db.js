const { Client } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const DBCONFIG = {
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  database: process.env.DBNAME,
  password: process.env.DBPASSWD,
  port: process.env.DBPORT,
};

console.log({ DBCONFIG });
const dbClient = new Client(DBCONFIG);

const connect = async () => {
  try {
    await dbClient.connect();
    console.log("Conectado...");
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

const fetchData = async () => {
  try {
    await connect();
    const query = " select nro_guia, id_gestion_detalle from t_guias_x_proceso where orden = 74962  limit 4"; // Cambia esto a tu consulta SQL real
    const result = await dbClient.query(query);
    await dbClient.end();
    console.log({ result: result.rows });
    return result.rows;
    // console.log("me conecte");
    return;
  } catch (error) {
    console.error("Error fetching data from database:", error.message);
    process.exit(1);
  }
};

module.exports = {
  fetchData,
};
