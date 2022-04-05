import { BigNumber } from "bignumber.js";
import type { Account, Operation } from "../../types";
import { AccountNeedResync } from "../../errors";
import { MinaInvalidRawSignature } from "./errors";

export const REQUIRED_TRANSACTION_AMOUNT = 10;
export const FALLBACK_FEE = 50000000;
export const LOWER_BOUND_FEE = 1000000;
export const NEW_ACCOUNT_FEE = 1000000000;

/*
 * Validate a Mina address.
 */
export const isValidAddress = (address: string): boolean => {
  const regex = new RegExp("^B62q[i-s][A-HJ-NP-Za-km-z1-9]{50}$");

  return regex.test(address);
};

/*
 * Example: For derivation path "44'/12586'/1'/0/0", return 1.
 */
export const getAccountNumberFromDerivationPath = (path: string): number => {
  const accountSection = path.split("/")[2];
  const accountNumber = accountSection.split("'")[0];

  return Number(accountNumber);
};

export const getLastId = (operations: Array<Operation>): number => {
  if (operations.length) {
    operations[operations.length - 1].extra.id;
  }

  return 0;
};

export const getNonce = (a: Account): number => {
  if (a.minaResources?.nonce) {
    return a.minaResources.nonce + a.pendingOperations.length;
  }

  throw new AccountNeedResync();
};

export const roundUpBigNumber = (bigNumber: BigNumber): BigNumber => {
  const number = bigNumber.toNumber();
  const roundedNumber = Math.ceil(number);

  return new BigNumber(roundedNumber);
};

/*
 * Re-encode the signature such that it can be broadcast via GraphQL > 1.3.0alpha3
 * Influenced by: https://github.com/jspada/ledger-app-mina/pull/22
 */
export const reEncodeRawSignature = (rawSignature: string): string => {
  function shuffleBytes(hex) {
    const bytes = hex.match(/.{2}/g);
    bytes.reverse();
    return bytes.join("");
  }

  if (rawSignature.length !== 128) {
    throw new MinaInvalidRawSignature();
  }

  const field = rawSignature.substring(0, 64);
  const scalar = rawSignature.substring(64);
  return shuffleBytes(field) + shuffleBytes(scalar);
};
