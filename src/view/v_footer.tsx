import { CheckCircle, Circle, Plus, Trash, Trash2, Trash2Icon, X } from "lucide-react";
import { imsg } from "../util";

export function FooterView() {
    return (
        <div class="footer">
            {imsg({"en": "written by", "de": "geschrieben von"})} <a href="https://robbb.in">Robin</a>.<br/>v0.3 <a href="https://gitlab.com/constorux/open_lists.git">source code</a>
        </div>
    );
}