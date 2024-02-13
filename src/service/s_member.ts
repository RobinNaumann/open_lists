import { RecordModel } from "pocketbase";
import { PBRecord, PBRecord_KEYS, colMember, parseRecord } from "./s_pb";
import { AppModel, parseReadAppModel } from "./s_app";
import { ReadUserModel, parseRichUser } from "./s_user";
import { AuthService } from "./s_auth";

export type MembershipStatus = "requested" | "removed" | "active" | "completed";

export interface Membership extends PBRecord {
  account: string;
  app: string;
  status: MembershipStatus;
  email: string;
  device: string;
}

export interface ReadMembership extends Membership {
  expand: { app: AppModel; account: ReadUserModel };
}

export const Membership_KEYS: (keyof Membership)[] = [
  ...PBRecord_KEYS,
  "account",
  "app",
  "status",
  "email",
  "device",
];

export function parseReadMembership(m: RecordModel) {
  return parseRecord<ReadMembership>(m, Membership_KEYS, {
    expand: {
      app: (m: RecordModel) => parseReadAppModel(m),
      account: (m: RecordModel) => parseRichUser(m),
    },
  });
}

export class MemberService {
  public static i = new MemberService();
  private constructor() {}

  async delete(id: string) {
    await colMember.delete(id);
  }

  async set(id: string, changes: object) {
    id ? await colMember.update(id, changes) : await colMember.create(changes);
  }

  async getMembership(
    appId: string,
    userId: string
  ): Promise<Membership | null> {
    try {
      return (await colMember.getFirstListItem(
        `app = '${appId}' && account = '${userId}'`
      )) as Membership;
    } catch {
      this;
    }
  }

  async get(id: string): Promise<ReadMembership> {
    return parseReadMembership(
      await colMember.getOne(id, { expand: "app, app.account, account" })
    );
  }
}
