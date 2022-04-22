import { createCustomErrorClass } from "@ledgerhq/errors";

/*
 * When a new account is the recipient.
 */
export const MinaNewAccountWarning = createCustomErrorClass(
  "MinaNewAccountWarning"
);

/*
 * When a new account is the recipient, and the amount doesn't cover the activation fee.
 */
export const MinaActivationFeeNotCovered = createCustomErrorClass(
  "MinaActivationFeeNotCovered"
);

/*
 * When the raw signature is invalid.
 */
export const MinaInvalidRawSignature = createCustomErrorClass(
  "MinaInvalidRawSignature"
);
