import type { Resolver } from "../../hw/getAddress/types";

import Mina from "./hw-app-mina";

const resolver: Resolver = async (transport, { path }) => {
  const mina = new Mina(transport);

  const r = await mina.getAddress(path);

  return {
    address: r.address,
    publicKey: r.publicKey,
    path,
  };
};

export default resolver;
