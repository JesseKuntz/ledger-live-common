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
import { FALLBACK_FEE, isValidAddress } from "./logic";

const getTransactionStatus = async (
  a: Account,
  t: Transaction
): Promise<TransactionStatus> => {
  const errors: {
    fees?: Error;
    amount?: Error;
    recipient?: Error;
  } = {};
  const warnings: {
    recipient?: Error;
  } = {};
  const useAllAmount = !!t.useAllAmount;

  if (!t.fees) {
    errors.fees = new FeeNotLoaded();
  }

  const estimatedFees = t.fees || new BigNumber(FALLBACK_FEE);

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
  } else if (amount.lte(0) && !t.useAllAmount) {
    errors.amount = new AmountRequired();
  }

  if (a.freshAddress === t.recipient) {
    warnings.recipient = new InvalidAddressBecauseDestinationIsAlsoSource();
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
