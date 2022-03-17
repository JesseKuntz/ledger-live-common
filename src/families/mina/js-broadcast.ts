import { BigNumber } from "bignumber.js";
import type { Operation, SignedOperation } from "../../types";
import { patchOperationWithHash } from "../../operation";

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

  return patchOperationWithHash(operation, hash);
};

export default broadcast;
