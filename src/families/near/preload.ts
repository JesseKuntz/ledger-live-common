import { BigNumber } from "bignumber.js";
import { Observable, Subject } from "rxjs";
import { log } from "@ledgerhq/logs";
import type { NearPreloadedData } from "./types";
import { getStorageCost } from "./api";
import { FALLBACK_STORAGE_AMOUNT_PER_BYTE } from "./logic";

const PRELOAD_MAX_AGE = 30 * 60 * 1000;

let currentPreloadedData: NearPreloadedData = {
  storageCost: new BigNumber(FALLBACK_STORAGE_AMOUNT_PER_BYTE),
};

function fromHydratePreloadData(data: any): NearPreloadedData {
  let storageCost = new BigNumber(FALLBACK_STORAGE_AMOUNT_PER_BYTE);

  if (typeof data === "object" && data) {
    if (typeof data.storageCost === "string" && data.storageCost) {
      storageCost = new BigNumber(data.storageCost);
    }
  }

  return {
    storageCost,
  };
}

const updates = new Subject<NearPreloadedData>();

export function getCurrentNearPreloadData(): NearPreloadedData {
  return currentPreloadedData;
}

export function setNearPreloadData(data: NearPreloadedData): void {
  if (data === currentPreloadedData) return;

  currentPreloadedData = data;

  updates.next(data);
}

export function getNearPreloadDataUpdates(): Observable<NearPreloadedData> {
  return updates.asObservable();
}

export const getPreloadStrategy = () => ({
  preloadMaxAge: PRELOAD_MAX_AGE,
});

export const preload = async (): Promise<NearPreloadedData> => {
  log("near/preload", "preloading near data...");

  const storageCost = await getStorageCost();

  return { storageCost };
};

export const hydrate = (data: any): void => {
  const hydrated = fromHydratePreloadData(data);

  log("near/preload", `hydrated storageCost with ${hydrated.storageCost}`);

  setNearPreloadData(hydrated);
};
