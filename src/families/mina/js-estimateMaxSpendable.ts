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

  return a.spendableBalance.minus(fees);
};

export default estimateMaxSpendable;
