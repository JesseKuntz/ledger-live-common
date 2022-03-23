import { BigNumber } from "bignumber.js";
import type { Operation, SignedOperation } from "../../types";
import { patchOperationWithHash } from "../../operation";
import { AccountNeedResync } from "../../errors";
import { sendPayment } from "./api";

const broadcast = async ({
  signedOperation: { signature, operation },
}: {
  signedOperation: SignedOperation;
}): Promise<Operation> => {
  const { value, fee, senders, recipients } = operation;

  const hash = await sendPayment({
    fee: fee.toString(),
    amount: new BigNumber(value).minus(fee).toString(),
    recipient: recipients[0],
    sender: senders[0],
    signature,
  });

  // If hash is missing, something went wrong with broadcasting
  // and an account resync will update the nonce (common issue)
  if (!hash) {
    throw new AccountNeedResync();
  }

  return patchOperationWithHash(operation, hash);
};

export default broadcast;
