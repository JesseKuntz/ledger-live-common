import { BigNumber } from "bignumber.js";
import type { MinaResourcesRaw, MinaResources } from "./types";

export function toMinaResourcesRaw(r: MinaResources): MinaResourcesRaw {
  const { nonce, pendingTransactions } = r;
  return {
    nonce,
    pendingTransactions: pendingTransactions?.map((transaction) => ({
      ...transaction,
      amount: transaction.amount.toString(),
      fees: transaction.fees.toString(),
    })),
  };
}

export function fromMinaResourcesRaw(r: MinaResourcesRaw): MinaResources {
  const { nonce, pendingTransactions } = r;
  return {
    nonce,
    pendingTransactions: pendingTransactions?.map((transaction) => ({
      ...transaction,
      amount: new BigNumber(transaction.amount),
      fees: new BigNumber(transaction.fees),
    })),
  };
}
