import { createCustomErrorClass } from "@ledgerhq/errors";

/**
 * When an account is not found, likely because it is not yet activated.
 */
export const MinaAccountNotFound = createCustomErrorClass(
  "MinaAccountNotFound"
);

/**
 * When a new account is the recipient.
 */
export const MinaNewAccountWarning = createCustomErrorClass(
  "MinaNewAccountWarning"
);

/**
 * When a new account is the recipient, and the amount doesn't cover the activation fee.
 */
export const MinaActivationFeeNotCovered = createCustomErrorClass(
  "MinaActivationFeeNotCovered"
);
