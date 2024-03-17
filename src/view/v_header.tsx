import { CheckCircle, Circle, FilePlus, Trash, Trash2, Trash2Icon, X } from "lucide-react";
import { EntryService } from "../service/s_entry";
import { createNewList, imsg, listId } from "../util";

function close(){
    
    window.close();
}

function openNew(){
    createNewList();
}

export function HeaderView() {
    return <div>
        <div style="height: 3rem"></div>
        <div class="header">
            <button class="btn-icon btn-integrated" onClick={openNew}><FilePlus/></button>
            {listId() == null ? <div class="header-title">{imsg({"en": "home", "de": "Startseite"})}</div> : 
            (<div class="header-title">{imsg({"en": "list", "de": "Liste"}) + ": " + listId()}</div>)}
            
            
            {/*window.opener != null || window.history.length == 1*/ false ? ( <button class="btn-icon btn-integrated" onClick={close}><X /></button>) : (<div style="width: 3rem"></div>)}
        </div>
    </div>;

}