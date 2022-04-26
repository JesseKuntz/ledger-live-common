import { BigNumber } from "bignumber.js";
import { Observable } from "rxjs";
import { FeeNotLoaded } from "@ledgerhq/errors";
import type { Transaction } from "./types";
import type { Account, SignOperationEvent } from "../../types";
import { open, close } from "../../hw";
import Mina from "./hw-app-mina";
import { buildTransaction } from "./js-buildTransaction";
import { buildOptimisticOperation } from "./js-buildOptimisticOperation";
import { reEncodeRawSignature } from "./logic";

const signOperation = ({
  account,
  deviceId,
  transaction,
}: {
  account: Account;
  deviceId: any;
  transaction: Transaction;
}): Observable<SignOperationEvent> =>
  new Observable((o) => {
    async function main() {
      const transport = await open(deviceId);

      try {
        o.next({
          type: "device-signature-requested",
        });

        if (!transaction.fees) {
          throw new FeeNotLoaded();
        }

        const unsigned = await buildTransaction(account, transaction);

        const mina = new Mina(transport);
        const rawSignature = await mina.signTransaction(unsigned);
        const signature = reEncodeRawSignature(rawSignature);

        o.next({
          type: "device-signature-granted",
        });

        const operation = buildOptimisticOperation(
          account,
          transaction,
          transaction.fees ?? new BigNumber(0)
        );

        o.next({
          type: "signed",
          signedOperation: {
            operation,
            signature,
            expirationDate: null,
          },
        });
      } finally {
        close(transport, deviceId);
      }
    }

    main().then(
      () => o.complete(),
      (e) => o.error(e)
    );
  });

export default signOperation;
