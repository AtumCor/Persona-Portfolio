import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import PageTransition from "./components/PageTransition/PageTransition";
import { Link, useSearchParams } from "react-router-dom";
import { useVaultTransition } from "./components/VaultTransition/VaultTransition";
import { getProjectImages } from "./data/media";
import { projects } from "./data/projects";
import "./archive.css";

type Category = "photography" | "graphic-design";

type ArchiveImage = {
  src: string;
  imageNumber: number;
};

type ArchiveProject = {
  number: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  images: ArchiveImage[];
};

const categories: { id: Category; label: string; number: string; description: string }[] = [
  {
    id: "photography",
    label: "PHOTOGRAPHY",
    number: "01",
    description: "FRAMES, LIGHT, AND THE MOMENTS BETWEEN.",
  },
  {
    id: "graphic-design",
    label: "GRAPHIC DESIGN",
    number: "02",
    description: "VISUAL SYSTEMS, EXPERIMENTS, AND IDEAS.",
  },
];

const normalizeTag = (tag: string) =>
  tag.trim().toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ");

// Project tags determine the category; the existing project media folders
// determine the images. Covers are included once even if already discovered.
const collections = categories.map((category) => {
  const matchingProjects: ArchiveProject[] = projects
    .filter((project) =>
      project.tags.some((tag) => normalizeTag(tag) === normalizeTag(category.label)),
    )
    .map((project) => {
      const sources = Array.from(new Set([
        ...(project.coverImage ? [project.coverImage] : []),
        ...getProjectImages(project.slug),
      ]));

      return {
        number: project.number,
        slug: project.slug,
        title: project.title.join(" "),
        category: project.category,
        description: project.description,
        tags: project.tags,
        images: sources.map((src, index) => ({ src, imageNumber: index + 1 })),
      };
    });

  return {
    ...category,
    projects: matchingProjects,
    imageCount: matchingProjects.reduce((sum, project) => sum + project.images.length, 0),
  };
});

type PendingMorph = {
  slug: string;
  cover: HTMLImageElement | null;
  card: HTMLButtonElement;
  veil: HTMLDivElement;
  finish: () => void;
  started: boolean;
};

const twoDigits = (number: number) => String(number).padStart(2, "0");

