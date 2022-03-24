import type { AccountLike, Account, TransactionStatus } from "../../types";
import type { Transaction } from "./types";
import { getNonce } from "./logic";
import { getMainAccount } from "../../account";
import { formatCurrencyUnit, getCryptoCurrencyById } from "../../currencies";
import type { DeviceTransactionField } from "../../transaction";

function getDeviceTransactionConfig({
  account,
  parentAccount,
  status: { estimatedFees, totalSpent },
}: {
  account: AccountLike;
  parentAccount?: Account;
  transaction: Transaction;
  status: TransactionStatus;
}): Array<DeviceTransactionField> {
  const mainAccount = getMainAccount(account, parentAccount);
  const currency = getCryptoCurrencyById("mina");
  const fields: Array<DeviceTransactionField> = [];

  fields.push({
    type: "text",
    label: "Type",
    value: "Payment",
  });
  fields.push({
    type: "amount",
    label: "Amount",
  });

  if (!estimatedFees.isZero()) {
    fields.push({
      type: "fees",
      label: "Fee",
    });
  }

  fields.push({
    type: "text",
    label: "Total",
    value: formatCurrencyUnit(currency.units[0], totalSpent, {
      showCode: true,
    }),
  });
  fields.push({
    type: "text",
    label: "Nonce",
    value: getNonce(mainAccount).toString(),
  });

  return fields;
}

export default getDeviceTransactionConfig;
