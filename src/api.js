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

const sanitizeBearerToken = (token) => {
  return token.replace(/[^a-zA-Z0-9._-]/g, '');
};



const sendData = async (token, data) => {
  for (const row of data){
    const param = {
      Barcode: row.nro_guia,
      UserID: "test",
      DigitalID: "ENT",
      FileBase64: "test",
      Latitude: "test",
      Longitude: "test"
    }
    console.log(param)
    try {
      console.log('TOKEN:', token)
      const response = await axios.post(process.env.URL_SEND, param, {
        headers: {
          'Authorization': `Bearer ${token}`,
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
  bearerToken = sanitizeBearerToken(token);
  console.log({ token });
  const data = await db.fetchData();
  await sendData(bearerToken, data);
};

main();
