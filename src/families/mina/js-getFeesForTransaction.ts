import { BigNumber } from "bignumber.js";
import { getTxsFromTxPool, getLatestTransactions } from "./api";
import {
  REQUIRED_TRANSACTION_AMOUNT,
  FALLBACK_FEE,
  LOWER_BOUND_FEE,
  roundUpBigNumber,
} from "./logic";

const getEstimatedFees = async (): Promise<BigNumber> => {
  const poolTransactions = await getTxsFromTxPool();
  let transactions;

  if (poolTransactions.length < REQUIRED_TRANSACTION_AMOUNT) {
    transactions = await getLatestTransactions();
  } else {
    transactions = poolTransactions;
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
