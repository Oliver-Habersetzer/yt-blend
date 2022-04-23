export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}

export interface Default {
  url: string;
  width: number;
  height: number;
}

export interface Medium {
  url: string;
  width: number;
  height: number;
}

export interface High {
  url: string;
  width: number;
  height: number;
}

export interface Thumbnails {
  default: Default;
  medium: Medium;
  high: High;
}

export interface Localized {
  title: string;
  description: string;
}

export interface Snippet {
  title: string;
  description: string;
  publishedAt: Date;
  thumbnails: Thumbnails;
  localized: Localized;
}

export interface Item {
  kind: string;
  etag: string;
  id: string;
  snippet: Snippet;
}

export default interface ChannelsResponse {
  kind: string;
  etag: string;
  pageInfo: PageInfo;
  items: Item[];
}
