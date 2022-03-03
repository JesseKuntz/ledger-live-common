import { BigNumber } from "bignumber.js";

import { getFees } from "./api";

const getEstimatedFees = async (): Promise<BigNumber> => {
  return getFees();
};

export default getEstimatedFees;
