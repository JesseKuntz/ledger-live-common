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
  fees: new BigNumber(0),
});

export const updateTransaction = (
  t: Transaction,
  patch: $Shape<Transaction>
): Transaction => ({ ...t, ...patch });

export const prepareTransaction = async (
  a: Account,
  t: Transaction
): Promise<Transaction> => {
  let fees = t.fees;

  fees = await getEstimatedFees();

  if (!sameFees(t.fees, fees)) {
    return { ...t, fees };
  }

  return t;
};
