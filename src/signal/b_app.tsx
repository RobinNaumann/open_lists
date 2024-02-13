import { CtrlBit, WorkerControl } from "../bit/ctrl_bit";
import { AppModel, AppService } from "../service/s_app";
import { AuthService, AuthState } from "../service/s_auth";

type Inputs = { _id: string };
type Data = AppModel;

class Ctrl extends WorkerControl<Inputs, Data> {
  async worker() {
    return AppService.i.get(this.p._id);
  }

  async set(data: Partial<Data>) {
    await AppService.i.set(this.p._id, data);
  }
}

export const AppBit = CtrlBit<Inputs, Data, Ctrl>(
  (p, b) => new Ctrl(p, b),
  "App"
);
