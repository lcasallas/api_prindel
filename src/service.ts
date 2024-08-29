import axios, { AxiosError, AxiosResponse } from "axios";
import dotenv from "dotenv";
import { AuthResponse, DataGuides } from "../types";
import { saveDigitalizationLog, saveLiquidateLog } from "./db";
const fs = require("fs");

const TEST_NRO_GUIA = "MT000143857CO";
dotenv.config();

const authenticate = async (): Promise<string> => {
  try {
    const urlAuth = process.env.URL_AUTH;
    const user = process.env.USERWEBSERVICE;
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

const liquidate = async (data: DataGuides, token: string): Promise<void> => {
  console.log("entre a liquidar");
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

const digitalization = async (
  data: DataGuides,
  token: string
): Promise<void> => {
  const url = process.env.URL_DIGITALIZATION || "";
  console.log("entre a digitalizar");
  await Promise.all(
    data.map(async (envio) => {
      const guia = envio.nro_guia;
      const imageRoute = envio.ruta_imagen;
      const imagenBuffer = fs.readFileSync(`${imageRoute}`);
      const imagenBase64 = imagenBuffer.toString("base64");

      try {
        const response: AxiosResponse = await axios.post(
          url,
          {
            UserID: "111",
            FileBase64: imagenBase64,
            Barcode: TEST_NRO_GUIA,
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        await saveDigitalizationLog(
          envio,
          response.status,
          JSON.stringify(response.data)
        );
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

export { authenticate, liquidate, digitalization };
