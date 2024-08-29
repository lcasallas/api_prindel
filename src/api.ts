import { authenticate, digitalization, liquidate } from "./service";
import { connect, disconnect, fetchData } from "./db";

const main = async () => {
  await connect();
  const token = await authenticate();
  const data = await fetchData("v_guias_reportar_472");
  await liquidate(data, token);
  const data2 = await fetchData("v_imagenes_reportar_472");
  await digitalization(data2, token);
  //await disconnect();
};

main();
