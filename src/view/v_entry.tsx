import { CheckCircle, Circle, Trash, Trash2, Trash2Icon, X } from "lucide-react";
import { EntryService } from "../service/s_entry";

export function EntryView(props: { entry: any }) {//, onDelete: () => void, onToggle: () => void }) {
    const e = props.entry;
    return <div onClick={() => EntryService.i.set(e.id, { done: !e.done })} class={"entry-base " + (e.done ? "disabled" : "")}>
        <div class="entry-toggle">
            {e.done ? <CheckCircle /> : <Circle />}
        </div>
        <div class="entry-title">
            {e.title}</div>
        <Trash2 />
    </div>;

}