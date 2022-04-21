import { BigNumber } from "bignumber.js";
import { encodeAccountId } from "../../account";
import type { GetAccountShape } from "../../bridge/jsHelpers";
import { makeSync, makeScanAccounts, mergeOps } from "../../bridge/jsHelpers";

import { getAccount, getOperations } from "./api";
import { getLastId } from "./logic";

const getAccountShape: GetAccountShape = async (info) => {
  const { address, initialAccount, currency, derivationMode } = info;
  const oldOperations = initialAccount?.operations || [];

  const accountId = encodeAccountId({
    type: "js",
    version: "2",
    currencyId: currency.id,
    xpubOrAddress: address,
    derivationMode,
  });

  const { blockHeight, balance, spendableBalance, nonce } = await getAccount(
    address
  );

  let operations = oldOperations;
  let newOperations = await getOperations(accountId, address);
  operations = mergeOps(operations, newOperations);
  let beforeId = getLastId(newOperations);
  const targetId = operations.length ? operations[0].extra.id : 0;

  // If there is a gap, get all operations (up to certain amount) between the last sync and now
  if (operations.length && beforeId > targetId) {
    let maxIteration = 20;

    do {
      newOperations = await getOperations(accountId, address, beforeId);
      operations = mergeOps(operations, newOperations);
      beforeId = getLastId(newOperations);
    } while (--maxIteration && newOperations.length && beforeId > targetId);
  }

  const shape = {
    id: accountId,
    balance,
    spendableBalance,
    operationsCount: operations.length,
    blockHeight,
    minaResources: {
      nonce,
    },
  };

  return { ...shape, operations };
};

const postSync = (_, synced) => {
  let pendingOperations = synced.pendingOperations;

  if (pendingOperations.length) {
    pendingOperations = synced.pendingOperations.filter(
      (pendingOperation) =>
        !synced.operations.some(
          (operation) => operation.hash === pendingOperation.hash
        )
    );
  }

  const pendingAmount = pendingOperations.reduce((acc, op) => {
    return acc.plus(op.value);
  }, new BigNumber(0));

  return {
    ...synced,
    pendingOperations,
    spendableBalance: synced.spendableBalance.minus(pendingAmount),
  };
};

export const scanAccounts = makeScanAccounts({ getAccountShape });

export const sync = makeSync({ getAccountShape, postSync });
