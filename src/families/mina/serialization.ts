import type { MinaResourcesRaw, MinaResources } from "./types";

export function toMinaResourcesRaw(r: MinaResources): MinaResourcesRaw {
  const { nonce } = r;
  return {
    nonce,
  };
}

export function fromMinaResourcesRaw(r: MinaResourcesRaw): MinaResources {
  const { nonce } = r;
  return {
    nonce,
  };
}
