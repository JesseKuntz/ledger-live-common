import { BigNumber } from "bignumber.js";
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

  const formatValue = (value: BigNumber) =>
    formatCurrencyUnit(currency.units[0], value, {
      showCode: true,
      disableRounding: true,
    });

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
      type: "text",
      label: "Fee",
      value: formatValue(estimatedFees),
    });
  }

  fields.push({
    type: "text",
    label: "Total",
    value: formatValue(totalSpent),
  });
  fields.push({
    type: "text",
    label: "Nonce",
    value: getNonce(mainAccount).toString(),
  });

  return fields;
}

export default getDeviceTransactionConfig;
