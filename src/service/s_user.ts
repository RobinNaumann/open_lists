import { RecordModel } from "pocketbase";
import { PBRecord, PBRecord_KEYS, colUsers, parseRecord } from "./s_pb";
import { Membership, ReadMembership, parseReadMembership } from "./s_member";

interface SparklesModel extends PBRecord {
  count: number;
}

const SparklesModel_KEYS: (keyof SparklesModel)[] = [...PBRecord_KEYS, "count"];

function parseSparkles(record: RecordModel): SparklesModel {
  return parseRecord<SparklesModel>(record, SparklesModel_KEYS, {});
}

export interface UserModel extends PBRecord {
  name: string;
  email?: string;
  avatar?: string;
  description: string;
  homepage: string;
  expand: { sparkles: SparklesModel };
}

export interface ReadUserModel extends UserModel {
  expand: { sparkles: SparklesModel; memberships: ReadMembership[] };
}

export const UserModel_KEYS: (keyof UserModel)[] = [
  ...PBRecord_KEYS,
  "name",
  "email",
  "avatar",
  "description",
  "homepage",
];

export function parseUser(record: RecordModel): ReadUserModel {
  return parseRecord<ReadUserModel>(record, UserModel_KEYS, {
    images: ["avatar"],
    expand: {
      ["peertest_sparkles(id_link):sparkles"]: (m: RecordModel[]) => {
        return parseSparkles(m[0]);
      },
      ["peertest_membership(account):memberships"]: (m: RecordModel[]) => {
        return m.map(parseReadMembership);
      },
    },
  });
}

export function parseRichUser(record: RecordModel): ReadUserModel {
  return parseRecord<ReadUserModel>(record, UserModel_KEYS, {
    images: ["avatar"],
    expand: {
      ["peertest_sparkles(id_link):sparkles"]: (m: RecordModel[]) =>
        parseSparkles(m[0]),
      ["peertest_membership(account):memberships"]: (m: RecordModel[]) =>
        m.map(parseReadMembership),
    },
  });
}

export class UserService {
  public static i = new UserService();
  private constructor() {}

  async delete(id: string) {
    await colUsers.delete(id);
  }
  async set(id: string, changes: object) {
    await colUsers.update(id, changes);
  }
  async get(id: string): Promise<ReadUserModel> {
    return parseUser(
      await colUsers.getOne(id, {
        expand:
          "peertest_sparkles(id_link), peertest_membership(account).app.account.sparkles, peertest_membership(account).app.account.peertest_sparkles(id_link)",
      })
    );
  }

  async observe(
    id: string,
    data: (d?: ReadUserModel) => void,
    error: (e: any) => void
  ): Promise<void> {
    try {
      await colUsers.subscribe("*", async (_) => {
        data(await this.get(id));
      });
      data(await this.get(id));
    } catch (e) {
      error(e);
    }
  }
}
