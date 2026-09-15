import media from "./media.json";

export type MediaKey = keyof typeof media;

export type AlbumImage = {
  src: string;
  width: number;
  height: number;
  /** `wide` pages take the full width of the viewer grid, `inset` sit as details. */
  span: "wide" | "inset";
};

export type Album = {
  id: AlbumId;
  cover: AlbumImage;
  pages: AlbumImage[];
  /** Drives the scattered layout of the circular cards. */
  layout: {
    /** Relative diameter, 0..1, against the row's base size. */
    scale: number;
    /** Vertical drift in rem, so the ring of covers never reads as a grid. */
    offset: number;
  };
};

export const ALBUM_IDS = [
  "wedding",
  "birthday",
  "love",
  "archive",
  "keepsake",
] as const;

export type AlbumId = (typeof ALBUM_IDS)[number];

function img(key: MediaKey, span: AlbumImage["span"] = "wide"): AlbumImage {
  const m = media[key];
  return { src: m.src, width: m.w, height: m.h, span };
}

export const ALBUMS: Record<AlbumId, Album> = {
  wedding: {
    id: "wedding",
    cover: img("wedding-cover-square"),
    pages: [
      img("wedding-cover"),
      img("wedding-title", "inset"),
      img("wedding-rings", "inset"),
      img("keepsake-spread"),
    ],
    layout: { scale: 1, offset: 0 },
  },

  birthday: {
    id: "birthday",
    cover: img("birthday-circle"),
    pages: [
      img("birthday-covers"),
      img("birthday-spread"),
      img("birthday-collage", "inset"),
      img("birthday-fashion", "inset"),
    ],
    layout: { scale: 0.86, offset: 3.5 },
  },

  love: {
    id: "love",
    cover: img("love-spread-square"),
    pages: [
      img("love-spread"),
      img("love-polaroids", "inset"),
      img("love-list", "inset"),
      img("heart-detail"),
    ],
    layout: { scale: 1.06, offset: -2 },
  },

  archive: {
    id: "archive",
    cover: img("archive-circle"),
    pages: [
      img("examples-flatlay"),
      img("archive-cover", "inset"),
      img("archive-pages", "inset"),
      img("archive-open"),
    ],
    layout: { scale: 0.9, offset: 2.5 },
  },

  keepsake: {
    id: "keepsake",
    cover: img("keepsake-box"),
    pages: [
      img("keepsake-box"),
      img("keepsake-seal", "inset"),
      img("craft-leather", "inset"),
      img("keepsake-spread"),
    ],
    layout: { scale: 0.94, offset: -3 },
  },
};

export const ALBUM_LIST = ALBUM_IDS.map((id) => ALBUMS[id]);

/** Images used outside the album viewer. */
export const MEDIA = media;