export default function Archive() {
  const { returnToWork } = useVaultTransition();
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = collections.find((category) => category.id === searchParams.get("category"));
  const activeProject = selected?.projects.find(
    (project) => project.slug === searchParams.get("project"),
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const fileTransitionRef = useRef<HTMLDivElement>(null);
  const fileTransitionLabelRef = useRef<HTMLSpanElement>(null);
  const fileTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const zoomTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const zoomCardRef = useRef<HTMLElement | null>(null);
  const morphTargetRef = useRef<HTMLImageElement | null>(null);
  const morphFlyingRef = useRef<HTMLImageElement | null>(null);
  const zoomScrollGuardRef = useRef<((event: Event) => void) | null>(null);
  const zoomVeilRef = useRef<HTMLDivElement | null>(null);
  const zoomFrameRef = useRef<number | null>(null);
  const pendingMorphRef = useRef<PendingMorph | null>(null);
  const fileTransitionBusyRef = useRef(false);

  const imageCount = activeProject?.images.length ?? 0;
  const activeImage = lightboxIndex !== null ? activeProject?.images[lightboxIndex] : undefined;

  // Keep the existing OPEN CASE wipe for category and return navigation.
  // Opening a project itself uses the growing-card transition below.
  // Query-string navigation keeps browser back/forward and deep links working.
  const changeView = (category: Category | null, projectSlug: string | null = null) => {
    if (fileTransitionBusyRef.current) return;

    const nextCategory = collections.find((item) => item.id === category);
    const nextProject = nextCategory?.projects.find((item) => item.slug === projectSlug);
    if (projectSlug && !nextProject) return;

    const currentCategory = selected?.id ?? null;
    const currentProject = activeProject?.slug ?? null;
    if (currentCategory === category && currentProject === projectSlug) {
      if (category) resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const nextParams = category
      ? { category, ...(projectSlug ? { project: projectSlug } : {}) }
      : {};
    const curtain = fileTransitionRef.current;
    const label = fileTransitionLabelRef.current;

    if (!curtain) {
      setLightboxIndex(null);
      setSearchParams(nextParams);
      return;
    }

    fileTransitionBusyRef.current = true;
    if (label) {
      label.textContent = nextProject
        ? `OPEN FILE ${nextProject.number}`
        : nextCategory
          ? (activeProject && currentCategory === category ? "RETURN TO FILES" : nextCategory.label)
          : "CLOSE FILE";
    }

    fileTimelineRef.current?.kill();
    gsap.killTweensOf(curtain);
    gsap.set(curtain, { display: "block", xPercent: -120 });

    fileTimelineRef.current = gsap.timeline({
      onComplete: () => {
        gsap.set(curtain, { display: "none", xPercent: -120 });
        fileTransitionBusyRef.current = false;
        fileTimelineRef.current = null;
      },
    })
      .to(curtain, { xPercent: 0, duration: 0.45, ease: "power4.in" })
      .add(() => {
        // Switch content behind the opaque panel; scroll before opening it.
        flushSync(() => {
          setLightboxIndex(null);
          setSearchParams(nextParams);
        });
        if (category) resultsRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
        else window.scrollTo({ top: 0, behavior: "auto" });
      })
      .to(curtain, { xPercent: 120, duration: 0.55, ease: "power4.out" }, ">+=0.09");
  };

  // Expand a copy of the clicked card. It stays above the page while the
  // router renders the destination; the image shrink begins in useLayoutEffect
  // only AFTER React has committed the actual gallery DOM.
  const openProject = (project: ArchiveProject, card: HTMLButtonElement) => {
    if (fileTransitionBusyRef.current || !selected) return;

    const bounds = card.getBoundingClientRect();
    const enlargedCard = card.cloneNode(true) as HTMLButtonElement;
    enlargedCard.classList.add("archiveProjectCardZoom");
    enlargedCard.setAttribute("aria-hidden", "true");
    enlargedCard.setAttribute("inert", "");
    enlargedCard.tabIndex = -1;
    enlargedCard.disabled = true;
    enlargedCard.querySelectorAll("img").forEach((img) => { img.loading = "eager"; });

    fileTransitionBusyRef.current = true;
    zoomCardRef.current = enlargedCard;

    // Block user-initiated scrolling without removing the scrollbar, because
    // a scrollbar-width change would move our destination mid-animation.
    const blockScroll = (event: Event) => {
      if (event instanceof KeyboardEvent &&
          ![" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(event.key)) return;
      if (event.cancelable) event.preventDefault();
    };
    zoomScrollGuardRef.current = blockScroll;
    window.addEventListener("wheel", blockScroll, { passive: false });
    window.addEventListener("touchmove", blockScroll, { passive: false });
    window.addEventListener("keydown", blockScroll);
    document.body.appendChild(enlargedCard);

    gsap.set(enlargedCard, {
      position: "fixed",
      left: bounds.left, top: bounds.top,
      width: bounds.width, height: bounds.height,
      maxWidth: "none", margin: 0, x: 0, y: 0,
      rotation: 0, scale: 1, zIndex: 10001,
      pointerEvents: "none",
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    });

    const headline = enlargedCard.querySelector<HTMLElement>(".archiveProjectCardBody strong");
    const cover = enlargedCard.querySelector<HTMLImageElement>(".archiveProjectCardArt img");
    let flyingCover: HTMLImageElement | null = null;
    let veil: HTMLDivElement | null = null;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      const landingTarget = morphTargetRef.current;
      landingTarget?.classList.remove("archiveMorphTarget");
      if (landingTarget) gsap.set(landingTarget, { clearProps: "opacity,visibility" });
      morphTargetRef.current = null;
      document.documentElement.classList.remove("archiveMorphInProgress");
      flyingCover?.remove();
      morphFlyingRef.current = null;
      enlargedCard.remove();
      if (zoomCardRef.current === enlargedCard) zoomCardRef.current = null;
      veil?.remove();
      zoomVeilRef.current = null;
      zoomTimelineRef.current = null;
      pendingMorphRef.current = null;
      window.removeEventListener("wheel", blockScroll);
      window.removeEventListener("touchmove", blockScroll);
      window.removeEventListener("keydown", blockScroll);
      zoomScrollGuardRef.current = null;
      fileTransitionBusyRef.current = false;
      document.querySelector<HTMLButtonElement>(".archiveProjectBack")?.focus({ preventScroll: true });
    };

    const expand = gsap.timeline();
    zoomTimelineRef.current = expand;
    expand.to(enlargedCard, {
      left: 0, top: 0,
      width: window.innerWidth, height: window.innerHeight,
      borderWidth: 0, boxShadow: "0 0 0 0 rgba(0,0,0,0)",
      duration: 0.78, ease: "power4.inOut",
    });
    if (headline) expand.to(headline, {
      fontSize: Math.min(176, Math.max(52, window.innerWidth * 0.12)),
      lineHeight: 0.82, duration: 0.7, ease: "power3.inOut",
    }, 0.06);
    if (cover) expand.to(cover, {
      scale: 1.17, filter: "grayscale(0%) contrast(1.12)",
      duration: 0.78, ease: "power3.inOut",
    }, 0);
    expand.add(() => enlargedCard.classList.add("archiveProjectCardZoomSettling"), 0.54);

    expand.add(() => {
      // Capture exactly the on-screen coordinates of the enlarged cover.
      // Reparenting the SAME img keeps the already loaded image visible.
      const rect = cover?.getBoundingClientRect();
      if (cover && rect && rect.width > 0 && rect.height > 0) {
        const style = window.getComputedStyle(cover);
        const objectFit = style.objectFit;
        const objectPosition = style.objectPosition;
        const filter = style.filter;
        flyingCover = cover;
        morphFlyingRef.current = cover;
        document.body.appendChild(cover);
        gsap.set(cover, {
          position: "fixed", left: rect.left, top: rect.top,
          width: rect.width, height: rect.height,
          maxWidth: "none", maxHeight: "none",
          margin: 0, padding: 0, border: 0,
          x: 0, y: 0, rotation: 0, scale: 1,
          objectFit, objectPosition, filter, opacity: 1,
          zIndex: 10003, pointerEvents: "none",
          clipPath: "none", willChange: "left,top,width,height",
        });
      }

      veil = document.createElement("div");
      veil.setAttribute("aria-hidden", "true");
      zoomVeilRef.current = veil;
      document.body.appendChild(veil);
      gsap.set(veil, {
        position: "fixed", inset: 0, backgroundColor: "var(--ink)",
        opacity: 1, zIndex: 10000, pointerEvents: "none",
      });
      if (flyingCover) gsap.set(enlargedCard, { visibility: "hidden" });

      // Register the pending morph BEFORE changing the URL. The destination
      // may commit synchronously or on a later React render.
      pendingMorphRef.current = {
        slug: project.slug, cover: flyingCover, card: enlargedCard,
        veil, finish, started: false,
      };
      document.documentElement.classList.add("archiveMorphInProgress");
      flushSync(() => {
        setLightboxIndex(null);
        setSearchParams({ category: selected.id, project: project.slug });
      });
    });
  };

  // The destination measurement belongs here, NOT inside the click timeline.
  // React Router is allowed to defer the URL update; this effect only runs
  // after the new project gallery actually exists in the DOM.
  useLayoutEffect(() => {
    const pending = pendingMorphRef.current;
    if (!pending || !activeProject || pending.slug !== activeProject.slug || pending.started) return;

    const gallery = resultsRef.current?.querySelector<HTMLElement>(".archiveProjectGallery");
    if (!gallery) return;
    const target = gallery.querySelector<HTMLImageElement>(".archiveMasonry .archiveTile img");
    if (!target || !pending.cover) {
      pending.started = true;
      // Image-free project: preserve the original simple reveal.
      zoomTimelineRef.current = gsap.timeline({ onComplete: pending.finish })
        .to(pending.card, { opacity: 0, duration: 0.3 }, 0)
        .to(pending.veil, { opacity: 0, duration: 0.55 }, 0);
      resultsRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }

    pending.started = true;
    morphTargetRef.current = target;
    const cover = pending.cover;
    const naturalW = cover.naturalWidth || 1200;
    const naturalH = cover.naturalHeight || 800;
    target.loading = "eager";
    target.width = naturalW;
    target.height = naturalH;
    target.style.aspectRatio = `${naturalW} / ${naturalH}`;
    target.classList.add("archiveMorphTarget");

    // Position the REAL gallery tile before reading its rectangle; the flying
    // cover is fixed to the viewport and doesn't move when the page scrolls.
    target.scrollIntoView({ behavior: "auto", block: "center", inline: "nearest" });
    zoomFrameRef.current = requestAnimationFrame(() => {
      zoomFrameRef.current = null;
      if (pendingMorphRef.current !== pending) return;
      const landing = target.getBoundingClientRect();
      if (landing.width === 0 || landing.height === 0) {
        // Do not instantly drop the overlay if layout hasn't resolved yet.
        // Scroll to gallery and make another measurement on the next frame.
        zoomFrameRef.current = requestAnimationFrame(() => {
          zoomFrameRef.current = null;
          if (pendingMorphRef.current !== pending) return;
          const retry = target.getBoundingClientRect();
          animateLanding(retry);
        });
        return;
      }
      animateLanding(landing);
    });

    const animateLanding = (landing: DOMRect) => {
      if (landing.width <= 0 || landing.height <= 0) {
        // A broken/empty layout should still release the page, not trap input.
        pending.finish();
        return;
      }
      const timeline = gsap.timeline({ onComplete: pending.finish });
      zoomTimelineRef.current = timeline;
      timeline.to(pending.veil, { opacity: 0, duration: 0.9, ease: "power2.out" }, 0.12);
      // This is a real 1.2-second shrink, driven by the destination image's
      // measured viewport box, not an estimated thumbnail location.
      timeline.to(cover, {
        left: landing.left, top: landing.top,
        width: landing.width, height: landing.height,
        filter: "none", duration: 1.2, ease: "power3.inOut",
      }, 0);
      // Reveal target AFTER the moving image has landed on the same pixels.
      timeline.add(() => {
        target.classList.remove("archiveMorphTarget");
        gsap.set(target, { opacity: 0 });
      }, 1.15);
      timeline.to(target, { opacity: 1, duration: 0.13, ease: "none" }, 1.15);
      timeline.to(cover, { opacity: 0, duration: 0.13, ease: "none" }, 1.15);
    };

    return () => {
      if (zoomFrameRef.current !== null) {
        cancelAnimationFrame(zoomFrameRef.current);
        zoomFrameRef.current = null;
      }
    };
  }, [selected?.id, activeProject?.slug]);

  // Direct URLs and browser history should land on the category/project view.
  useLayoutEffect(() => {
    if (fileTransitionBusyRef.current) return;
    if (selected) resultsRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
    else window.scrollTo({ top: 0, behavior: "auto" });
  }, [selected?.id, activeProject?.slug]);

  useEffect(() => () => {
    fileTimelineRef.current?.kill();
    zoomTimelineRef.current?.kill();
    if (zoomFrameRef.current !== null) cancelAnimationFrame(zoomFrameRef.current);
    zoomVeilRef.current?.remove();
    zoomCardRef.current?.remove();
    morphFlyingRef.current?.remove();
    morphFlyingRef.current = null;
    pendingMorphRef.current = null;
    morphTargetRef.current?.classList.remove("archiveMorphTarget");
    morphTargetRef.current = null;
    document.documentElement.classList.remove("archiveMorphInProgress");
    if (zoomScrollGuardRef.current) {
      window.removeEventListener("wheel", zoomScrollGuardRef.current);
      window.removeEventListener("touchmove", zoomScrollGuardRef.current);
      window.removeEventListener("keydown", zoomScrollGuardRef.current);
      zoomScrollGuardRef.current = null;
    }
  }, []);

  // Browser back/forward can change the project without using changeView.
  useEffect(() => {
    setLightboxIndex(null);
  }, [selected?.id, activeProject?.slug]);

  useEffect(() => {
    if (lightboxIndex === null || !activeProject || imageCount === 0) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") {
        setLightboxIndex((current) =>
          current === null ? null : (current + 1) % imageCount,
        );
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) =>
          current === null ? null : (current - 1 + imageCount) % imageCount,
        );
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [lightboxIndex !== null, activeProject?.slug, imageCount]);

  const scrollProjects = (direction: -1 | 1) => {
    if (!railRef.current) return;
    railRef.current.scrollBy({
      left: direction * Math.max(300, railRef.current.clientWidth * 0.72),
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="archiveFileTransition">
        <PageTransition
          ref={fileTransitionRef}
          textRef={fileTransitionLabelRef}
          label="OPEN FILE"
        />
      </div>
      <main className="archivePage">
        <header className="archiveTopbar">
          <Link className="archiveBack" to="/#work" onClick={(event) => { event.preventDefault(); returnToWork(); }}>← BACK TO WORK</Link>
          <span>ARCHIVE // SELECT YOUR PATH</span>
        </header>

        <section className="archiveIntro" aria-labelledby="archive-title">
          <div className="archiveIntroLabels">
            <span>PERSONA / FILE SYSTEM</span>
            <span>/// OPEN ACCESS</span>
          </div>
          <h1 id="archive-title">
            <span>THE</span>
            <span>ARCHIVE<span className="archiveTitleDot">.</span></span>
          </h1>
          <p>CHOOSE A DISCIPLINE. INVESTIGATE THE PROJECT FILES.</p>
          <div className="archiveDivider" aria-hidden="true" />
          <div className="archiveChooseLabel">CHOOSE YOUR PATH <span>↓</span></div>
        </section>

        <section className="archiveChoices" aria-label="Archive categories">
          {collections.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`archiveChoice${selected?.id === category.id ? " archiveChoiceActive" : ""}`}
              onClick={() => changeView(category.id)}
              aria-pressed={selected?.id === category.id}
            >
              <span className="archiveChoiceTop">
                <span>FILE / {category.number}</span>
                <span>{twoDigits(category.projects.length)} PROJECTS</span>
              </span>
              <span className="archiveChoiceTitle">{category.label}</span>
              <span className="archiveChoiceBottom">
                <span>{category.description}</span>
                <span className="archiveChoiceArrow" aria-hidden="true">↗</span>
              </span>
            </button>
          ))}
        </section>

        {selected && (
          <section
            ref={resultsRef}
            className={`archiveResults${activeProject ? "" : " archiveResultsPickerMode"}`}
            aria-labelledby="archive-results-title"
            key={selected.id}
          >
            <div className="archiveResultsHeading">
              <div>
                <span className="archiveResultsKicker">OPEN FILE /// {selected.number}</span>
                <h2 id="archive-results-title">{selected.label}</h2>
              </div>
              <div className="archiveResultsMeta">
                <span>{twoDigits(selected.projects.length)} PROJECTS / {twoDigits(selected.imageCount)} IMAGES</span>
                <button type="button" onClick={() => changeView(null)}>× CLOSE FILE</button>
              </div>
            </div>

            {activeProject ? (
              <div className="archiveProjectGallery" key={activeProject.slug}>
                <button
                  type="button"
                  className="archiveProjectBack"
                  onClick={() => changeView(selected.id)}
                >
                  <span aria-hidden="true">←</span> ALL {selected.label} PROJECTS
                </button>
                <div className="archiveProjectGalleryHeading">
                  <div>
                    <span className="archiveResultsKicker">CASE {activeProject.number} /// IMAGE FILE</span>
                    <h3>{activeProject.title}</h3>
                    <p>{activeProject.description}</p>
                  </div>
                  <span className="archiveProjectGalleryCount">{twoDigits(imageCount)} IMAGES</span>
                </div>
                {imageCount > 0 ? (
                  <div className="archiveMasonry">
                    {activeProject.images.map((image, index) => (
                      <button
                        key={`${activeProject.slug}-${image.src}`}
                        className="archiveTile"
                        type="button"
                        onClick={() => setLightboxIndex(index)}
                        aria-label={`View ${activeProject.title} image ${image.imageNumber}`}
                      >
                        <img
                          src={image.src}
                          alt={`${activeProject.title} — image ${image.imageNumber}`}
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="archiveTileInfo">
                          <span>{activeProject.number} / FRAME {twoDigits(image.imageNumber)}</span>
                          <span aria-hidden="true">↗</span>
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="archiveEmpty">
                    <span>NO IMAGES YET ///</span>
                    <h3>FILE EMPTY.</h3>
                    <p>Add photos to <code>src/media/projects/{activeProject.slug}/</code> and they will automatically appear here.</p>
                  </div>
                )}
              </div>
            ) : selected.projects.length ? (
              <div className="archiveProjectPicker">
                <div className="archiveProjectPickerTop">
                  <div>
                    <span className="archiveProjectPickerKicker">/// SELECT CASE FILE</span>
                    <h3>PICK A PROJECT<span>.</span></h3>
                    <p>CHOOSE A PROJECT. HOVER TO INSPECT. CLICK TO OPEN.</p>
                  </div>
                  {selected.projects.length > 1 && (
                    <div className="archiveRailControls" aria-label="Scroll projects">
                      <button type="button" onClick={() => scrollProjects(-1)} aria-label="Scroll projects left">←</button>
                      <button type="button" onClick={() => scrollProjects(1)} aria-label="Scroll projects right">→</button>
                    </div>
                  )}
                </div>
                <div className="archiveProjectRail" ref={railRef} aria-label={`${selected.label} projects`}>
                  {selected.projects.map((project, index) => (
                    <button
                      className="archiveProjectCard"
                      key={project.slug}
                      type="button"
                      onClick={(event) => openProject(project, event.currentTarget)}
                      aria-label={`Open ${project.title} with ${project.images.length} images`}
                    >
                      <span className="archiveProjectCardArt" aria-hidden="true">
                        {project.images[0] ? (
                          <img src={project.images[0].src} alt="" loading="lazy" decoding="async" />
                        ) : (
                          <span className="archiveProjectCardPlaceholder">NO IMAGE<br />ON FILE</span>
                        )}
                      </span>
                      <span className="archiveProjectCardTop">
                        <span>CASE // {project.number}</span>
                        <span>{twoDigits(project.images.length)} IMAGES</span>
                      </span>
                      <span className="archiveProjectCardBody">
                        <span className="archiveProjectCardIndex">{twoDigits(index + 1)} / {twoDigits(selected.projects.length)}</span>
                        <strong>{project.title}</strong>
                        <span className="archiveProjectCardTags">{project.category}</span>
                      </span>
                      <span className="archiveProjectCardBottom">
                        <span>OPEN PROJECT FILE</span>
                        <span className="archiveProjectCardArrow" aria-hidden="true">↗</span>
                      </span>
                    </button>
                  ))}
                </div>
                <p className="archiveProjectScrollHint">← SWIPE / SCROLL TO EXPLORE →</p>
              </div>
            ) : (
              <div className="archiveEmpty">
                <span>NO PROJECT FILES ///</span>
                <h3>COMING SOON.</h3>
                <p>Tag projects <code>{selected.label}</code> in <code>src/data/projects.ts</code> to show them here. Their existing image folders are picked up automatically.</p>
              </div>
            )}
          </section>
        )}

        <footer className="archiveFooter">
          <Link to="/#work" onClick={(event) => { event.preventDefault(); returnToWork(); }}>← RETURN TO WORK</Link>
          <span>END OF ARCHIVE ///</span>
        </footer>

        {activeImage && activeProject && selected && lightboxIndex !== null && (
          <div className="archiveLightbox" role="dialog" aria-modal="true" aria-label="Project image viewer">
            <button
              type="button"
              className="archiveLightboxBackdrop"
              aria-label="Close image viewer"
              onClick={() => setLightboxIndex(null)}
            />
            <div className="archiveLightboxPanel">
              <div className="archiveLightboxBar">
                <span>{selected.label} / {activeProject.title}</span>
                <span>{twoDigits(lightboxIndex + 1)} / {twoDigits(imageCount)}</span>
                <button ref={closeRef} type="button" onClick={() => setLightboxIndex(null)} aria-label="Close image viewer">×</button>
              </div>
              <div className="archiveLightboxBody">
                <button
                  type="button"
                  className="archiveLightboxArrow archiveLightboxPrev"
                  onClick={() => setLightboxIndex((lightboxIndex - 1 + imageCount) % imageCount)}
                  aria-label="Previous image"
                >←</button>
                <img src={activeImage.src} alt={`${activeProject.title} — image ${activeImage.imageNumber}`} />
                <button
                  type="button"
                  className="archiveLightboxArrow archiveLightboxNext"
                  onClick={() => setLightboxIndex((lightboxIndex + 1) % imageCount)}
                  aria-label="Next image"
                >→</button>
              </div>
              <div className="archiveLightboxBottom">
                <span>CASE {activeProject.number} / {activeProject.title}</span>
                <small>← → TO BROWSE · ESC TO CLOSE</small>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
