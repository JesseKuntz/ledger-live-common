import type { AccountBridge, CurrencyBridge } from "../../../types";
import type { Transaction } from "../types";
import { makeAccountBridgeReceive } from "../../../bridge/jsHelpers";
import { signOperation, broadcast } from "../../../bridge/mockHelpers";

import { sync, scanAccounts } from "../js-synchronisation";
import {
  createTransaction,
  updateTransaction,
  prepareTransaction,
} from "../js-transaction";
import estimateMaxSpendable from "../js-estimateMaxSpendable";
import getTransactionStatus from "../js-getTransactionStatus";

const receive = makeAccountBridgeReceive();

// Mocks
const preload = () => Promise.resolve({});
const hydrate = (): void => {};

const currencyBridge: CurrencyBridge = {
  preload,
  hydrate,
  scanAccounts,
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
