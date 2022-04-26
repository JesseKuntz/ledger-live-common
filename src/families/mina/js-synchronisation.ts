import { BigNumber } from "bignumber.js";
import { encodeAccountId } from "../../account";
import type { GetAccountShape } from "../../bridge/jsHelpers";
import { makeSync, makeScanAccounts, mergeOps } from "../../bridge/jsHelpers";

import { getAccount, getOperations, getTxsFromTxPoolForAccount } from "./api";
import { getLastId, removeExistingOperations } from "./logic";
import { buildOptimisticOperation } from "./js-buildOptimisticOperation";

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

  const [
    { blockHeight, balance, spendableBalance, nonce },
    fetchedOperations,
    pendingTransactions,
  ] = await Promise.all([
    getAccount(address),
    getOperations(accountId, address),
    getTxsFromTxPoolForAccount(address),
  ]);

  let operations = oldOperations;
  let newOperations = fetchedOperations;
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

  return {
    id: accountId,
    balance,
    spendableBalance,
    operationsCount: operations.length,
    blockHeight,
    operations,
    minaResources: {
      nonce,
      pendingTransactions,
    },
  };
};

const postSync = (_, synced) => {
  let pendingOperations = synced.pendingOperations || [];

  // If there are pending transactions in the pool, merge them with the pending operations
  if (synced && synced.minaResources.pendingTransactions.length) {
    let pendingOperationsFromPool =
      synced.minaResources.pendingTransactions.map((transaction) => {
        return buildOptimisticOperation(
          synced,
          transaction,
          transaction.fees ?? new BigNumber(0)
        );
      });

    pendingOperationsFromPool = removeExistingOperations(
      pendingOperationsFromPool,
      pendingOperations
    );

    pendingOperations = [
      ...pendingOperations,
      ...pendingOperationsFromPool,
    ].sort((a, b) => {
      if (b.transactionSequenceNumber && a.transactionSequenceNumber) {
        return b.transactionSequenceNumber - a.transactionSequenceNumber;
      }

      return a.date.getTime() - b.date.getTime();
    });
  }

  if (pendingOperations.length) {
    pendingOperations = removeExistingOperations(
      pendingOperations,
      synced.operations
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
