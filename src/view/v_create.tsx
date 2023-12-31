import { CheckCircle, Circle, Plus, Trash, Trash2, Trash2Icon, X } from "lucide-react";

export function CreateView() {//, onDelete: () => void, onToggle: () => void }) {
    return (
        <div class="create-base">
            <input class="elbe-textfield" type="text" placeholder="Enter text" />
            <button class="btn-primary btn-icon disabled"><Plus/></button>
        </div>
    );
}