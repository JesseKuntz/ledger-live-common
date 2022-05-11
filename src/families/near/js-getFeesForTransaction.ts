import { BigNumber } from "bignumber.js";

// TODO: fetch fees from API
const getEstimatedFees = async (): Promise<BigNumber> => {
  const fees = new BigNumber(100000000000000000000);

  return fees;
};

export default getEstimatedFees;
