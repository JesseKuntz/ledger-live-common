import type { AccountBridge, CurrencyBridge } from "../../../types";
import type { Transaction } from "../types";
import { makeAccountBridgeReceive } from "../../../bridge/jsHelpers";

import { sync, scanAccounts } from "../js-synchronisation";
import {
  createTransaction,
  updateTransaction,
  prepareTransaction,
} from "../js-transaction";
import getTransactionStatus from "../js-getTransactionStatus";
import signOperation from "../js-signOperation";
import broadcast from "../js-broadcast";

const receive = makeAccountBridgeReceive();

const currencyBridge: CurrencyBridge = {
  preload: () => Promise.resolve({}),
  hydrate: () => {},
  scanAccounts,
};

const estimateMaxSpendable = () => {
  throw new Error("estimateMaxSpendable not implemented");
};

const accountBridge: AccountBridge<Transaction> = {
  estimateMaxSpendable,
  createTransaction,
  updateTransaction,
  getTransactionStatus,
  prepareTransaction,
  sync,
  receive,
  signOperation,
  broadcast,
};

export default { currencyBridge, accountBridge };
