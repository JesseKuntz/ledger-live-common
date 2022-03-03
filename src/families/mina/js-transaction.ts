import { $Shape } from "utility-types";
import { BigNumber } from "bignumber.js";
import type { Account } from "../../types";
import type { Transaction } from "./types";

import getEstimatedFees from "./js-getFeesForTransaction";

const sameFees = (a, b) => (!a || !b ? a === b : a.eq(b));

export const createTransaction = (): Transaction => ({
  family: "mina",
  mode: "send",
  amount: new BigNumber(0),
  recipient: "",
  memo: "",
  useAllAmount: false,
  fee: new BigNumber(0),
});

export const updateTransaction = (
  t: Transaction,
  patch: $Shape<Transaction>
): Transaction => ({ ...t, ...patch });

export const prepareTransaction = async (
  a: Account,
  t: Transaction
): Promise<Transaction> => {
  let fee = t.fee;

  fee = await getEstimatedFees();

  if (!sameFees(t.fee, fee)) {
    return { ...t, fee };
  }

  return t;
};
