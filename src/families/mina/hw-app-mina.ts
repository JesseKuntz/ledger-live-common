import type Transport from "@ledgerhq/hw-transport";
import {
  UserRefusedAddress,
  DisconnectedDevice,
  TransportError,
} from "@ledgerhq/errors";
import { MinaLedgerJS } from "mina-ledger-js";
import { SignTransactionArgs } from "mina-ledger-js";

import { getAccountNumberFromDerivationPath } from "./logic";

export default class Mina {
  mina: MinaLedgerJS;

  constructor(transport: Transport) {
    this.mina = new MinaLedgerJS(transport);
  }

  async getAddress(path: string): Promise<{
    publicKey: string;
    address: string;
  }> {
    const accountNumber = getAccountNumberFromDerivationPath(path);

    const {
      publicKey: address,
      message,
      statusText,
    } = await this.mina.getAddress(accountNumber);

    if (message === "DisconnectedDevice") {
      throw new DisconnectedDevice();
    }

    if (statusText === "CONDITIONS_OF_USE_NOT_SATISFIED") {
      throw new UserRefusedAddress();
    }

    return {
      address,
      publicKey: "",
    };
  }

  async signTransaction(
    unsignedTransaction: SignTransactionArgs
  ): Promise<string> {
    const { signature, returnCode, statusText } =
      await this.mina.signTransaction(unsignedTransaction);

    if (returnCode !== "9000") {
      throw new TransportError(statusText, returnCode);
    }

    return signature;
  }
}
