import type { Resolver } from "../../hw/getAddress/types";

import Mina from "./hw-app-mina";

const resolver: Resolver = async (transport, { path }) => {
  const myCoin = new Mina(transport);

  const r = await myCoin.getAddress(path);

  return {
    address: r.address,
    publicKey: r.publicKey,
    path,
  };
};

export default resolver;
