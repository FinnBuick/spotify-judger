export interface Profile {
  id: string;
  display_name: string;
  email: string;
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  href: string;
  images: {
    height: number | null;
    url: string;
    width: number | null;
  }[];
  type: string;
  uri: string;
}
export interface SpotifyUserTopItems {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: ArtistObject[] | TrackObject[];
}

export interface ArtistObject {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface TrackObject {
  album: {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: {
      url: string;
      height: number;
      width: number;
    }[];
    name: string;
    release_date: string;
    release_date_precision: string;
    type: string;
    uri: string;
    artists: {
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }[];
  };
  artists: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
  }[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}
[];

// export type Timerange = 'short_term' | 'medium_term' | 'long_term'
export const timeRanges = ['short_term', 'medium_term', 'long_term'] as const;

export type Timerange = (typeof timeRanges)[number];
