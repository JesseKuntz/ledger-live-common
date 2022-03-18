import network from "../../../network";
import { getEnv } from "../../../env";
import { MinaTransaction, SendPaymentArgs } from "./sdk.types";

export const getTransactionsFromTransactionPool = async (): Promise<
  MinaTransaction[]
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
