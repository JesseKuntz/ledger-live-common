import { BigNumber } from "bignumber.js";

import type { AccountLike, Account } from "../../types";
import { getMainAccount } from "../../account";

import getEstimatedFees from "./js-getFeesForTransaction";

const estimateMaxSpendable = async ({
  account,
  parentAccount,
  calculatedFees,
}: {
  account: AccountLike;
  parentAccount?: Account;
  calculatedFees?: BigNumber;
}): Promise<BigNumber> => {
  const a = getMainAccount(account, parentAccount);

  const fees = calculatedFees ?? (await getEstimatedFees());

  const maxSpendable = a.spendableBalance.minus(fees);

  if (maxSpendable.lt(0)) {
    return new BigNumber(0);
  }

  return maxSpendable;
};

export default estimateMaxSpendable;
