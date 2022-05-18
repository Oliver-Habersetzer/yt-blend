export interface Snippet {
  title: string;
  assignable: boolean;
  channelId: string;
}

export interface Item {
  kind: string;
  etag: string;
  id: string;
  snippet: Snippet;
}

export interface CategoriesResponse {
  kind: string;
  etag: string;
  items: Item[];
  nextPageToken: string;
  prevPageToken: string;
}
