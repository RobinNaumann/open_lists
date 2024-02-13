import { StreamControl, CtrlBit, WorkerControl } from "../bit/ctrl_bit";
import { AuthService, AuthState } from "../service/s_auth";
import { MemberService, Membership } from "../service/s_member";
import { go } from "../util";

type Inputs = { appId: string; isOwner: boolean };
type Data = Membership | null;

class Ctrl extends WorkerControl<Inputs, Data> {
  async worker() {
    if (this.p.isOwner) return null;
    const authId = (await AuthService.i.get()).id;
    return MemberService.i.getMembership(this.p.appId, authId);
  }
}

export const OwnMemberBit = CtrlBit<Inputs, Data, Ctrl>(
  (p, b) => new Ctrl(p, b),
  "OwnMember"
);
