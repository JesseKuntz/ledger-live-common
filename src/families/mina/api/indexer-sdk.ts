import { BigNumber } from "bignumber.js";
import network from "../../../network";
import { getEnv } from "../../../env";
import { encodeOperationId } from "../../../operation";
import { Operation, OperationType } from "../../../types";
import {
  MinaTransaction,
  MinaOperationExtra,
  MinaAccount,
} from "./indexer-sdk.types";

const DEFAULT_TRANSACTIONS_LIMIT = 100;
const getUrl = (route: string): string =>
  `${getEnv("API_MINA_INDEXER")}${route || ""}`;

const fetchAccountDetails = async (address: string) => {
  const { data } = await network({
    method: "GET",
    url: getUrl(`/accounts/${address}`),
  });

  return data;
};

const fetchStatus = async () => {
  const { data } = await network({
    method: "GET",
    url: getUrl(`/status`),
  });

  return data;
};

export const getAccount = async (address: string): Promise<MinaAccount> => {
  const accountDetails = await fetchAccountDetails(address);
  const balance = new BigNumber(accountDetails.balance);
  const stakedBalance = new BigNumber(accountDetails.stake);
  const spendableBalance = balance.minus(stakedBalance);
  const indexerStatus = await fetchStatus();

  return {
    blockHeight: indexerStatus.last_block_height,
    balance,
    spendableBalance,
  };
};

function isSender(transaction: MinaTransaction, address: string): boolean {
  return transaction.sender === address;
}

function getOperationType(
  transaction: MinaTransaction,
  address: string
): OperationType {
  return isSender(transaction, address) ? "OUT" : "IN";
}

function getOperationValue(
  transaction: MinaTransaction,
  address: string
): BigNumber {
  return isSender(transaction, address)
    ? new BigNumber(transaction.amount).plus(transaction.fee)
    : new BigNumber(transaction.amount);
}

function getOperationExtra(transaction: MinaTransaction): MinaOperationExtra {
  return {
    memo: transaction.memo,
    id: transaction.id,
  };
}

function transactionToOperation(
  accountId: string,
  address: string,
  transaction: MinaTransaction
): Operation {
  const type = getOperationType(transaction, address);

  return {
    id: encodeOperationId(accountId, transaction.hash, type),
    accountId,
    fee: new BigNumber(transaction.fee || 0),
    value: getOperationValue(transaction, address),
    type,
    hash: transaction.hash,
    blockHash: transaction.block_hash,
    blockHeight: transaction.block_height,
    date: new Date(transaction.time),
    extra: getOperationExtra(transaction),
    senders: transaction.sender ? [transaction.sender] : [],
    recipients: transaction.receiver ? [transaction.receiver] : [],
    transactionSequenceNumber: isSender(transaction, address)
      ? transaction.nonce || transaction.sequence_number
      : undefined,
    hasFailed: !!transaction.failure_reason,
  };
}

export const getOperations = async (
  accountId: string,
  address: string,
  beforeId = 0,
  transactionsLimit: number = DEFAULT_TRANSACTIONS_LIMIT
): Promise<Operation[]> => {
  let route = `/transactions?account=${address}&limit=${transactionsLimit}`;

  if (beforeId) {
    route += `&before_id=${beforeId}`;
  }

  const { data: rawTransactions } = await network({
    method: "GET",
    url: getUrl(route),
  });

  return rawTransactions.map((transaction) =>
    transactionToOperation(accountId, address, transaction)
  );
};
