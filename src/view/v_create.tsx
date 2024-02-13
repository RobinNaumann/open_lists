import {
  CheckCircle,
  Circle,
  Plus,
  Trash,
  Trash2,
  Trash2Icon,
  X,
} from "lucide-react";
import { imsg, listId } from "../util";
import { useState } from "preact/hooks";
import { EntryService } from "../service/s_pb";

export function CreateView() {
  const [state, setState] = useState("");

  function submitOnEnter(e: KeyboardEvent) {
    if (e.key == "Enter") submit();
  }

  function submit() {
    if (state.length > 0) {
      EntryService.i.set(null, { list: listId(), title: state, done: false });
      setState("");
    }
  }

  return (
    <div class="create-base">
      <input
        class="elbe-textfield"
        type="text"
        placeholder={imsg({ en: "add entry", de: "neuer Eintrag" })}
        onKeyDown={submitOnEnter}
        value={state}
        onChange={(e: any) => setState(e.target.value)}
      />
      <button disabled={state.length <= 0} onClick={submit} class="btn-primary">
        <Plus />
      </button>
    </div>
  );
}
