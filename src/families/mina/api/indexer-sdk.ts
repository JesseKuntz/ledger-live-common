import { BigNumber } from "bignumber.js";
import network from "../../../network";
import { getEnv } from "../../../env";
import { encodeOperationId } from "../../../operation";
import { Operation, OperationType } from "../../../types";
import { MinaTransaction, MinaOperationExtra, MinaAccount } from "./sdk.types";
import { MinaAccountNotFound } from "../errors";

const DEFAULT_TRANSACTIONS_LIMIT = 100;
const getIndexerUrl = (route: string): string =>
  `${getEnv("API_MINA_INDEXER")}${route || ""}`;

const fetchAccountDetails = async (address: string) => {
  const { data } = await network({
    method: "GET",
    url: getIndexerUrl(`/accounts/${address}`),
  });

  return data;
};

const fetchStatus = async () => {
  const { data } = await network({
    method: "GET",
    url: getIndexerUrl(`/status`),
  });

  return data;
};

const fetchTransactions = async (
  address?: string,
  beforeId?: number,
  transactionsLimit: number = DEFAULT_TRANSACTIONS_LIMIT
) => {
  let route = `/transactions?limit=${transactionsLimit}`;

  if (address) {
    route += `&account=${address}`;
  }

  if (beforeId) {
    route += `&before_id=${beforeId}`;
  }

  const { data } = await network({
    method: "GET",
    url: getIndexerUrl(route),
  });

  return data;
};

export const getAccount = async (address: string): Promise<MinaAccount> => {
  let accountDetails;

  try {
    accountDetails = await fetchAccountDetails(address);
  } catch (e: any) {
    if (e.status === 404) {
      throw new MinaAccountNotFound("Account not found", {
        reason: "account not activated",
      });
    }

    throw e;
  }

  const balance = new BigNumber(accountDetails.balance);
  const stakedBalance = new BigNumber(accountDetails.stake || 0);
  const spendableBalance = balance.minus(stakedBalance);
  const indexerStatus = await fetchStatus();

  return {
    blockHeight: indexerStatus.last_block_height,
    balance,
    spendableBalance,
    nonce: accountDetails.nonce,
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
  beforeId = 0
): Promise<Operation[]> => {
  const rawTransactions = await fetchTransactions(address, beforeId);

  return rawTransactions.map((transaction) =>
    transactionToOperation(accountId, address, transaction)
  );
};

export const getLatestTransactions = async (): Promise<MinaTransaction[]> => {
  const transactions = await fetchTransactions();

  return transactions;
};
