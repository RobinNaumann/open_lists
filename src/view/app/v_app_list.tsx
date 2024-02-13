import { LucideImage } from "lucide-react";
import { SBit } from "../../bit/sbit";
import { AppModel, AppService, ReadAppModel } from "../../service/s_app";
import { AuthBit } from "../../signal/b_auth";
import { go, showDate } from "../../util";
import { UserChip } from "../account/v_account_chip";

export function AppListOfUser({ id }: { id: string }) {
  const f = async () => AppService.i.list({ filter: `account = '${id}'` });

  return _AppList(f);
}

export function AppList(m: { sort: string }) {
  const f = async () =>
    AppService.i.list({ sort: m.sort, filter: "status != 'archived'" });

  return _AppList(f);
}

function _AppList(f: () => Promise<ReadAppModel[]>) {
  const acc = AuthBit.use().map({ onData: (d) => d?.id });
  const { map } = SBit(f);

  return map.value({
    onError: (e) => <div>error</div>,
    onLoading: () => <div>loading...</div>,
    onData: (d) =>
      d.length == 0 ? (
        <div>no apps found</div>
      ) : (
        <div class="column cross-stretch">
          {d.map((a) => AppSnippet({ app: a }))}
        </div>
      ),
  });
}

export function AppInfo({ app }: { app: AppModel }) {
  return (
    <div class="row cross-start">
      {app.icon ? (
        <img src={app.icon} style="height: 4rem; width: 4rem;" />
      ) : (
        <div class="secondary rounded column" style="width: 4rem; height:4rem;">
          <LucideImage />
        </div>
      )}
      <div class="flex-1 column cross-stretch gap-half">
        <div class="b text-l">{app.name}</div>
        {app.expand.account ? <UserChip user={app.expand.account} /> : null}
      </div>
    </div>
  );
}

export function AppSnippet({ app }: { app: AppModel }) {
  return (
    <div
      class={
        "card row main-space-between cross-stretch pointer " +
        (app.status == "draft" ? "secondary" : "")
      }
      style={app.status == "archived" ? "opacity: 0.5; cursor: unset" : ""}
      onClick={app.status == "archived" ? null : go("/app/" + app.id)}
    >
      <AppInfo app={app} />
      <div class="column cross-end main-space-between">
        <div class="">{showDate(app.created)}</div>
        {app.status == "active" ? null : <div class="i b">{app.status}</div>}
      </div>
    </div>
  );
}
