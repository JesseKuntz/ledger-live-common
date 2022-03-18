import BigNumber from "bignumber.js";
import type {
  TransactionCommon,
  TransactionCommonRaw,
} from "../../types/transaction";
export type CoreStatics = Record<string, never>;
export type CoreAccountSpecifics = Record<string, never>;
export type CoreOperationSpecifics = Record<string, never>;
export type CoreCurrencySpecifics = Record<string, never>;
export type MinaResources = {
  nonce: number;
};
export type MinaResourcesRaw = {
  nonce: number;
};
export type Transaction = TransactionCommon & {
  family: "mina";
  mode: string;
  memo: string | null;
  fees: BigNumber | null;
};
export type TransactionRaw = TransactionCommonRaw & {
  family: "mina";
  mode: string;
  memo: string | null;
  fees: string | null;
};
export const reflect = (_declare: any) => {};
