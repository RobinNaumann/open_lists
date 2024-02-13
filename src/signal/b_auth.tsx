import { StreamControl, CtrlBit } from "../bit/ctrl_bit";
import { AuthService, AuthState } from "../service/s_auth";
import { go } from "../util";

type Inputs = {};
type Data = AuthState;

class Ctrl extends StreamControl<Inputs, Data> {
  async listen() {
    AuthService.i.observe(
      (u) => this.bit.emit(u),
      (e) => this.bit.emitError(e)
    );
  }
  logout = async () => {
    this.bit.emitLoading();
    await AuthService.i.logout();
    go("/");
  };
}

export const AuthBit = CtrlBit<Inputs, Data, Ctrl>(
  (p, b) => new Ctrl(p, b),
  "Auth"
);
