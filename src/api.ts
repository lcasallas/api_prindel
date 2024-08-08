import { authenticate, liquidate } from "./service";
import { fetchData } from "./db";

const main = async () => {
  const token = await authenticate();
  const data = await fetchData("v_guias_reportar_472");
  await liquidate(token);
};

main();
