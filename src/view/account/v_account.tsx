import { LogOut, Plus, Sparkles, Trash, User } from "lucide-react";
import { Spaced } from "../../elbe/components";
import { UserBit } from "../../signal/b_user";
import { AuthBit } from "../../signal/b_auth";
import { Field, chooseImageFile, go, showConfirmDialog } from "../../util";
import { AppListOfUser } from "../app/v_app_list";
import { MemberOwnListView } from "../membership/v_member_own_list";
import { SBit } from "../../bit/sbit";
import { ReadUserModel, UserService } from "../../service/s_user";

function showDeleteDialog() {
  showConfirmDialog({
    title: "delete your account",
    message:
      "Hey there, sorry to see you go. I've not had the time to automate the deletion of records from the database. But that should not hinder you from having your data deleted.<br><br> So, just send me an email at <b class=\"b\">robin.naumann+peertest@proton.me</b> and I'll get in touch.",
    okay: true,
  }).then((ok) => {});
}

export function SparklesView({ data }) {
  if (data) {
    return (
      <div class="card accent minor column">
        {" "}
        <div class="text-huge bold centered">{data.expand.sparkles.count}</div>
        <div class="row b gap-half">
          <Sparkles /> sparkles
        </div>
      </div>
    );
  }

  const { map } = UserBit.use();
  return map({
    onError: (e) => <div>error</div>,
    onLoading: () => <div>hello</div>,
    onData: (d) => (
      <div class="card accent minor column">
        {" "}
        <div class="text-huge bold centered">{d.expand.sparkles.count}</div>
        <div class="row b gap-half">
          <Sparkles /> sparkles
        </div>
      </div>
    ),
  });
}

function _AccountField({
  fId,
  placeholder,
  multiline = false,
}: {
  fId: string;
  placeholder: string;
  multiline?: boolean;
}) {
  const { map, ctrl } = UserBit.use();
  return map({
    onData: (d) => (
      <Field
        value={d[fId]}
        label={placeholder}
        multiline={multiline}
        onSubmit={(v) => ctrl.set({ [fId]: v })}
      />
    ),
  });
}

function UserView({ data }: { data?: ReadUserModel }) {
  if (data)
    return (
      <div class="column cross-stretch">
        <div class="b text-l">{data.name}</div>
        <div>{data.description}</div>
        {data.homepage ? (
          <a target="_blank" href={data.homepage}>
            {data.homepage}{" "}
          </a>
        ) : null}
      </div>
    );
}

function OwnUserView({}) {
  const { map, ctrl } = UserBit.use();

  return map({
    onData: (d) => (
      <div class="column cross-stretch">
        <h3 style="margin: 0">Your Account</h3>
        <div class="b">{d.email}</div>
        The information below is shown to other users
        <Spaced amount={0.2} />
        <_AccountField fId="name" placeholder="your name" />
        <_AccountField
          fId="description"
          placeholder="about you"
          multiline={true}
        />
        <_AccountField fId="homepage" placeholder="your homepage" />
      </div>
    ),
  });
}

export function AccountView({ account_id }: { account_id: string }) {
  const f = !account_id ? () => null : () => UserService.i.get(account_id);

  const { map } = SBit<ReadUserModel | null>(f);
  const { map: authMap, ctrl: authCtrl } = AuthBit.use();

  return map.value({
    onError: (_) => <div>error</div>,
    onLoading: () => <div>loading...</div>,
    onData: (d) => (
      <div class="base_limited column cross-stretch">
        <Spaced amount={2} />
        <ProfileImage data={d} />
        <Spaced amount={1} />

        <div class="row-resp gap-double">
          <div class="column cross-stretch flex-3">
            {d ? <UserView data={d} /> : <OwnUserView />}
            <h3 style="margin-bottom: 0"> Apps</h3>
            <AppListOfUser id={d?.id || authMap({ onData: (d) => d.id })} />
            {d ? null : <h3 style="margin-bottom: 0"> You're Testing</h3>}
            {d ? null : <MemberOwnListView />}
          </div>
          <div class="column flex-1 cross-stretch">
            <SparklesView data={d} />

            {d ? null : (
              <button class="loud minor" onClick={go("app")}>
                <Plus /> <div>create app</div>
              </button>
            )}
            {authMap({
              onData: (auth) =>
                auth && !d ? (
                  <div class="column cross-stretch">
                    <button onClick={authCtrl.logout} class="action">
                      <LogOut />
                      log out
                    </button>
                    <button onClick={showDeleteDialog} class="integrated">
                      <Trash />
                      delete
                    </button>
                  </div>
                ) : null,
            })}
          </div>
        </div>
      </div>
    ),
  });
}

function ProfileImage({ data }) {
  if (data) {
    return (
      <div class="column">
        {data.avatar ? (
          <img src={data.avatar} class="round secondary profile-img " />
        ) : (
          <div class="secondary round profile-img column main-center ">
            <User />
          </div>
        )}
      </div>
    );
  }

  const { map, ctrl } = UserBit.use();

  async function setImg() {
    const file = await chooseImageFile();
    if (!file) return;

    const fd: FormData = new FormData();
    fd.append("avatar", file);
    ctrl.set(fd);
  }

  return map({
    onData: (d) => (
      <div class="column">
        {d.avatar ? (
          <img
            src={d.avatar}
            class="round secondary profile-img pointer"
            onClick={setImg}
          />
        ) : (
          <div
            class="secondary round profile-img column main-center pointer"
            onClick={setImg}
          >
            <User />
          </div>
        )}
        <div class="text-s i">max. 100 kB</div>
      </div>
    ),
  });
}
