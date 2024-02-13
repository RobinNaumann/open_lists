import { Sparkles, User } from "lucide-react";
import { UserModel } from "../../service/s_user";
import { go } from "../../util";

export function UserChip({ user }: { user: UserModel }) {
  return (
    <div
      class="row main-start gap-half pointer"
      onClick={go("/account/" + user.id)}
    >
      <_UserImg img={user.avatar} />
      <div class="">{user.name || "unnamed user"}</div>
      {user.expand.sparkles ? (
        <div class="action b tooltipped">
          <div class="tooltip">
            this reflects the number of apps a user has tested
          </div>
          <Sparkles height="0.9rem" />
          {user.expand.sparkles.count}
        </div>
      ) : null}
    </div>
  );
}

function _UserImg({ img }: { img: string }) {
  return !img ? (
    <div
      class="secondary round column main-center"
      style="height:1.5rem; width:1.5rem"
    >
      <User style="width: 1rem" />
    </div>
  ) : (
    <img
      class="secondary round column main-center"
      style="height:1.5rem; width:1.5rem"
      src={img}
    ></img>
  );
}
