import { StreamControl, CtrlBit } from "../bit/ctrl_bit";
import { ReadUserModel, UserModel, UserService } from "../service/s_user";

type Inputs = { id: string };
type Data = ReadUserModel;

class Ctrl extends StreamControl<Inputs, Data> {
  async listen() {
    UserService.i.observe(
      this.p.id,
      (u) => this.bit.emit(u),
      (e) => this.bit.emitError(e)
    );
  }

  async set(changes: Object) {
    this.bit.emitLoading();
    await UserService.i.set(this.p.id, changes);
  }

  async remove() {
    this.bit.emitLoading();
    await UserService.i.delete(this.p.id);
  }
}

export const UserBit = CtrlBit<Inputs, Data, Ctrl>(
  (p, b) => new Ctrl(p, b),
  "User"
);
