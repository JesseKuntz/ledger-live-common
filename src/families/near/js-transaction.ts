import { $Shape } from "utility-types";
import { BigNumber } from "bignumber.js";
import type { Account } from "../../types";
import type { Transaction } from "./types";

import getEstimatedFees from "./js-getFeesForTransaction";

export const createTransaction = (): Transaction => ({
  family: "near",
  mode: "send",
  amount: new BigNumber(0),
  recipient: "",
  useAllAmount: false,
  fees: new BigNumber(0),
});

export const updateTransaction = (
  t: Transaction,
  patch: $Shape<Transaction>
): Transaction => ({ ...t, ...patch });

export const prepareTransaction = async (a: Account, t: Transaction) => {
  const fees = await getEstimatedFees();

  // TODO: set amount to estimateMaxSpendable when sending max
  // https://github.com/JesseKuntz/ledger-live-common/blob/mina-integration/src/families/mina/js-transaction.ts#L28-L30
  const amount = t.useAllAmount
    ? await a.spendableBalance.minus(fees)
    : t.amount;

  return { ...t, fees, amount };
};
