import { Component, render } from "preact";
import "../style/elbe/elbe.scss";
import "../style/google.scss";
import "../style/base.scss";
import { HeaderView } from "./view/v_header";
import { FooterView } from "./view/v_footer";
import { Loader2 } from "lucide-react";
import { Route, Router, route } from "preact-router";
import { AccountView } from "./view/account/v_account";
import { AuthService, AuthState } from "./service/s_auth";
import { useEffect } from "preact/hooks";
import { AuthBit } from "./signal/b_auth";
import { AppContentView } from "./view/app/v_app_content";
import { HomeView } from "./view/v_home";
import { UserBit } from "./signal/b_user";

function _Router({}) {
  return (
    <Router>
      <Route path="/" component={HomeView} />
      <ProtectedRoute path="/app/:app_id?" component={AppContentView} />
      <ProtectedRoute path="/account/:account_id?" component={AccountView} />
    </Router>
  );
}

class App extends Component {
  async componentDidMount() {
    // Check if user is authenticated here
    // You can call the guard method here
    this.guard(window.location.pathname, await AuthService.i.get());
  }

  // some method that returns a promise
  guard(url: string, user: AuthState) {
    if (user) return;
    route("/", true);
  }

  render() {
    const { map } = AuthBit.use();

    return map({
      onData: (d) => (
        <div>
          <HeaderView />
          {d ? (
            <UserBit.Provide id={d.id}>
              {" "}
              <_Router />{" "}
            </UserBit.Provide>
          ) : (
            <_Router />
          )}
          <FooterView />
          <div style="height:0px width: 0px; border: solid 1px transparent"></div>
        </div>
      ),

      onError: (e) => <span>error</span>,
      onLoading: () => <Spinner />,
    });
  }
}

function Root() {
  return (
    <div class="content-base elbe-base primary">
      <AuthBit.Provide>
        <App />
      </AuthBit.Provide>
    </div>
  );
}

export function Spinner() {
  return (
    <div style="margin: 5rem 0" class="centered padded">
      {" "}
      <div class="rotate-box">
        <Loader2 />
      </div>
    </div>
  );
}

function ProtectedRoute(props: any) {
  const { map } = AuthBit.use();

  const isLoggedIn = map({
    onData: (d) => !!d,
    onError: (e) => false,
    onLoading: () => false,
  });

  useEffect(() => {
    if (!isLoggedIn) {
      route("/", true);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;
  return <Route {...props} />;
}

render(<Root />, document.getElementById("app"));
