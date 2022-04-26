import { BigNumber } from "bignumber.js";
import type { Transaction } from "./types";
import type { Account, Operation } from "../../types";
import { encodeOperationId } from "../../operation";
import { getNonce } from "./logic";

export const buildOptimisticOperation = (
  account: Account,
  transaction: Transaction,
  fee: BigNumber
): Operation => {
  const type = "OUT";

  const value = new BigNumber(transaction.amount).plus(fee);

  const operation: Operation = {
    id: encodeOperationId(account.id, "", type),
    hash: transaction.hash || "",
    type,
    value,
    fee,
    blockHash: null,
    blockHeight: null,
    senders: [account.freshAddress],
    recipients: [transaction.recipient].filter(Boolean),
    accountId: account.id,
    transactionSequenceNumber: transaction.nonce || getNonce(account),
    date: new Date(),
    extra: {},
  };

  return operation;
};
