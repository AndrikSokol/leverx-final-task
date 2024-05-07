export type DiscogsResponse = {
  pagination: Pagination;
  results: Result[];
};

export type Pagination = {
  per_page: number;
  pages: number;
  page: number;
  urls: Urls;
  items: number;
};

export type Urls = {
  last: string;
  next: string;
};

export type Result = {
  style: string[];
  thumb: string;
  title: string;
  country: string;
  format: string[];
  uri: string;
  community: Community;
  label: string[];
  catno: string;
  year?: string;
  genre: string[];
  resource_url: string;
  type: string;
  id: number;
  barcode?: string[];
};

export type Community = {
  want: number;
  have: number;
};
