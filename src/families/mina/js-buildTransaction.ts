import { SignTransactionArgs, TxType, Networks } from "mina-ledger-js";
import type { Account } from "../../types";
import { AccountNeedResync } from "../../errors";
import type { Transaction } from "./types";
import {
  FALLBACK_FEE,
  getAccountNumberFromDerivationPath,
  getNonce,
} from "./logic";

const getTransactionType = (t: Transaction) => {
  switch (t.mode) {
    case "send":
      return TxType.PAYMENT;
    default:
      throw new Error("Unknown mode in transaction");
  }
};

export const buildTransaction = (
  a: Account,
  t: Transaction
): SignTransactionArgs => {
  if (!a.freshAddresses.length) {
    throw new AccountNeedResync();
  }

  const senderAccount = getAccountNumberFromDerivationPath(
    a.freshAddresses[0].derivationPath
  );
  const fee = t?.fee ? t.fee.toNumber() : FALLBACK_FEE;

  const unsigned = {
    txType: getTransactionType(t),
    senderAccount: senderAccount,
    senderAddress: a.freshAddress,
    receiverAddress: t.recipient,
    amount: t.amount.toNumber(),
    fee,
    nonce: getNonce(a),
    memo: t.memo || undefined,
    networkId: Networks.MAINNET,
  };

  return unsigned;
};
