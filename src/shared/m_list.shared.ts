import { appConfig } from "./info.shared";

type UnixMs = number;

export type ListModel = {
  setAt: UnixMs;
  about: string;
  items: ItemModel[];
};

export type ItemModel = {
  setAt: UnixMs;
  content: string;
  state: "open" | "done" | "deleted";
};

export function isValidList(data: any): data is ListModel {
  if (typeof data.setAt !== "number") return false;
  if (typeof data.about !== "string") return false;
  if (!Array.isArray(data.items)) return false;
  for (const item of data.items) {
    if (!isValidItem(item)) return false;
  }
  return true;
}

export function isValidItem(data: any): data is ItemModel {
  if (typeof data.setAt !== "number") return false;
  if (typeof data.content !== "string") return false;
  if (
    data.state !== "open" &&
    data.state !== "done" &&
    data.state !== "deleted"
  ) {
    return false;
  }
  return true;
}

function _asValidState(state: any): "open" | "done" | "deleted" {
  if (state === "open" || state === "done" || state === "deleted") {
    return state;
  }
  return "open";
}

function _limitedString(str: any): string {
  if (typeof str !== "string") return "";
  return str.slice(0, appConfig.constraints.maxStringLength);
}

function _dateOrNow(d: any): number {
  const n = Date.now();
  if (typeof d !== "number") return n;
  if (d < n - 1000 * 60 * 60 * 24 * 365) return n; // not older than 1 year
  if (d > n + 1000 * 60 * 60 * 24) return n; // not in the future (more than 1 day)
  return d;
}

export function sanitizedItem(item: ItemModel): ItemModel {
  return {
    setAt: _dateOrNow(item.setAt),
    content: _limitedString(item.content),
    state: _asValidState(item.state),
  };
}

export function sanitizedList(list: ListModel): ListModel {
  return {
    setAt: _dateOrNow(list.setAt),
    about: _limitedString(list.about),
    items: list.items
      .map(sanitizedItem)
      .slice(0, appConfig.constraints.maxListItems),
  };
}
