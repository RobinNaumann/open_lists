import { Archive, Check, Rocket, Trash } from "lucide-react";
import { ReadMembership } from "../../service/s_member";
import { UserChip } from "../account/v_account_chip";
import { go, showConfirmDialog, showDate } from "../../util";
import { AppService } from "../../service/s_app";
import { route } from "preact-router";

function TesterView({ member }: { member: ReadMembership }) {
  return (
    <div class="row flex-1 gap">
      <div
        class="tooltipped pointer column cross-stretch gap-half"
        onClick={go("/account/" + member.account)}
      >
        <div class="tooltip">
          <UserChip user={member.expand.account} />
        </div>
        <div class="b">{member.email}</div>

        <div class="">{member.device}</div>
      </div>
      <div class="flex-1 text-s" style="text-align: end">
        since. {showDate(member.updated)}
      </div>
    </div>
  );
}

function _emptyList(list, onEmpty) {
  if (list.length == 0) {
    return onEmpty;
  }
  return list;
}

export function MemberApproveList({
  appId,
  members,
}: {
  appId: string;
  members: ReadMembership[];
}) {
  if (!members || !members.map) {
    return <div class="i">could not load testing management</div>;
  }
  return (
    <div class="column cross-stretch gap-double">
      <hr style="color: #00000033; width: 100%; height: 1px" />
      <h3>Manage Testers</h3>
      <h5 class="margin-none">requests</h5>
      <div class="column cross-stretch">
        {_emptyList(
          members
            .filter((m) => m.status == "requested")
            .map((m) => (
              <div class="card row main-space-between">
                <TesterView member={m} />

                <div class="row main-end">
                  <button class="action">deny</button>
                  <button class="loud minor">
                    <Check />
                    accept
                  </button>
                </div>
              </div>
            )),
          "no requests yet"
        )}
      </div>
      <h5 class="margin-none" style="margin-top: 1rem;">
        active testers
      </h5>
      <div class="column cross-stretch">
        {_emptyList(
          members
            .filter((m) => m.status == "active")
            .map((m) => (
              <div class="card row main-space-between">
                <TesterView member={m} />
                <div class="row main-end">
                  <button class="integrated">
                    <Trash />
                    remove
                  </button>
                </div>
              </div>
            )),
          "no active testers yet"
        )}
      </div>
      <div class="row main-end">
        <button
          class="loud minor"
          onClick={async () => {
            const s = await showConfirmDialog({
              title: "really finish testing?",
              message:
                'all testers that are still present will be rewarded 1 sparkle.<br><b class="b">You can NOT undo this action.</b><br><br><span style="font-size: 0.8rem">This is only possible <b class="b"> after at least 2 weeks</b><br>(to avoid spam).</span>',
            });
            if (!s) return;
            await AppService.i.finishTesting(appId);
            route("/account/");
          }}
        >
          <Rocket /> complete testing
        </button>
      </div>
    </div>
  );
}

export function ArchiveBtn(a: { appId: string }) {
  return (
    <button
      class="integrated"
      onClick={async () => {
        const s = await showConfirmDialog({
          title: "permanently delete?",
          message:
            'This will delete the app and all its data. No Sparkles will be rewarded.<br><b class="b">You can NOT undo this action.</b>',
        });
        if (!s) return;
        await AppService.i.archive(a.appId);
        route("/account/");
      }}
    >
      <Archive /> delete
    </button>
  );
}
