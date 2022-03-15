import type { Account, Operation } from "../../types";

export const REQUIRED_TRANSACTION_AMOUNT = 5;
export const FALLBACK_FEE = 50000000;
export const LOWER_BOUND_FEE = 1000000;

export const isValidAddress = (address: string): boolean => {
  const regex = new RegExp("^B62q[i-s][A-HJ-NP-Za-km-z1-9]{50}$");

  return regex.test(address);
};

/**
 * Example: For derivation path "44'/12586'/1'/0/0", return 1.
 */
export const getAccountNumberFromDerivationPath = (path: string): number => {
  const accountSection = path.split("/")[2];
  const accountNumber = accountSection.split("'")[0];

  return Number(accountNumber);
};

/**
 * Get the final ID from a list of operations.
 */
export const getLastId = (operations: Array<Operation>): number => {
  if (operations.length) {
    operations[operations.length - 1].extra.id;
  }

  return 0;
};

export const getNonce = (a: Account): number => {
  const lastPendingOp = a.pendingOperations[0];
  const nonce = Math.max(
    a.minaResources?.nonce || 0,
    lastPendingOp && typeof lastPendingOp.transactionSequenceNumber === "number"
      ? lastPendingOp.transactionSequenceNumber + 1
      : 0
  );

  return nonce;
};
