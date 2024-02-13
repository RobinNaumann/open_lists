import { CtrlBit, WorkerControl } from "../bit/ctrl_bit";
import { AppModel, AppService } from "../service/s_app";
import { AuthService, AuthState } from "../service/s_auth";

type Inputs = { account: string };
type Data = AppModel[];

class Ctrl extends WorkerControl<Inputs, Data> {
  async worker() {
    return AppService.i.list({ filter: "account = '" + this.p.account + "'" });
  }
}

export const AppsBit = CtrlBit<Inputs, Data, Ctrl>(
  (p, b) => new Ctrl(p, b),
  "Apps"
);
