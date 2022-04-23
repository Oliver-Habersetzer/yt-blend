import ApiKeys from "../data/ApiKeys";
import ChannelsResponse from "../data/youtube-api/ChannelsResponse";
import SubscriptionsResponse from "../data/youtube-api/SubscriptionsResponse";
import ErrorResponse from "../data/youtube-api/ErrorResponse";
import Channel from "../data/Channel";
import moment from "moment";
import Video from "../data/Video";
import LikedVideosResponse, {
  Thumbnail,
} from "../data/youtube-api/LikedVideosResponse";

interface PagedResponse<T> {
  items: T[];
  nextPageToken?: string;
}

type PageToken = string | undefined;

type GetPagedResource<T> = (pageToken: PageToken) => Promise<PagedResponse<T>>;

const YTAPIv3 = "https://www.googleapis.com/youtube/v3/";

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

  private async onErrorInterceptor(response: Response): Promise<Response> {
    return new Promise<Response>((resolve, reject) => {
      if (response.status >= 400) {
        return (response.json() as Promise<ErrorResponse>)
          .then((error) => reject(`${error.error.code} ${error.error.message}`))
          .catch((err) => reject(err));
      }
      return resolve(response);
    });
  }

  public async isLoggedIn(): Promise<boolean | string> {
    return new Promise<boolean | string>((resolve, reject) => {
      if (this.youtubeClientAccessToken === undefined) return resolve(false);

      fetch(
        `${YTAPIv3}channels?part=snippet&mine=true&access_token=${encodeURIComponent(
          this.youtubeClientAccessToken
        )}`
      )
        .then(this.onErrorInterceptor)
        .then((response) => {
          return response.json() as Promise<ChannelsResponse>;
        })
        .then((data) => {
          if (data?.items[0] && data.items[0]?.snippet)
            return resolve(data.items[0].snippet.title);
          return resolve(true);
        })
        .catch((err) => {
          console.debug(err);
          return reject(err);
        });
    });
  }

  private fallbackChain<T>(fallback: T, ...values: (T | undefined)[]) {
    for (const value of values) if (value) return value;
    return fallback;
  }

  public async getSubscriptions(): Promise<Channel[]> {
    return new Promise<Channel[]>((resolve, reject) => {
      if (this.youtubeClientAccessToken === undefined) return reject();
      const youtubeClientAccessToken = this.youtubeClientAccessToken;

      this.getPaged<Channel>((pageToken) => {
        return fetch(
          `${YTAPIv3}subscriptions?part=snippet,contentDetails&maxResults=50&mine=true&access_token=${encodeURIComponent(
            youtubeClientAccessToken
          )}${pageToken ? `&pageToken=${pageToken}` : ""}`
        )
          .then((response) => response.json() as Promise<SubscriptionsResponse>)
          .then((data) => {
            const result: PagedResponse<Channel> = {
              items: data.items
                .filter(
                  (item) =>
                    item.snippet &&
                    item.snippet.title &&
                    (item.snippet.thumbnails.default ||
                      item.snippet.thumbnails.medium ||
                      item.snippet.thumbnails.high)
                )
                .map(
                  (item) =>
                    ({
                      name: item.snippet.title,
                      thumbnail: this.fallbackChain(
                        undefined,
                        item.snippet.thumbnails.default.url,
                        item.snippet.thumbnails.medium.url,
                        item.snippet.thumbnails.high.url
                      ),
                      image: this.fallbackChain(
                        undefined,
                        item.snippet.thumbnails.medium.url,
                        item.snippet.thumbnails.default.url,
                        item.snippet.thumbnails.high.url
                      ),
                      videoCount: item.contentDetails.totalItemCount,
                      id: item.snippet.channelId,
                      resourceId: item.snippet.resourceId.channelId,
                      created: moment(item.snippet.publishedAt),
                    } as Channel)
                ),
              nextPageToken: data.nextPageToken,
            };
            return result;
          });
      })
        .then((channels) => {
          resolve(channels);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async getLikedVideos(like = true): Promise<Video[]> {
    return new Promise<Video[]>((resolve, reject) => {
      if (this.youtubeClientAccessToken === undefined) return reject();
      const youtubeClientAccessToken = this.youtubeClientAccessToken;

      this.getPaged<Video>((pageToken) => {
        return fetch(
          `${YTAPIv3}videos?part=snippet,statistics&maxResults=50&myRating=${
            !like ? "dis" : ""
          }like&mine=${like}&access_token=${encodeURIComponent(
            youtubeClientAccessToken
          )}${pageToken ? `&pageToken=${pageToken}` : ""}`
        )
          .then((response) => response.json() as Promise<LikedVideosResponse>)
          .then((data) => {
            const result: PagedResponse<Video> = {
              items: data.items.map((item) => {
                const video = {
                  id: item.id,
                  categoryId: +item.snippet.categoryId,
                  channel: {
                    name: item.snippet.channelTitle,
                    id: item.snippet.channelId,
                  },
                  published: moment(item.snippet.publishedAt),
                  comments: +item.statistics.commentCount,
                  likes: +item.statistics.likeCount,
                  views: +item.statistics.viewCount,
                  title: item.snippet.title,
                } as Video;
                let minW = 100000;
                let maxW = 0;

                Object.values(item.snippet.thumbnails).forEach(
                  (value: Thumbnail) => {
                    if (value.width < minW) {
                      minW = value.width;
                      video.thumbnail = value.url;
                    }
                    if (value.width > maxW) {
                      maxW = value.width;
                      video.image = value.url;
                    }
                  }
                );
                return video;
              }),
              nextPageToken: data.nextPageToken,
            };
            return result;
          });
      })
        .then((channels) => {
          resolve(channels);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private async getPaged<T>(
    getPagedResource: GetPagedResource<T>,
    elements: T[] = [],
    pageToken: PageToken = undefined,
    maxResults = 1000
  ) {
    return new Promise<T[]>((resolve, reject) =>
      getPagedResource(pageToken)
        .then((response: PagedResponse<T>) => {
          const items = [...elements, ...response.items];
          if (
            response.items.length === 0 ||
            response.items.length >= maxResults ||
            !response.nextPageToken
          ) {
            resolve(items);
          } else {
            this.getPaged(getPagedResource, items, response.nextPageToken)
              .then(resolve)
              .catch(reject);
          }
        })
        .catch(reject)
    );
  }

  /*
  TODO:
  Get channel details: https://developers.google.com/youtube/v3/docs/channels/list?apix_params=%7B%22part%22%3A%5B%22snippet%2CcontentDetails%2Cstatistics%22%5D%2C%22id%22%3A%5B%22UC_x5XG1OV2P6uZZ5FSM9Ttw%22%5D%7D#usage
  */
}
