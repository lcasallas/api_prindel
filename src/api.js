const axios = require("axios");
const dotenv = require("dotenv");
const db = require("./db");
dotenv.config();

// Configuración de la base de datos PostgreSQL

const authenticate = async () => {
  try {
    const response = await axios.post(process.env.URL_AUTH, {
      Username: process.env.USER,
      Password: process.env.PASSWORD,
    });

    return response.data.Token; // Asume que el token se encuentra en response.data.token
  } catch (error) {
    console.error("Error during authentication:", error.message);
    process.exit(1);
  }
};

const sendData = async (token, data) => {
  for (const row of data){
    const param = {
      Barcode: row.nro_guia,
      UserID: "",
      DigitalID: "ENT",
      FileBase64: "",
      Latitude: "",
      Longitude: ""
    }
    try {
      const response = await axios.post(process.env.URL_SEND, param, {
        headers: {
          Authorization: `⁠Bearer ${token}`,
        },
      });
      console.log("Data sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending data:", error.message);
      process.exit(1);
    }
  }  
};

const main = async () => {
  const token = await authenticate();
  console.log({ token });
  const data = await fetchDataFromDatabase();
  await sendData(token, data);
};

main();
