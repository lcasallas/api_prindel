import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
import { AuthResponse, DataGuides } from "../types";
const fs = require("fs");

const TEST_NRO_GUIA = "MT000143874CO";
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

const liquidate = async (
  // data: DataGuides,
  token: string
): Promise<void> => {
  try {
    const url = process.env.URL_LIQUIDATE || "";
    console.log({ urla: url, token });
    const response: AxiosResponse = await axios
      .create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .post(url, {
        Barcode: TEST_NRO_GUIA,
        CausalLiquidationID: 9,
        Names: "juan",
        Observations: "ninguna",
      });
    console.log({ res: response.data });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Error during authentication:", { error });
    } else {
      console.error("Unexpected error:", error);
    }
    process.exit(1);
  }
};

const digitalization = async (
  // data: DataGuides,
  token: string
): Promise<void> => {
  try {
    const url = process.env.URL_LIQUIDATE || "";
    const imagenBuffer = fs.readFileSync(
      "/IMGFOLLOW2/2024/8/75578/TC005273943CO.png"
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
};

export { authenticate, liquidate };
