import { LucideX, Sparkle, Sparkles } from "lucide-react";
import { ReadMembership } from "../../service/s_member";
import { UserBit } from "../../signal/b_user";
import { AppInfo, AppSnippet } from "../app/v_app_list";
import { Separator } from "../../elbe/components";
import { go, showDate } from "../../util";

export function MemberOwnListView() {
  const { map } = UserBit.use();
  return map({
    onData: (d) => (
      <div class="column cross-stretch">
        {d.expand?.memberships?.map((m) => (
          <_MembershipOwnSnippet membership={m} />
        )) ?? <div>you're not testing any apps yet</div>}
      </div>
    ),
  });
}

function _MembershipOwnSnippet({ membership }: { membership: ReadMembership }) {
  console.log("membership", membership);
  const completed = membership.status === "completed";
  const active = membership.status === "active";
  const removed = membership.status === "removed";
  const requested = membership.status === "requested";

  return (
    <div
      class={
        " card column cross-stretch main-start pointer" +
        (active ? " secondary" : "")
      }
      onClick={go("/app/" + membership.expand.app.id)}
      style={removed ? "opacity: 0.5" : null}
    >
      <div class="row cross-start main-space-between">
        <AppInfo app={membership.expand.app} />
        <div class="column main-space-between gap-none cross-end">
          {completed ? null : (
            <button class="integrated">
              <LucideX />
            </button>
          )}
          <div class="text-s i">updated: {showDate(membership.updated)}</div>
        </div>
      </div>
      <Separator />
      {requested ? (
        <div class="row main-stretch">
          <div class="text i">your request was sent to the dev</div>
        </div>
      ) : null}
      {active ? (
        <div class="column gap-half">
          <div>
            <span class="b">active.</span> you were accepted as a tester!
            download and test the app.
          </div>
          <div class="text-s i b action">
            the test-phase usually takes around three weeks
          </div>
        </div>
      ) : null}
      {completed ? (
        <div class="row main-space-between">
          <div class="text-s i">completed. thank you!</div>
          <div class="b action row gap-quarter main-end">
            <Sparkles />
            +1
          </div>
        </div>
      ) : null}
      {removed ? (
        <div class="row main-stretch">
          <div class="text i">you are not testing</div>
        </div>
      ) : null}
    </div>
  );
}
