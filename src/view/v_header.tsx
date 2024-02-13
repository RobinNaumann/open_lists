import {
  CheckCircle,
  Circle,
  FilePlus,
  Trash,
  Trash2,
  Trash2Icon,
  X,
  User,
} from "lucide-react";
import { asString, createNewList, imsg, listId } from "../util";
import { Spinner } from "..";
import { LoginWithGoogleView } from "./v_login";
import { route } from "preact-router";
import { AuthBit } from "../signal/b_auth";

export function HeaderView() {
  return (
    <div>
      <div style="height: 5rem"></div>
      <div class="header">
        <div class="header-title flex-1 cross-start" onClick={goHome}>
          <div style="font-weight: normal">
            <b class="b">peerTest</b>
            <span class="action b">•org</span>
            <sup class="i b text-s" style="margin-left: 1rem">
              beta
            </sup>
          </div>
        </div>

        <ProfileButton />
      </div>
    </div>
  );
}

function goAccount() {
  route("/account");
}

function goHome() {
  route("/");
}

function ProfileButton() {
  const { map } = AuthBit.use();
  return map({
    onData: (d) =>
      !d ? (
        <LoginWithGoogleView />
      ) : (
        <button class="integrated" onClick={goAccount}>
          <div class="if-wide">{d?.email}</div>
          <User />
        </button>
      ),
    onLoading: () => <Spinner />,
    onError: (e) => <div>{asString(e)}</div>,
  });
}
