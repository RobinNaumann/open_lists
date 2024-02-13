import { Edit2, Eye, LucideImage, Save } from "lucide-react";
import { ElbeDialog, Spaced } from "../../elbe/components";
import {
  Field,
  chooseImageFile,
  clone,
  difference,
  showDate,
  showToast,
} from "../../util";
import { useComputed, useSignal } from "@preact/signals";
import { AppBit } from "../../signal/b_app";
import {
  AppModel,
  AppModel_KEYS,
  AppService,
  ReadAppModel,
} from "../../service/s_app";
import { AuthBit } from "../../signal/b_auth";
import { Auto_KEYS } from "../../service/s_pb";
import { UserChip } from "../account/v_account_chip";
import { MemberCreateView } from "../membership/v_member";
import { route } from "preact-router";
import {
  ArchiveBtn,
  MemberApproveList,
} from "../membership/v_member_approve_list";
import { OwnMemberBit } from "../../signal/b_is_tester";
import { SBit } from "../../bit/sbit";

function Info({
  editing,
  _id,
  label,
  classs = "b",
  multiline = false,
  value,
  placeholder,
  onSubmit,
}: {
  editing: boolean;
  _id: string;
  label: string;
  classs?: string;
  value: string;
  multiline?: boolean;
  placeholder?: string;
  onSubmit?: (key: string, s: string) => void;
}) {
  if (!editing)
    return (
      <div class={classs}>{value || <i style="opacity: 40%">{label}</i>}</div>
    );

  return Field({
    value,
    label: label,
    classs: classs,
    multiline: multiline,
    placeholder: placeholder,
    onSubmit: (v) => onSubmit(_id, v),
  });
}

// choose image file for upload

export function AppContentView({ app_id }: { app_id: string | null }) {
  if (!app_id) {
    return <ContentView _id={null} m={{}} />;
  }
  return (
    <AppBit.Provide _id={app_id}>
      <OwnMemberBit.Provide appId={app_id} isOwner={false}>
        <_AppContentView />
      </OwnMemberBit.Provide>
    </AppBit.Provide>
  );
}

function _AppContentView({}) {
  const { signal, map } = AppBit.use();

  return map({
    onData: (d) => <ContentView _id={d.id} m={d} />,
  });
}

function ContentView({
  _id,
  m,
}: {
  _id: string | null;
  m: Partial<ReadAppModel>;
}) {
  const auth = AuthBit.use();

  const editable =
    _id == null || auth.map({ onData: (d) => d.id }) == m.account;

  const changesSignal = useSignal({});
  const imageSignal = useSignal<File>(null);
  const editSignal = useSignal(editable);
  const modelSignal = useComputed<ReadAppModel>(() => {
    return { ...clone(m), ...changesSignal.value };
  });

  const viewingExistingSignal = useComputed<boolean>(() => {
    return _id != null && !editSignal.value;
  });

  const savableSignal = useComputed<boolean>(() => {
    const keys = Object.keys(changesSignal.value);

    if (keys.length == 0) return false;
    if (_id) return true;

    if (imageSignal.value == null) return false;

    for (const k of ["name", "description", "url_download"]) {
      if (!keys.includes(k)) return false;
    }

    return true;
  });

  async function save() {
    try {
      const account = auth.map({ onData: (d) => d.id });
      if (!account) return;

      const fd: FormData = new FormData();
      fd.append("account", account);
      fd.append("status", "active");

      const changes = changesSignal.peek();
      const image = imageSignal.peek();

      for (const k of difference(AppModel_KEYS, Auto_KEYS, [
        "account",
        "icon",
      ])) {
        if (changes[k] == undefined) continue;
        fd.append(k, changes[k]);
      }
      if (image) fd.append("icon", image);

      await AppService.i.set(_id, fd);
      route("/account/");
    } catch (e) {
      showToast("could not save the app");
    }
  }

  function updatePlayPackage(k: string, v: string) {
    update(k, "https://play.google.com/apps/testing/" + v);
  }

  function getPlayPackage(v: string) {
    return v?.replace("https://play.google.com/apps/testing/", "");
  }

  function update(k: string, v: string) {
    const n = { ...changesSignal.peek(), ...{ [k]: v } };
    changesSignal.value = n;
  }

  function getImage() {
    chooseImageFile().then((f) => (f == null ? null : (imageSignal.value = f)));
  }

  return m.status === "archived" ? (
    <div class="centered" style="text-align: center; margin: 5rem 1rem;">
      this app is
      <br />
      no longer available
    </div>
  ) : (
    <div class="base_limited column cross-stretch gap-double">
      <Spaced amount={2} />
      <div class="row">
        <div
          class="column cross-stretch main-start gap-half"
          style="width:100px"
        >
          {imageSignal.value || modelSignal.value.icon ? (
            <img
              src={
                imageSignal.value
                  ? URL.createObjectURL(imageSignal.value)
                  : modelSignal.value.icon
              }
              style="width: 100px; height:100px"
              alt=""
              class={"rounded " + (editSignal.value ? "pointer" : "")}
              onClick={editSignal.value ? getImage : null}
            />
          ) : (
            <div
              style="height:100px; width:100px"
              class={
                "secondary rounded column main-center " +
                (editSignal.value ? "pointer" : "")
              }
              onClick={editSignal.value ? getImage : null}
            >
              <LucideImage />
            </div>
          )}
          {editSignal.value ? (
            <div class="row main-center">
              <i class="text-s">max. 100 kB</i>
            </div>
          ) : null}
        </div>
        <div class="column cross-stretch gap-half">
          <Info
            editing={editSignal.value}
            _id="name"
            label="app name"
            classs="text-l b"
            value={modelSignal.value.name}
            onSubmit={update}
          />
          {modelSignal.value.expand?.account ? (
            <UserChip user={modelSignal.value.expand.account} />
          ) : null}
        </div>
      </div>
      <div class="row gap-double cross-start">
        <div class="column cross-stretch flex-3">
          <h3 class="margin-none">description</h3>
          <Info
            editing={editSignal.value}
            _id="description"
            label="description"
            classs=""
            multiline={true}
            value={modelSignal.value.description}
            onSubmit={update}
          />
          {TesterInfo(
            editSignal,
            modelSignal,
            updatePlayPackage,
            getPlayPackage
          )}
        </div>

        <div class="column flex-1 cross-stretch">
          {_id ? (
            <TestersSidebar app={modelSignal.value} isOwn={editable} />
          ) : null}
          {editable ? (
            <div class="column cross-stretch">
              <button
                class={"loud minor " + (savableSignal.value ? "" : "disabled")}
                onClick={savableSignal.value ? save : null}
              >
                <Save />
                {_id ? "save" : "create"}
              </button>

              <button
                class="integrated"
                onClick={() => (editSignal.value = !editSignal.value)}
              >
                {editSignal.value ? <Eye /> : <Edit2 />}{" "}
                {editSignal.value ? "view" : "edit"}
              </button>
              <ArchiveBtn appId={_id} />
            </div>
          ) : null}
        </div>
      </div>
      <Spaced amount={2} />
      {_id && editable ? (
        <MemberApproveList
          appId={_id}
          members={modelSignal.value.expand.memberships ?? []}
        />
      ) : null}
    </div>
  );
}

