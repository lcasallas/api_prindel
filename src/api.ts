import { authenticate, liquidate } from "./service";
import { connect, disconnect, fetchData } from "./db";

const main = async () => {
  await connect();
  const token = await authenticate();
  const data = await fetchData("v_guias_reportar_472");
  await liquidate(data, token);
  //await disconnect();
};

main();
