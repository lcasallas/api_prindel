import { authenticate, liquidate, digitalization } from "./service";
import { connect, disconnect, fetchData } from "./db";

const main = async () => {
  await connect();
  const token = await authenticate();
  // const data = await fetchData("v_guias_reportar_472");
  const data = await fetchData("t_guias_x_proceso");
  await digitalization(data, token);
  // await liquidate(data, token);
  //await disconnect();
};

main();
