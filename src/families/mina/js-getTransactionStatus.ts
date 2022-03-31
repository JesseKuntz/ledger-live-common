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
import { formatCurrencyUnit, getCryptoCurrencyById } from "../../currencies";
import type { Transaction } from "./types";
import { FALLBACK_FEE, NEW_ACCOUNT_FEE, isValidAddress } from "./logic";
import { getAccount } from "./api";
import { MinaNewAccountWarning, MinaActivationFeeNotCovered } from "./errors";

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

  let recipientIsNewAccount;
  try {
    await getAccount(t.recipient);
  } catch (e: any) {
    if (e.name === "MinaAccountNotFound") {
      recipientIsNewAccount = true;
    }
  }

  const newAccountActivationFee = new BigNumber(NEW_ACCOUNT_FEE);
  const currency = getCryptoCurrencyById("mina");
  const formattedNewAccountActivationFee = formatCurrencyUnit(
    currency.units[0],
    newAccountActivationFee,
    {
      showCode: true,
    }
  );

  if (!t.recipient) {
    errors.recipient = new RecipientRequired();
  } else if (!isValidAddress(t.recipient)) {
    errors.recipient = new InvalidAddress();
  } else if (recipientIsNewAccount) {
    warnings.recipient = new MinaNewAccountWarning(
      `The recipient account is not activated yet. The protocol will deduct a ${formattedNewAccountActivationFee} fee to activate it.`
    );
  }

  if (a.freshAddress === t.recipient) {
    warnings.recipient = new InvalidAddressBecauseDestinationIsAlsoSource();
  }

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
  } else if (
    recipientIsNewAccount &&
    amount.lt(new BigNumber(NEW_ACCOUNT_FEE))
  ) {
    errors.amount = new MinaActivationFeeNotCovered(
      `This amount doesn't cover the ${formattedNewAccountActivationFee} activation fee.`
    );
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
