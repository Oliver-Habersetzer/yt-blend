export interface YoutubeClientSecrets {
  client_id: string;
  project_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_secret: string;
  redirect_uris: string[];
  javascript_origins: string[];
}

export default interface ApiKeys {
  YouTube: string;
  YouTubeClient: YoutubeClientSecrets;
}
