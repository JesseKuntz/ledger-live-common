import type { DatasetTest } from "../../types";
import type { Transaction } from "./types";

const ADDR = "B62qjGaF4bw7jJ841PApxgRGE7szhJVbwP5sGLGAwS1Co9bCsyAdF3U";

const dataset: DatasetTest<Transaction> = {
  implementations: ["js"],
  currencies: {
    mina: {
      scanAccounts: [
        {
          name: "mina seed 1",
          apdus: `
          => e00200000400000000
          <= 423632716a476146346277376a4a383431504170786752474537737a684a566277503573474c4741775331436f39624373794164463355009000
          => e00200000400000000
          <= 423632716a476146346277376a4a383431504170786752474537737a684a566277503573474c4741775331436f39624373794164463355009000
          `,
        },
      ],
      accounts: [
        {
          raw: {
            id: `js:2:mycoin:${ADDR}:`,
            seedIdentifier: ADDR,
            name: "Mina 1",
            derivationMode: "",
            index: 0,
            freshAddress: ADDR,
            freshAddressPath: "44'/12586'/0'/0/0'",
            freshAddresses: [],
            blockHeight: 0,
            operations: [],
            pendingOperations: [],
            currencyId: "mina",
            unitMagnitude: 9,
            lastSyncDate: "",
            balance: "6500000000",
          },
          transactions: [
            // HERE WE WILL INSERT OUR test
          ],
        },
      ],
    },
  },
};

export default dataset;
