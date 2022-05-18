import React from "react";
import _apiKeys from "./apiKeys.json";
import ApiKeys from "./data/ApiKeys";
const apiKeys: ApiKeys = _apiKeys as ApiKeys;
import ApiConnection from "./logic/ApiConnection";
import { Cookies, withCookies } from "react-cookie";
import "./style.scss";
import { Alert } from "react-bootstrap";
import ChannelList from "./Components/ChannelList";
import VideoList from "./Components/VideoList";
import UserInfo from "./data/UserInfo";
import CategoryList from "./Components/CategoryList";
import EvaluationComponent from "./Components/EvaluationComponent";
import { humanFileSize } from "./utils";

interface IState {
  apiConnection?: ApiConnection;
  isLoggedIn: boolean;
  username?: string;
  error?: string;

  userInfo?: UserInfo;

  expanded: {
    subscriptions: boolean;
    likedVideos: boolean;
    dislikedVideos: boolean;
    categories: boolean;
    evaluation: boolean;
  };
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
      console.debug(
        "search / hash params:",
        JSON.stringify(searchParams, undefined, 4)
      );

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
      isLoggedIn: false,
      expanded: {
        subscriptions: false,
        likedVideos: false,
        dislikedVideos: false,
        categories: false,
        evaluation: false,
      },
    };
  }

  componentDidMount() {
    const apiConnection = new ApiConnection(
      apiKeys,
      this.props.cookies.get(YT_CLIENT_ACCESS_TOKEN_KEY)
    );
    this.setState({
      apiConnection: apiConnection,
    });

    apiConnection
      .isLoggedIn()
      .then((loggedIn: boolean | string) => {
        this.setState({
          isLoggedIn: !!loggedIn,
          username: typeof loggedIn === "string" ? loggedIn : undefined,
        });
      })
      .catch((error) => {
        // this.props.cookies.remove(YT_CLIENT_ACCESS_TOKEN_KEY);
        this.setState({ error: `Error: ${error}` });
      });
  }

  render() {
    const data = JSON.stringify(this.state.userInfo);
    const bytes = new TextEncoder().encode(data).length;

    return (
      <div className="container">
        {this.state.error && (
          <Alert variant="danger">{`${this.state.error}`}</Alert>
        )}
        {this.state.isLoggedIn ? (
          <>
            {/* Log out */}
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

            {/* Get user info */}
            <div>
              <span
                onClick={() => this.getUserInfo()}
                className="btn btn-sm btn-accent"
              >
                Get all user info
              </span>
            </div>

            {this.state.userInfo?.subscriptions && (
              <>
                <h3>Subscriptions</h3>
                <span
                  onClick={() => {
                    this.setState({
                      expanded: {
                        ...this.state.expanded,
                        subscriptions: !this.state.expanded.subscriptions,
                      },
                    });
                  }}
                  className="btn btn-sm btn-accent"
                >
                  {(this.state.expanded.subscriptions ? "Hide" : "Show") +
                    " Subscriptions"}
                </span>
                {this.state.expanded.subscriptions && (
                  <div className="p-1">
                    <ChannelList channels={this.state.userInfo.subscriptions} />
                  </div>
                )}
              </>
            )}

            {this.state.userInfo?.likedVideos && (
              <>
                <h3>Liked Videos</h3>
                <span
                  onClick={() => {
                    this.setState({
                      expanded: {
                        ...this.state.expanded,
                        likedVideos: !this.state.expanded.likedVideos,
                      },
                    });
                  }}
                  className="btn btn-sm btn-accent"
                >
                  {(this.state.expanded.likedVideos ? "Hide" : "Show") +
                    " Liked Videos"}
                </span>
                {this.state.expanded.likedVideos && (
                  <div className="p-1">
                    <VideoList videos={this.state.userInfo.likedVideos} />
                  </div>
                )}
              </>
            )}

            {this.state.userInfo?.dislikedVideos && (
              <>
                <h3>Disliked Videos</h3>
                <span
                  onClick={() => {
                    this.setState({
                      expanded: {
                        ...this.state.expanded,
                        dislikedVideos: !this.state.expanded.dislikedVideos,
                      },
                    });
                  }}
                  className="btn btn-sm btn-accent"
                >
                  {(this.state.expanded.dislikedVideos ? "Hide" : "Show") +
                    " Disiked Videos"}
                </span>
                {this.state.expanded.dislikedVideos && (
                  <div className="p-1">
                    <VideoList videos={this.state.userInfo.dislikedVideos} />
                  </div>
                )}
              </>
            )}

            {this.state.userInfo?.categories && (
              <>
                <h3>Categories</h3>
                <span
                  onClick={() => {
                    this.setState({
                      expanded: {
                        ...this.state.expanded,
                        categories: !this.state.expanded.categories,
                      },
                    });
                  }}
                  className="btn btn-sm btn-accent"
                >
                  {(this.state.expanded.categories ? "Hide" : "Show") +
                    " Categories"}
                </span>
                {this.state.expanded.categories && (
                  <div className="p-1">
                    <CategoryList categories={this.state.userInfo.categories} />
                  </div>
                )}
              </>
            )}

            {this.state.userInfo?.evaluation && (
              <>
                <h3>Evaluation</h3>
                <span
                  onClick={() => {
                    this.setState({
                      expanded: {
                        ...this.state.expanded,
                        evaluation: !this.state.expanded.evaluation,
                      },
                    });
                  }}
                  className="btn btn-sm btn-accent"
                >
                  {(this.state.expanded.evaluation ? "Hide" : "Show") +
                    " Categories"}
                </span>{" "}
                {this.state.expanded.evaluation &&
                  this.state.userInfo.categories && (
                    <EvaluationComponent
                      evaluation={this.state.userInfo.evaluation}
                      categories={this.state.userInfo.categories}
                    />
                  )}
              </>
            )}

            {this.state.userInfo && (
              <div>
                <h3>Metadata</h3>
                <p>
                  <b>Data size:</b>
                  {` ${data.length} characters, ${humanFileSize(bytes)}`}
                </p>
              </div>
            )}
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
    if (this.state.apiConnection) this.state.apiConnection.loginClient();
  }

  logout() {
    this.props.cookies.remove(YT_CLIENT_ACCESS_TOKEN_KEY);
    window.location.reload();
  }

  getUserInfo() {
    if (this.state.apiConnection)
      this.state.apiConnection
        .getUserInfo()
        .then((userInfo) => {
          this.setState({
            userInfo: userInfo,
          });
        })
        .catch((error) => {
          this.setState({ error: error });
        });
  }
}

export default withCookies(App);
