import PageTransition from "./components/PageTransition/PageTransition";
import { useVaultTransition } from "./components/VaultTransition/VaultTransition";
import { useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "./data/projects";
import { getProjectImages } from "./data/media";
import { site } from "./data/site";
import "./work.css";

gsap.registerPlugin(ScrollTrigger);

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const transitionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { enterArchive } = useVaultTransition();
  const { work } = site;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(".workNumber", {
        x: -160,
        rotation: -15,
        autoAlpha: 0,
        duration: 0.65,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      });

      gsap.from(".workHeading", {
        x: 180,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power4.out",
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      });

      gsap.utils.toArray<HTMLElement>(".projectCard").forEach((card) => {
        gsap.from(card, {
          y: 90,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power4.out",
          scrollTrigger: { trigger: card, start: "top 84%", once: true },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleOpenCase = (slug: string) => {
    const transition = transitionRef.current;

    if (!transition) {
      navigate(`/project/${slug}`);
      return;
    }

    gsap.killTweensOf(transition);

    gsap.set(transition, {
      display: "block",
      xPercent: -120,
    });

    gsap
      .timeline()
      .to(transition, {
        xPercent: 0,
        duration: 0.45,
        ease: "power4.in",
      })
      .add(() => {
        navigate(`/project/${slug}`, {
          state: {
            fromWork: true,
          },
        });
      });
  };

  return (
    <>
      <PageTransition
        ref={transitionRef}
        label="OPEN CASE"
      />

      <section className="workSection" id="work" ref={sectionRef}>
        <div className="workHeader">
          <span className="workNumber">{work.number}</span>
          <div className="workHeadingWrap">
            <span className="workKicker">{work.kicker}</span>
            <h2 className="workHeading">{work.heading}</h2>
          </div>
          <span className="workHeaderNote">
            {work.noteTop}
            <br />
            {work.noteBottom}
          </span>
        </div>

        <div className="projectList">
          {projects.map((project) => {
            const discoveredImages = getProjectImages(project.slug);
            const coverImage = project.coverImage ?? discoveredImages[0];

            return (
              <article className="projectCard" key={project.slug}>
                <span className="projectIndex">{project.number}</span>

                <div className="projectImage">
                  {coverImage ? (
                    <img
                      className="projectImageActual"
                      src={coverImage}
                      alt={`${project.title.join(" ")} cover`}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="projectImagePlaceholder">
                      <span>{work.imagePlaceholder}</span>
                    </div>
                  )}
                </div>

                <div className="projectContent">
                  <span className="projectCategory">{project.category}</span>
                  <h3 className="projectTitle">
                    {project.title.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h3>
                  <p className="projectDescription">{project.description}</p>

                  <div className="projectTags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <button
                    className="projectOpen"
                    type="button"
                    onClick={() => handleOpenCase(project.slug)}
                  >
                    {work.openButton}
                    <span>↗</span>
                  </button>
                </div>

                <div className="projectHoverNote" aria-hidden="true">
                  {work.hoverNote}
                  <span>!</span>
                </div>
              </article>
            );
          })}
        </div>

        <div className="workArchiveEntry">
          <span className="workArchiveEntryEyebrow">THE COLLECTION CONTINUES ///</span>
          <button
            className="workArchiveEntryButton"
            type="button"
            onClick={enterArchive}
          >
            ENTER THE ARCHIVE
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </section>
    </>
  );
}
