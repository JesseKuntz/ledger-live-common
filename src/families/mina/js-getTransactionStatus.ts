import { BigNumber } from "bignumber.js";
import {
  NotEnoughBalance,
  RecipientRequired,
  InvalidAddress,
  FeeNotLoaded,
  InvalidAddressBecauseDestinationIsAlsoSource,
  AmountRequired,
} from "@ledgerhq/errors";
import type { Account, TransactionStatus } from "../../types";
import type { Transaction } from "./types";

import { isValidAddress } from "./logic";
import { FALLBACK_FEE } from "./constants";

const getTransactionStatus = async (
  a: Account,
  t: Transaction
): Promise<TransactionStatus> => {
  const errors: {
    fee?: Error;
    amount?: Error;
    recipient?: Error;
  } = {};
  const warnings: {
    amount?: Error;
  } = {};
  const useAllAmount = !!t.useAllAmount;

  if (!t.fee) {
    errors.fee = new FeeNotLoaded();
  }

  const estimatedFees = t.fee || new BigNumber(FALLBACK_FEE);

  const totalSpent = useAllAmount
    ? a.spendableBalance
    : new BigNumber(t.amount).plus(estimatedFees);

  const amount = useAllAmount
    ? a.spendableBalance.minus(estimatedFees)
    : new BigNumber(t.amount);

  if (
    totalSpent.gt(a.spendableBalance) ||
    a.spendableBalance.lt(estimatedFees)
  ) {
    errors.amount = new NotEnoughBalance();
  }

  if (amount.lte(0) && !t.useAllAmount) {
    errors.amount = new AmountRequired();
  }

  if (a.freshAddress === t.recipient) {
    errors.recipient = new InvalidAddressBecauseDestinationIsAlsoSource();
  }

  if (!t.recipient) {
    errors.recipient = new RecipientRequired();
  } else if (!isValidAddress(t.recipient)) {
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

export default getTransactionStatus;
