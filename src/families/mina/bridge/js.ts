import { BigNumber } from "bignumber.js";
import {
  NotEnoughBalance,
  RecipientRequired,
  InvalidAddress,
  FeeTooHigh,
} from "@ledgerhq/errors";
import type { AccountBridge, CurrencyBridge } from "../../../types";
import type { Transaction } from "../types";
import { makeAccountBridgeReceive } from "../../../bridge/jsHelpers";
import {
  signOperation,
  broadcast,
  isInvalidRecipient,
} from "../../../bridge/mockHelpers";
import { getMainAccount } from "../../../account";

import { sync, scanAccounts } from "../js-synchronisation";
import {
  createTransaction,
  updateTransaction,
  prepareTransaction,
} from "../js-transaction";

const receive = makeAccountBridgeReceive();

// Mocks
const preload = () => Promise.resolve({});
const hydrate = (): void => {};
const estimateMaxSpendable = ({ account, parentAccount, transaction }) => {
  const mainAccount = getMainAccount(account, parentAccount);
  const estimatedFees = transaction?.fees || new BigNumber(5000);
  return Promise.resolve(
    BigNumber.max(0, mainAccount.balance.minus(estimatedFees))
  );
};
const getTransactionStatus = (account, t) => {
  const errors = {} as any;
  const warnings = {} as any;
  const useAllAmount = !!t.useAllAmount;

  const estimatedFees = new BigNumber(5000);

  const totalSpent = useAllAmount
    ? account.balance
    : new BigNumber(t.amount).plus(estimatedFees);

  const amount = useAllAmount
    ? account.balance.minus(estimatedFees)
    : new BigNumber(t.amount);

  if (amount.gt(0) && estimatedFees.times(10).gt(amount)) {
    warnings.amount = new FeeTooHigh();
  }

  if (totalSpent.gt(account.balance)) {
    errors.amount = new NotEnoughBalance();
  }

  if (!t.recipient) {
    errors.recipient = new RecipientRequired();
  } else if (isInvalidRecipient(t.recipient)) {
    errors.recipient = new InvalidAddress();
  }

  return Promise.resolve({
    errors,
    warnings,
    estimatedFees,
    amount,
    totalSpent,
  });
};

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
