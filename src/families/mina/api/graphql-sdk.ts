import { BigNumber } from "bignumber.js";
import network from "../../../network";
import { getEnv } from "../../../env";
import { Transaction } from "../types";
import { MinaGraphQLTransaction, SendPaymentArgs } from "./sdk.types";

function pendingTransactionToTransaction(
  transaction: MinaGraphQLTransaction
): Transaction {
  const { fee, amount, receiver, hash, nonce } = transaction;

  return {
    family: "mina",
    mode: "send",
    fees: new BigNumber(fee),
    amount: new BigNumber(amount),
    recipient: receiver.publicKey,
    hash,
    nonce,
  };
}

export const getTxsFromTxPool = async (): Promise<
  Partial<MinaGraphQLTransaction>[]
> => {
  const query = `
    query GetPooledCommands {
      pooledUserCommands {
        fee
      }
    }
  `;

  const { data } = await network({
    method: "POST",
    url: getEnv("API_MINA_GRAPHQL"),
    data: {
      query,
      variables: {},
      operationName: "GetPooledCommands",
    },
  });

  return data?.data?.pooledUserCommands || [];
};

export const getTxsFromTxPoolForAccount = async (
  address: string
): Promise<Transaction[]> => {
  const query = `
    query GetPooledCommands($address: PublicKey) {
      pooledUserCommands(publicKey: $address) {
        amount
        fee
        hash
        nonce
        receiver {
          publicKey
        }
      }
    }
  `;

  const { data } = await network({
    method: "POST",
    url: getEnv("API_MINA_GRAPHQL"),
    data: {
      query,
      variables: { address },
      operationName: "GetPooledCommands",
    },
  });

  let pendingTransactions = data?.data?.pooledUserCommands || [];

  if (pendingTransactions.length) {
    pendingTransactions = pendingTransactions.map((transaction) =>
      pendingTransactionToTransaction(transaction)
    );
  }

  return pendingTransactions;
};

export const sendPayment = async ({
  fee,
  amount,
  recipient,
  sender,
  signature,
}: SendPaymentArgs): Promise<string> => {
  const query = `
    mutation SendPayment($fee: UInt64!, $amount: UInt64!, $recipient: PublicKey!, $sender: PublicKey!, $signature: String) {
      sendPayment(
        input: {fee: $fee, amount: $amount, to: $recipient, from: $sender, validUntil: "4294967295"},
        signature: {rawSignature: $signature}
      ) {
        payment {
          hash
        }
      }
    }
  `;

  const { data } = await network({
    method: "POST",
    url: getEnv("API_MINA_GRAPHQL"),
    data: {
      query,
      variables: { fee, amount, recipient, sender, signature },
      operationName: "SendPayment",
    },
  });

  return data?.data?.sendPayment?.payment?.hash;
};
