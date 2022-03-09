import { MinaLedgerJS } from "mina-ledger-js";
import type { Resolver } from "../../hw/getAddress/types";
import { UserRefusedAddress, DisconnectedDevice } from "@ledgerhq/errors";

import { getAccountNumberFromDerivationPath } from "./logic";

const resolver: Resolver = async (transport, { path }) => {
  const mina = new MinaLedgerJS(transport);

  const accountNumber = getAccountNumberFromDerivationPath(path);

  const {
    publicKey: address,
    message,
    statusText,
  } = await mina.getAddress(accountNumber);

  if (message === "DisconnectedDevice") {
    throw new DisconnectedDevice();
  }

  if (statusText === "CONDITIONS_OF_USE_NOT_SATISFIED") {
    throw new UserRefusedAddress();
  }

  return {
    address,
    publicKey: "",
    path,
  };
};

export default resolver;
