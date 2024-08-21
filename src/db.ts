import { Client } from "pg";
import dotenv from "dotenv";
import { DBConfig, Guide } from "../types";
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

const disconnect = async () => {
  try {
    await dbClient.end();
    console.log("Desconectado...");
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

const fetchData = async (tableName: string) => {
  try {
    const query = `SELECT * FROM ${tableName} WHERE id_orden = 75091 limit 2`;
    const result = await dbClient.query(query);
    //await dbClient.end();
    return result.rows;
  } catch (error: any) {
    console.error("Error fetching data from database:", error.message);
    process.exit(1);
  }
};

const saveLiquidateLog = async (
  envio: Guide,
  status: number,
  message: string
) => {
  try {
    const query = `
      INSERT INTO t_envios_reportados_web_service
      SELECT
        nextval('t_envios_reportados_web_service_id_seq'), 
        id_guia,
        nro_guia,
        id_cliente,
        orden,
        fecha_orden,
        id_gestion_detalle,
        gestion_detalle,
        fecha_gestion,
        ruta_imagen,
        codigo_cliente,
        'status: ${status} - message: ${message}',
        now(),
        false
        FROM v_guias_reportar_472 WHERE id_guia = ${envio.id_guia}
    `;

    console.log({ "Inserte la guia:": envio.nro_guia });

    const result = await dbClient.query(query);
    //await dbClient.end();
    return result.rows;
  } catch (error: any) {
    console.error("Error saving data to database:", error.message);
  }
};

export { fetchData, saveLiquidateLog, connect, disconnect };
