import { useSignal } from "@preact/signals";
import { Field, showToast } from "../../util";
import { Send } from "lucide-react";
import { MemberService } from "../../service/s_member";
import { route } from "preact-router";

export function MemberCreateView({
  authId,
  appId,
}: {
  authId: string;
  appId: string;
}) {
  const data = useSignal<{ device: string; email: string }>({
    device: null,
    email: null,
  });

  function isValid(v) {
    return v && v.device && v.email;
  }

  async function create() {
    const v = data.peek();
    if (!isValid(v)) {
      showToast("provide all data");
      return;
    }
    try {
      await MemberService.i.set(null, {
        account: authId,
        app: appId,
        status: "requested",
        email: v.email,
        device: v.device,
      });
      route("/account/");
    } catch (e) {
      showToast("could not save your request");
      route("/account/");
    }
  }

  return (
    <div class="column cross-stretch">
      <div style="font-size:0.9rem">
        once you are accepted as a tester, you will be able to download the app
        via the account you provide. Make sure to open it at least once, so that
        the developer can see that you have tested it.
      </div>
      <div style="font-size:0.9rem">
        enter the <b class="b">model of the device</b> you are going to test the
        app on. This allows the developer to determine, who participated.
      </div>
      <Field
        value={data.value.device}
        label="Device"
        placeholder="e.g. Galaxy S20"
        onSubmit={(v) => (data.value = { ...data.value, device: v })}
      />
      <Field
        value={data.value.email}
        label="your Google account"
        placeholder="e.g. example@gmail.com"
        onSubmit={(v) => (data.value = { ...data.value, email: v })}
      />

      <div class="row main-end">
        <button
          class={"loud minor " + (isValid(data.value) ? "" : "disabled")}
          onClick={isValid(data.value) ? create : null}
        >
          <Send />
          send join request
        </button>
      </div>
    </div>
  );
}
