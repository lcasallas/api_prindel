import axios, { AxiosError, AxiosResponse } from "axios";
import dotenv from "dotenv";
import { AuthResponse, DataGuides, Param, Guide } from "../types";
import { saveLiquidateLog } from "./db";
const fs = require("fs");

const TEST_NRO_GUIA = "MT000143857CO";
dotenv.config();

const authenticate = async (): Promise<string> => {
  try {
    const urlAuth = process.env.URL_AUTH;
    const user = process.env.USER;
    const password = process.env.PASSWORD;

    if (!urlAuth || !user || !password) {
      throw new Error(
        "Environment variables URL_AUTH, USER, and PASSWORD must be defined"
      );
    }

    const response: AxiosResponse<AuthResponse> = await axios.post(urlAuth, {
      Username: user,
      Password: password,
    });

    return response.data.Token; // Asume que el token se encuentra en response.data.Token
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Error during authentication:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    process.exit(1);
  }
};

const digitalization = async (data: Guide[], token: string): Promise<void> => {
  for (const row of data) {

    const imagenBuffer = fs.readFileSync(
      `/IMGFOLLOW2/2024/8/75578/${TEST_NRO_GUIA}.png`
    );
    const imagenBase64 = imagenBuffer.toString("base64");

    const param: Param = {
      Barcode: row.nro_guia,
      UserID: "test",
      DigitalID: "ENT",
      FileBase64: imagenBase64,
      Latitude: "test",
      Longitude: "test"
    };
    // console.log(param);
    try {
      // console.log('TOKEN:', token);
      const response = await axios.post(process.env.URL_DIGITALIZATION as string, param, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log("Data sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending data:", (error as Error).message);
      process.exit(1);
    }
  }
};

const liquidate = async (data: DataGuides, token: string): Promise<void> => {
  const url = process.env.URL_LIQUIDATE || "";
  await Promise.all(
    data.map(async (envio) => {
      const guia = envio.nro_guia;
      const causal = envio.codigo_cliente;
      try {
        const response: AxiosResponse = await axios.post(
          url,
          {
            Barcode: guia,
            CausalLiquidationID: causal,
            DriverID: 10,
            VehicleID: 10,
            CargueID: 0,
            Procedente: 0,
            Names: "",
            Observations: "",
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        await saveLiquidateLog(envio, response.status, response.data);
        console.log({
          "Guia:": guia,
          "Response message:": response.data,
          "Response status:": response.status,
        });
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;

          // Verifica si la respuesta existe en el error
          if (axiosError.response) {
            console.log({
              "Guia:": guia,
              "Error status:": axiosError.response.status,
              "Error message:": axiosError.response.data,
            });
            await saveLiquidateLog(
              envio,
              axiosError.response.status,
              //@ts-ignore
              `${axiosError.response.data.Message}`
            );
          } else {
            console.error("Error sin respuesta:", axiosError.message);
          }
        } else {
          console.error("Error desconocido:", error);
        }
      }
    })
  );
};

/*
const digitalization_test = async (
  // data: DataGuides,
  token: string
): Promise<void> => {
  try {
    const url = process.env.URL_LIQUIDATE || "";
    const imagenBuffer = fs.readFileSync(
      `/IMGFOLLOW2/2024/8/75578/${TEST_NRO_GUIA}.png`
    );
    const imagenBase64 = imagenBuffer.toString("base64");

    console.log({ urla: url, token });
    const response: AxiosResponse = await axios
      .create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .post(url, {
        UserID: "111",
        FileBase64: imagenBase64,
        Barcode: TEST_NRO_GUIA,
      });
    console.log({ res: response.data });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Error during authentication:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    process.exit(1);
  }
};*/

export { authenticate, digitalization, liquidate };
