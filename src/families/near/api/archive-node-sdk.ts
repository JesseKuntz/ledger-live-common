import { BigNumber } from "bignumber.js";
import network from "../../../network";
import { getEnv } from "../../../env";
import { FALLBACK_STORAGE_AMOUNT_PER_BYTE } from "../logic";
import { NearAccessKey, NearProtocolConfig } from "./sdk.types";

const fetchProtocolConfig = async (): Promise<NearProtocolConfig> => {
  const { data } = await network({
    method: "POST",
    url: getEnv("API_NEAR_ARCHIVE_NODE"),
    data: {
      jsonrpc: "2.0",
      id: "id",
      method: "EXPERIMENTAL_protocol_config",
      params: {
        finality: "final",
      },
    },
  });

  return data;
};

export const getStorageCost = async (): Promise<BigNumber> => {
  const protocolConfig = await fetchProtocolConfig();

  return new BigNumber(
    protocolConfig?.result?.runtime_config?.storage_amount_per_byte ||
      FALLBACK_STORAGE_AMOUNT_PER_BYTE
  );
};

export const getAccessKey = async ({
  address,
  publicKey,
}: {
  address: string;
  publicKey: string;
}): Promise<NearAccessKey> => {
  const { data } = await network({
    method: "POST",
    url: getEnv("API_NEAR_ARCHIVE_NODE"),
    data: {
      jsonrpc: "2.0",
      id: "id",
      method: "query",
      params: {
        request_type: "view_access_key",
        finality: "final",
        account_id: address,
        public_key: publicKey,
      },
    },
  });

  return data.result || {};
};

export const broadcastTransaction = async (
  transaction: string
): Promise<string> => {
  const { data } = await network({
    method: "POST",
    url: getEnv("API_NEAR_ARCHIVE_NODE"),
    data: {
      jsonrpc: "2.0",
      id: "id",
      method: "broadcast_tx_async",
      params: [transaction],
    },
  });

  return data.result;
};
