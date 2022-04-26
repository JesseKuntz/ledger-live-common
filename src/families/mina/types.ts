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
  pendingTransactions: Transaction[];
};
export type MinaResourcesRaw = {
  nonce: number;
  pendingTransactions: TransactionRaw[];
};
export type Transaction = TransactionCommon & {
  family: "mina";
  mode: string;
  fees: BigNumber;
  hash?: string;
  nonce?: number;
};
export type TransactionRaw = TransactionCommonRaw & {
  family: "mina";
  mode: string;
  fees: string;
  hash?: string;
  nonce?: number;
};
export const reflect = (_declare: any) => {};
