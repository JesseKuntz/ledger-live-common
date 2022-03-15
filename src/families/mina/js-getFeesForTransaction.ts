import { BigNumber } from "bignumber.js";
import type { Account } from "../../types";
import {
  getFeesFromTransactionPool,
  getFeesFromPreviousTransactions,
} from "./api";
import {
  REQUIRED_TRANSACTION_AMOUNT,
  FALLBACK_FEE,
  LOWER_BOUND_FEE,
} from "./logic";

const getEstimatedFees = async (a: Account): Promise<BigNumber> => {
  let fees = await getFeesFromTransactionPool();

  if (fees.length < REQUIRED_TRANSACTION_AMOUNT) {
    fees = await getFeesFromPreviousTransactions(a.freshAddress);
  }

  if (!fees.length) {
    return new BigNumber(FALLBACK_FEE);
  }

  let totalFees = new BigNumber(0);

  fees.forEach(({ fee: rawFee, failure_reason = null }) => {
    if (!failure_reason) {
      const fee = new BigNumber(rawFee);
      totalFees = totalFees.plus(fee);
    }
  });

  const fee = totalFees.div(fees.length).integerValue();
  const lowerBoundFee = new BigNumber(LOWER_BOUND_FEE);

  if (fee.lt(lowerBoundFee)) {
    return lowerBoundFee;
  }

  return fee;
};

export default getEstimatedFees;
