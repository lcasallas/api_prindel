import { Client } from "pg";
import dotenv from "dotenv";
import { DBConfig } from "../types";
dotenv.config();

const DBCONFIG: DBConfig = {
  user: process.env.DBUSER!,
  host: process.env.DBHOST!,
  database: process.env.DBNAME!,
  password: process.env.DBPASSWD!,
  port: +(process.env.DBPORT || 5432),
};

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

const fetchData = async (tableName: string) => {
  try {
    await connect();
    const query = `SELECT * FROM ${tableName} WHERE id_orden = 75091 LIMIT 1`; // Cambia esto a tu consulta SQL real
    const result = await dbClient.query(query);
    await dbClient.end();
    return result.rows;
  } catch (error: any) {
    console.error("Error fetching data from database:", error.message);
    process.exit(1);
  }
};

export { fetchData };
