import { useEffect, useRef, useState } from "react";
import { photoGalleries } from "./data/media";
import type { GalleryPhoto } from "./data/media";
import "./photoArchive.css";

type LightboxState = {
  gallerySlug: string;
  index: number;
};

export default function PhotoArchive() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const touchStartX = useRef<number | null>(null);

  const activeGallery = lightbox
    ? photoGalleries.find((gallery) => gallery.slug === lightbox.gallerySlug)
    : undefined;
  const activePhoto =
    activeGallery && lightbox ? activeGallery.photos[lightbox.index] : undefined;

  const moveLightbox = (direction: number) => {
    if (!activeGallery || !lightbox) return;

    setLightbox({
      gallerySlug: lightbox.gallerySlug,
      index:
        (lightbox.index + direction + activeGallery.photos.length) %
        activeGallery.photos.length,
    });
  };

  useEffect(() => {
    if (!lightbox) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "ArrowLeft") moveLightbox(-1);
      if (event.key === "ArrowRight") moveLightbox(1);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightbox, activeGallery]);

  const openPhoto = (gallerySlug: string, photo: GalleryPhoto) => {
    const gallery = photoGalleries.find((item) => item.slug === gallerySlug);
    if (!gallery) return;

    const index = gallery.photos.findIndex((item) => item.id === photo.id);
    if (index >= 0) setLightbox({ gallerySlug, index });
  };

  return (
    <div className="photoArchive" id="archive" aria-label="Photography archive">
      <div className="photoArchiveHeader">
        <span className="photoArchiveKicker">PHOTO ARCHIVE ///</span>
        <h3>SELECTED IMAGES</h3>
        <p>
          {photoGalleries.length === 0
            ? "THE ARCHIVE IS BEING ASSEMBLED. CHECK BACK SOON."
            : "Collections update automatically when photos are added to the media folders."}
        </p>
      </div>

      {photoGalleries.map((gallery) => {
        const isExpanded = expanded[gallery.slug] ?? false;
        const visiblePhotos = isExpanded
          ? gallery.photos
          : gallery.photos.slice(0, gallery.previewLimit);

        return (
          <section className="photoCollection" key={gallery.slug}>
            <div className="photoCollectionHeading">
              <div>
                <span>{String(gallery.photos.length).padStart(2, "0")} IMAGES</span>
                <h4>{gallery.title}</h4>
              </div>
              {gallery.description && <p>{gallery.description}</p>}
            </div>

            <div className="photoMasonry">
              {visiblePhotos.map((photo) => (
                <button
                  className="photoTile"
                  type="button"
                  key={photo.id}
                  onClick={() => openPhoto(gallery.slug, photo)}
                  aria-label={`Open ${photo.caption ?? photo.fileName}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.caption ?? gallery.title}
                    loading="lazy"
                    decoding="async"
                  />
                  {photo.caption && <span>{photo.caption}</span>}
                </button>
              ))}
            </div>

            {gallery.photos.length > gallery.previewLimit && (
              <button
                className="photoExpand"
                type="button"
                onClick={() =>
                  setExpanded((current) => ({
                    ...current,
                    [gallery.slug]: !isExpanded,
                  }))
                }
              >
                {isExpanded
                  ? "SHOW LESS"
                  : `VIEW ALL ${gallery.photos.length} IMAGES`}
                <span>{isExpanded ? "↑" : "↓"}</span>
              </button>
            )}
          </section>
        );
      })}

      {activeGallery && activePhoto && lightbox && (
        <div
          className="photoLightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeGallery.title} photo viewer`}
          onTouchStart={(event) => {
            touchStartX.current = event.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
            const delta = endX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(delta) < 50) return;
            moveLightbox(delta > 0 ? -1 : 1);
          }}
        >
          <button
            className="lightboxBackdrop"
            type="button"
            aria-label="Close photo viewer"
            onClick={() => setLightbox(null)}
          />

          <div className="lightboxFrame">
            <div className="lightboxTopbar">
              <span>{activeGallery.title}</span>
              <span>
                {String(lightbox.index + 1).padStart(2, "0")} /{" "}
                {String(activeGallery.photos.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                aria-label="Close photo viewer"
              >
                ×
              </button>
            </div>

            <div className="lightboxImageWrap">
              <button
                className="lightboxArrow lightboxArrowLeft"
                type="button"
                onClick={() => moveLightbox(-1)}
                aria-label="Previous photo"
              >
                ←
              </button>

              <img src={activePhoto.src} alt={activePhoto.caption ?? activeGallery.title} />

              <button
                className="lightboxArrow lightboxArrowRight"
                type="button"
                onClick={() => moveLightbox(1)}
                aria-label="Next photo"
              >
                →
              </button>
            </div>

            <div className="lightboxCaption">
              <span>{activePhoto.caption ?? activePhoto.fileName}</span>
              <small>ARROW KEYS / SWIPE TO NAVIGATE · ESC TO CLOSE</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
