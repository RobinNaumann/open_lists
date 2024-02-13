import { RecordListOptions, RecordModel } from "pocketbase";
import {
  PBRecord,
  PBRecord_KEYS,
  colApp,
  colAppMeta,
  colMember,
  parseRecord,
} from "./s_pb";
import { ReadUserModel, parseRichUser } from "./s_user";
import { ReadMembership, parseReadMembership } from "./s_member";

export interface AppMetaModel {
  id: string;
  tester_count: number;
}

export interface AppModel extends PBRecord {
  account: string;
  name: string;
  description: string;
  icon: string;
  status: "draft" | "active" | "archived";
  email_feedback: string;
  url_download: string;
}

export const AppModel_KEYS: (keyof AppModel)[] = [
  ...PBRecord_KEYS,
  "account",
  "name",
  "description",
  "icon",
  "status",
  "email_feedback",
  "url_download",
];

export interface ReadAppModel extends AppModel {
  expand: { account: ReadUserModel; memberships: ReadMembership[] };
}

export function parseReadAppModel(m: RecordModel) {
  return parseRecord<ReadAppModel>(m, AppModel_KEYS, {
    images: ["icon"],
    expand: {
      account: (m: RecordModel) => parseRichUser(m),
      ["peertest_membership(app):memberships"]: (ms: RecordModel[]) =>
        ms.map(parseReadMembership),
    },
  });
}

export class AppService {
  public static i = new AppService();
  private constructor() {}

  async delete(id: string) {
    await colApp.delete(id);
  }

  async set(id: string, changes: object) {
    id ? await colApp.update(id, changes) : await colApp.create(changes);
  }

  async get(id: string): Promise<ReadAppModel> {
    return parseReadAppModel(
      await colApp.getOne(id, {
        expand:
          "account.peertest_sparkles(id_link), peertest_membership(app).account",
      })
    );
  }

  async getMeta(id: string): Promise<AppMetaModel> {
    const rec = await colAppMeta.getOne(id);
    return { id: id, tester_count: rec["tester_count"] };
  }

  x: RecordListOptions;

  async list({
    filter,
    sort,
  }: {
    filter?: string | null;
    sort?: string | null;
  }): Promise<ReadAppModel[]> {
    const res = await colApp.getList(1, 100, {
      expand:
        "account.peertest_sparkles(id_link), peertest_membership(app).account",
      filter: filter || "",
      sort: sort || "-created",
    });
    return res.items.map((item) => parseReadAppModel(item));
  }

  async archive(appId: string) {
    this.set(appId, { status: "archived" });
  }

  async finishTesting(appId: string): Promise<void> {
    const testers = await colMember.getList(1, 100, {
      filter: `app = '${appId}' && status = 'active'`,
    });

    for (const tester of testers.items) {
      await colMember.update(tester.id, { status: "completed" });
    }

    await this.archive(appId);
  }
}
