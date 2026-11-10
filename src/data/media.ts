import { gallerySettings, photoCaptions } from "./galleries";

export type GalleryPhoto = {
  id: string;
  src: string;
  fileName: string;
  folder: string;
  caption?: string;
};

export type PhotoGallery = {
  slug: string;
  title: string;
  description?: string;
  order: number;
  previewLimit: number;
  photos: GalleryPhoto[];
};

const galleryModules = import.meta.glob<string>(
  "../media/galleries/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}",
  {
  eager: true,
  query: "?url",
    import: "default",
  },
);

const projectModules = import.meta.glob<string>(
  "../media/projects/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);

const naturalSort = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

const titleFromFolder = (folder: string) =>
  folder
    .split(/[-_]/g)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const parseGalleryPath = (path: string, src: string): GalleryPhoto | null => {
  const marker = "/galleries/";
  const markerIndex = path.indexOf(marker);
  if (markerIndex === -1) return null;

  const relative = path.slice(markerIndex + marker.length);
  const parts = relative.split("/");
  if (parts.length < 2) return null;

  const folder = parts[0];
  const fileName = parts.at(-1) ?? "";
  const id = `${folder}/${fileName}`;

  return {
    id,
    src,
    fileName,
    folder,
    caption: photoCaptions[id],
  };
};

const galleryPhotoList = Object.entries(galleryModules)
  .map(([path, src]) => parseGalleryPath(path, src))
  .filter((photo): photo is GalleryPhoto => photo !== null)
  .sort((a, b) => naturalSort(a.id, b.id));

const grouped = galleryPhotoList.reduce<Record<string, GalleryPhoto[]>>(
  (accumulator, photo) => {
    accumulator[photo.folder] ??= [];
    accumulator[photo.folder].push(photo);
    return accumulator;
  },
  {},
);

export const photoGalleries: PhotoGallery[] = Object.entries(grouped)
  .map(([slug, photos]) => {
    const settings = gallerySettings[slug] ?? {};

    return {
      slug,
      title: settings.title ?? titleFromFolder(slug),
      description: settings.description,
      order: settings.order ?? 999,
      previewLimit: settings.previewLimit ?? 12,
      photos,
    };
  })
  .sort((a, b) => a.order - b.order || naturalSort(a.title, b.title));

export const getProjectImages = (slug: string) => {
  const marker = `/projects/${slug}/`;

  return Object.entries(projectModules)
    .filter(([path]) => path.includes(marker))
    .sort(([pathA], [pathB]) => naturalSort(pathA, pathB))
    .map(([, src]) => src);
};