function TesterCountView({ appId }) {
  const b = SBit(() => AppService.i.getMeta(appId));

  return b.map.value({
    onData: (d) => <div class="text-huge bold centered">{d.tester_count}</div>,
  });
}

function TestersSidebar({ app, isOwn }: { app: AppModel; isOwn: boolean }) {
  return (
    <div class="column cross-stretch">
      <div class="card column cross-center">
        <TesterCountView appId={app.id} />
        <div>testers</div>
        <div class="b text-centered text-s">
          created {showDate(app.created)}
        </div>
      </div>
      {isOwn ? null : <JoinDialog appId={app.id} />}
    </div>
  );
}

function JoinDialog({ appId }: { appId: string }) {
  const { map } = AuthBit.use();
  const memberBit = OwnMemberBit.use();
  const s = useSignal(false);

  return (
    <div class="column cross-stretch">
      {memberBit.map({
        onData: (d) =>
          d ? (
            <button class="loud minor disabled">{d.status}</button>
          ) : (
            <button class="loud minor" onClick={() => (s.value = true)}>
              join
            </button>
          ),
      })}
      <ElbeDialog
        open={s.value}
        title="join testers"
        onClose={() => (s.value = false)}
      >
        {map({
          onData: (d) => <MemberCreateView authId={d.id} appId={appId} />,
        })}
      </ElbeDialog>
    </div>
  );
}

function TesterInfo(
  editSignal,
  modelSignal,
  updatePlayPackage,
  getPlayPackage
) {
  const memberBit = OwnMemberBit.use();
  return memberBit.map({
    onData: (d) =>
      !(d?.status == "active") ? null : (
        <div>
          {" "}
          <h3 class="margin-none" style="margin-top:2rem">
            tester info
          </h3>
          {editSignal.value ? (
            <div class="action text-s i b">
              this will only be shown to users you accept as testers
            </div>
          ) : null}
          <Info
            editing={editSignal.value}
            _id="url_download"
            label="google play package name"
            classs="b"
            placeholder="org.peertest.example"
            multiline={false}
            value={getPlayPackage(modelSignal.value.url_download)}
            onSubmit={updatePlayPackage}
          />
          users will be able to join your test by clicking on the generated link
          {modelSignal.value.url_download ? (
            <button
              class="action"
              onClick={() => {
                window.open(modelSignal.value.url_download, "_blank");
              }}
            >
              check your link
            </button>
          ) : null}
        </div>
      ),
  });
}
