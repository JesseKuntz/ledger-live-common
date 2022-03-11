import type { Account, Operation } from "../../types";

function formatAccountSpecifics(account: Account): string {
  const { minaResources } = account;
  if (!minaResources) {
    throw new Error("mina account expected");
  }

  let str = " ";

  str += minaResources.nonce ? `\n    Nonce: ${minaResources.nonce}` : "";

  return str;
}

function formatOperationSpecifics(op: Operation): string {
  const { memo, id } = op.extra;

  let str = " ";

  str += memo ? `\n    Memo: ${memo}` : "";
  str += id ? `\n    Id: ${id}` : "";

  return str;
}

export default {
  formatAccountSpecifics,
  formatOperationSpecifics,
};
