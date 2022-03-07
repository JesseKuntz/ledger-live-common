import { BigNumber } from "bignumber.js";
import type { Account } from "../../types";

import {
  getFeesFromTransactionPool,
  getFeesFromPreviousTransactions,
} from "./api";

const REQUIRED_TRANSACTION_AMOUNT = 5;
const FALLBACK_FEE = 0.05;

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

  return totalFees.div(fees.length);
};

export default getEstimatedFees;
