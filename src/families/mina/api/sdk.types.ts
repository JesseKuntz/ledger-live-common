import BigNumber from "bignumber.js";

export type MinaIndexerTransaction = {
  id: number;
  hash: string;
  type: string;
  block_hash: string;
  block_height: number;
  time: string;
  sender: string;
  receiver: string;
  amount: string;
  fee: string;
  nonce: number;
  memo: string;
  status: string;
  canonical: boolean;
  failure_reason: string;
  sequence_number: number;
  secondary_sequence_number: number;
};

export type MinaGraphQLTransaction = {
  amount: string;
  fee: string;
  hash: string;
  nonce: number;
  receiver: {
    publicKey: string;
  };
};

export type MinaOperationExtra = {
  id: number;
};

export type MinaAccount = {
  blockHeight: number;
  balance: BigNumber;
  spendableBalance: BigNumber;
  nonce: number;
};

export type SendPaymentArgs = {
  fee: string;
  amount: string;
  recipient: string;
  sender: string;
  signature: string;
};
