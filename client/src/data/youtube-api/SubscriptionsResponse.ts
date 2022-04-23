export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}

export interface ResourceId {
  kind: string;
  channelId: string;
}

export interface Default {
  url: string;
}

export interface Medium {
  url: string;
}

export interface High {
  url: string;
}

export interface Thumbnails {
  default: Default;
  medium: Medium;
  high: High;
}

export interface Snippet {
  publishedAt: Date;
  title: string;
  description: string;
  resourceId: ResourceId;
  channelId: string;
  thumbnails: Thumbnails;
}

export interface ContentDetails {
  totalItemCount: number;
  newItemCount: number;
  activityType: string;
}

export interface Item {
  kind: string;
  etag: string;
  id: string;
  snippet: Snippet;
  contentDetails: ContentDetails;
}

export default interface SubscriptionsResponse {
  kind: string;
  etag: string;
  nextPageToken: string;
  prevPageToken: string;
  pageInfo: PageInfo;
  items: Item[];
}
