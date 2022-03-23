import invariant from "invariant";
import flatMap from "lodash/flatMap";

import type { Transaction, AccountLike } from "../../types";

const options = [
  {
    name: "mode",
    type: String,
    desc: "mode of transaction: send",
  },
  {
    name: "fees",
    type: String,
    desc: "transaction fees",
  },
];

function inferTransactions(
  transactions: Array<{
    account: AccountLike;
    transaction: Transaction;
  }>,
  opts: Record<string, string>,
  { inferAmount }: any
): Transaction[] {
  return flatMap(transactions, ({ transaction, account }) => {
    invariant(transaction.family === "mina", "mina family");

    return {
      ...transaction,
      family: "mina",
      mode: opts.mode || "send",
      fees: opts.fees ? inferAmount(account, opts.fees) : null,
    } as Transaction;
  });
}

export default {
  options,
  inferTransactions,
};
