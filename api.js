const axios = require('axios');
const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

// Configuración de la base de datos PostgreSQL
// const dbClient = new Client({
//     user: 'your_db_user',
//     host: 'your_db_host',
//     database: 'your_db_name',
//     password: 'your_db_password',
//     port: 5432,
// });

const authenticate = async () => {
    try {
        const response = await axios.post(process.env.URL_AUTH, {
            Username: process.env.USER,
            Password: process.env.PASSWORD
        });

        return response.data.token;  // Asume que el token se encuentra en response.data.token
    } catch (error) {
        console.error('Error during authentication:', error.message);
        process.exit(1);
    }
};

// const fetchDataFromDatabase = async () => {
//     try {
//         await dbClient.connect();
//         const query = 'SELECT * FROM your_table';  // Cambia esto a tu consulta SQL real
//         const result = await dbClient.query(query);
//         await dbClient.end();
//         return result.rows;
//     } catch (error) {
//         console.error('Error fetching data from database:', error.message);
//         process.exit(1);
//     }
// };

const sendData = async (token, data) => {
    try {
        const response = await axios.post(process.env.URL_SEND, data, {
            headers: {
                Authorization: `⁠Bearer ${token}`
            }
        });
        console.log('Data sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending data:', error.message);
        process.exit(1);
    }
};

const main = async () => {
    const token = await authenticate();
    // const data = await fetchDataFromDatabase();
    // await sendData(token, data);
};

main();
