import type {
  TransactionCommon,
  TransactionCommonRaw,
} from "../../types/transaction";
export type CoreStatics = Record<string, never>;
export type CoreAccountSpecifics = Record<string, never>;
export type CoreOperationSpecifics = Record<string, never>;
export type CoreCurrencySpecifics = Record<string, never>;
export type NetworkInfo = {
  family: "mina";
};
export type NetworkInfoRaw = {
  family: "mina";
};
export type Transaction = TransactionCommon & {
  family: "mina";
  mode: string;
  memo: string | null | undefined;
};
export type TransactionRaw = TransactionCommonRaw & {
  family: "mina";
};
export const reflect = (_declare: any) => {};
