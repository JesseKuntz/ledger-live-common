import type { BigNumber } from "bignumber.js";
import type {
  TransactionCommon,
  TransactionCommonRaw,
} from "../../types/transaction";

export type Transaction = TransactionCommon & {
  family: "near";
  mode: string;
  fees?: BigNumber;
};

export type TransactionRaw = TransactionCommonRaw & {
  family: "near";
  mode: string;
  fees?: string;
};

export type NearPreloadedData = {
  storageCost: BigNumber;
};
