import ApiKeys from "../data/ApiKeys";
import ChannelsPartSnippet from "../data/youtube-api/ChannelsPartSnippet";

export default class ApiConnection {
  private apiKeys: ApiKeys;
  private youtubeClientAccessToken?: string;

  public constructor(
    apiKeys: ApiKeys,
    youtubeClientAccessToken: string | undefined = undefined
  ) {
    this.apiKeys = apiKeys;
    this.youtubeClientAccessToken = youtubeClientAccessToken;
  }

  public loginClient() {
    let url = "https://accounts.google.com/o/oauth2/v2/auth";
    url += `?client_id=${encodeURIComponent(
      this.apiKeys.YouTubeClient.client_id
    )}`;
    url += `&redirect_uri=${encodeURIComponent(
      this.apiKeys.YouTubeClient.redirect_uris[0]
    )}`;
    url += `&response_type=token`;
    url += `&scope=${encodeURIComponent(
      "https://www.googleapis.com/auth/youtube"
    )} ${encodeURIComponent(
      "https://www.googleapis.com/auth/youtube.readonly"
    )}`;
    url += `&include_granted_scopes=true`;
    url += `&state=login`;

    window.location.href = url;
  }

  public async isLoggedIn(): Promise<boolean | string> {
    return new Promise<boolean | string>((resolve, reject) => {
      if (this.youtubeClientAccessToken === undefined) return resolve(false);

      fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&access_token=${encodeURIComponent(
          this.youtubeClientAccessToken
        )}`
      )
        .then((response) => response.json() as Promise<ChannelsPartSnippet>)
        .then((data) => {
          if (
            data.items &&
            data.items[0] &&
            data.items[0].snippet &&
            data.items[0].snippet.localized
          )
            return resolve(data.items[0].snippet.localized.title);
          return resolve(true);
        })
        .catch((err) => reject(err));
    });
  }
}
