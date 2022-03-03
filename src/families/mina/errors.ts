import { createCustomErrorClass } from "@ledgerhq/errors";

/**
 * Mina error thrown when an account is not found, likely because it is not yet activated.
 */
export const MinaAccountNotFound = createCustomErrorClass(
  "MinaAccountNotFound"
);
