import type { Operation } from "../../types";

function formatOperationSpecifics(op: Operation): string {
  const { memo, id } = op.extra;

  let str = " ";

  str += memo ? `\n    Memo: ${memo}` : "";
  str += id ? `\n    Id: ${id}` : "";

  return str;
}

export default {
  formatOperationSpecifics,
};
