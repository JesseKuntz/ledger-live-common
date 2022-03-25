import type { DeviceAction } from "../../bot/types";
import type { Transaction } from "./types";
import { deviceActionFlow } from "../../bot/specs";

const acceptTransaction: DeviceAction<Transaction, any> = deviceActionFlow({
  steps: [
    {
      title: "Get Address",
      button: "Rr",
    },
    {
      title: "Path",
      button: "Rr",
    },
    {
      title: "Generate",
      button: "LRlr",
    },
  ],
});

export default {
  acceptTransaction,
};
