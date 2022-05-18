export type NearAccount = {
  amount: string;
  storage_usage: number;
  block_height: number;
};

export type NearTransaction = {
  sender: string;
  receiver: string;
  hash: string;
  fee: string;
  success: boolean;
  height: number;
  block_hash: string;
  time: string;
  actions: [
    {
      data: {
        deposit: string;
      };
    }
  ];
};

export type NearProtocolConfig = {
  result: {
    runtime_config: {
      storage_amount_per_byte: string;
    };
  };
};

export type NearAccessKey = {
  nonce: number;
  block_hash: string;
};
