import React from "react";
import _apiKeys from "./apiKeys.json";
import ApiKeys from "./data/ApiKeys";
const apiKeys: ApiKeys = _apiKeys as ApiKeys;
import ApiConnection from "./logic/ApiConnection";
import { Cookies, withCookies } from "react-cookie";
import "./style.scss";

interface IState {
  apiConnection: ApiConnection;
  isLoggedIn: boolean;
  username?: string;
  error?: string;
}

interface IProps {
  cookies: Cookies;
}

const YT_CLIENT_ACCESS_TOKEN_KEY = "youtube-client-access-token";

class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    const search = window.location.search + window.location.hash;
    if (search !== "") {
      const searchParams = [...new URLSearchParams(search).entries()];
      console.debug("search / hash params:", searchParams);

      for (const param of searchParams) {
        switch (param[0]) {
          default:
            console.debug(`Unknown search param: ${param[0]}`);
            break;
          case "state":
          case "token_type":
          case "expires_in":
          case "scope":
            break;
          case "access_token":
            this.props.cookies.set(YT_CLIENT_ACCESS_TOKEN_KEY, param[1]);
            break;
        }
      }

      window.location.href = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
    }

    this.state = {
      apiConnection: new ApiConnection(
        apiKeys,
        props.cookies.get(YT_CLIENT_ACCESS_TOKEN_KEY)
      ),
      isLoggedIn: false,
    };
  }

  componentDidMount() {
    this.state.apiConnection
      .isLoggedIn()
      .then((loggedIn: boolean | string) => {
        this.setState({
          isLoggedIn: !!loggedIn,
          username: typeof loggedIn === "string" ? loggedIn : undefined,
        });
      })
      .catch((error) => {
        this.setState({ error: `Error: ${error}` });
      });
  }

  render() {
    return (
      <div className="container">
        {this.state.error && <div>${this.state.error}</div>}
        {this.state.isLoggedIn ? (
          <>
            <div>
              <span>
                Logged in{this.state.username && <> as {this.state.username}</>}
              </span>
              <span
                onClick={() => this.logout()}
                className="btn btn-sm btn-accent"
              >
                Log out
              </span>
            </div>
            <div>
              <span
                onClick={() => this.getSubscriptions()}
                className="btn btn-sm btn-accent"
              >
                Get subscriptions
              </span>
            </div>
          </>
        ) : (
          <span onClick={() => this.login()} className="btn btn-sm btn-accent">
            Login
          </span>
        )}
      </div>
    );
  }

  login() {
    this.state.apiConnection.loginClient();
  }

  logout() {
    this.props.cookies.remove(YT_CLIENT_ACCESS_TOKEN_KEY);
    window.location.reload();
  }

  getSubscriptions() {
    this.state.apiConnection.getSubscriptions();
  }
}

export default withCookies(App);
