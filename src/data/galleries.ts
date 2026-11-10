export type GallerySetting = {
  title?: string;
  description?: string;
  order?: number;
  previewLimit?: number;
};

// ============================================================
// PHOTO GALLERY SETTINGS — OPTIONAL
//
// You do NOT need to edit this file just to add photos.
// Create a folder inside src/media/galleries/ and add images.
// Example:
//   src/media/galleries/portraits/01.jpg
//   src/media/galleries/portraits/02.jpg
//
// The folder automatically becomes a gallery.
// Only add an entry below if you want a custom title/description.
// ============================================================

export const gallerySettings: Record<string, GallerySetting> = {
  // portraits: {
  //   title: "Portraits",
  //   description: "Selected portrait work.",
  //   order: 1,
  //   previewLimit: 12,
  // },
};

// Optional captions. Key format: "folder-name/file-name.jpg"
export const photoCaptions: Record<string, string> = {
  // "portraits/01.jpg": "Optional caption",
};
