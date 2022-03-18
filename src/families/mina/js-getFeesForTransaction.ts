import { BigNumber } from "bignumber.js";
import {
  getTransactionsFromTransactionPool,
  getLatestTransactions,
} from "./api";
import {
  REQUIRED_TRANSACTION_AMOUNT,
  FALLBACK_FEE,
  LOWER_BOUND_FEE,
  roundUpBigNumber,
} from "./logic";

const getEstimatedFees = async (): Promise<BigNumber> => {
  let transactions = await getTransactionsFromTransactionPool();

  if (transactions.length < REQUIRED_TRANSACTION_AMOUNT) {
    transactions = await getLatestTransactions();
  }

  transactions = transactions.filter(({ fee }) => fee);

  if (!transactions.length) {
    return new BigNumber(FALLBACK_FEE);
  }

  let totalFees = new BigNumber(0);

  transactions.forEach(({ fee: rawFee, failure_reason = null }) => {
    if (!failure_reason) {
      const fee = new BigNumber(rawFee);
      totalFees = totalFees.plus(fee);
    }
  });

  const fee = totalFees.div(transactions.length);
  const lowerBoundFee = new BigNumber(LOWER_BOUND_FEE);

  if (fee.lt(lowerBoundFee)) {
    return lowerBoundFee;
  }

  return roundUpBigNumber(fee);
};

export default getEstimatedFees;
