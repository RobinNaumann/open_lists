import PocketBase, { RecordModel } from "pocketbase";
import { log } from "../util";

export const pb = new PocketBase("https://pocket.robbb.in");
export const colUsers = pb.collection("users");
export const colApp = pb.collection("peertest_app");
export const colAppMeta = pb.collection("peertest_app_meta");
export const colMember = pb.collection("peertest_membership");
export const colProfile = pb.collection("peertest_profile");

export interface PBRecord {
  id: string;
  created: number;
  updated: number;
  expand?: any;
}

export const Auto_KEYS: (keyof PBRecord)[] = ["created", "updated", "expand"];
export const PBRecord_KEYS: (keyof PBRecord)[] = [...Auto_KEYS, "id"];

type RecordMapper = Partial<
  Record<string, (m: RecordModel | RecordModel[]) => PBRecord | PBRecord[]>
>;

export function parseRecord<T extends PBRecord>(
  record: RecordModel,
  keys: (keyof T)[],
  { images, expand }: { images?: (keyof T)[]; expand?: RecordMapper }
): T {
  log.debug("BIT: parsing: ", record);

  const data: Partial<T> = {
    created: new Date(record.created).getTime(),
    updated: new Date(record.updated).getTime(),
    expand: {},
  } as any;

  // parse image
  for (const key of images || []) {
    const v = record[key as string];
    if (v) data[key as string] = pb.files.getUrl(record, v);
  }

  // add other keys
  for (const key of keys) {
    if (key in data) continue;
    data[key as string] = record[key as string];
  }

  // parse expand
  if (record.expand) {
    for (const key_combine in expand) {
      const [key, mapped] = key_combine.split(":");

      if (!(key in record.expand)) continue;
      data.expand[mapped || key] = expand[key_combine](record.expand[key]);
    }
  }

  return data as T;
}
