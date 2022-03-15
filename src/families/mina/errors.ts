import { createCustomErrorClass } from "@ledgerhq/errors";

/**
 * When an account is not found, likely because it is not yet activated.
 */
export const MinaAccountNotFound = createCustomErrorClass(
  "MinaAccountNotFound"
);
