import { CheckCircle, Circle, FilePlus, Trash, Trash2, Trash2Icon, X } from "lucide-react";
import { EntryService } from "../service/s_entry";

export function HeaderView() {
    return <div>
        <div style="height: 3rem"></div>
        <div class="header">
            <button class="btn-icon btn-integrated"><FilePlus/></button>
            <div class="header-title">Liste <b>ABCD-1234</b>
                
            </div>
            <button class="btn-icon btn-integrated"><X /></button>
        </div>
    </div>;

}