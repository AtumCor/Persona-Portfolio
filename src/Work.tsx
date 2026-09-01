import PageTransition from "./components/PageTransition/PageTransition";
import { projects } from "./data/projects";
import { useNavigate } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./work.css";

gsap.registerPlugin(ScrollTrigger);

export default function Work() {
    const sectionRef = useRef<HTMLElement>(null);
    const transitionRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    useLayoutEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        const ctx = gsap.context(() => {
            // Header reveal
            const headerTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    once: true,
                },
            });

            headerTimeline
                .from(".workNumber", {
                    autoAlpha: 0,
                    x: -140,
                    scale: 1.25,
                    duration: 0.55,
                    ease: "back.out(1.7)",
                })
                .from(
                    ".workKicker",
                    {
                        autoAlpha: 0,
                        x: -80,
                        duration: 0.35,
                        ease: "power4.out",
                    },
                    "-=0.25",
                )
                .from(
                    ".workHeading",
                    {
                        autoAlpha: 0,
                        x: 180,
                        duration: 0.55,
                        ease: "power4.out",
                    },
                    "-=0.2",
                )
                .from(
                    ".workHeaderNote",
                    {
                        autoAlpha: 0,
                        scale: 0,
                        duration: 0.4,
                        ease: "back.out(2)",
                    },
                    "-=0.25",
                );

            // Project reveals
            const cards =
                gsap.utils.toArray<HTMLElement>(".projectCard");

            cards.forEach((card, index) => {
                gsap.from(card, {
                    autoAlpha: 0,
                    x: index % 2 === 0 ? -120 : 120,
                    y: 60,
                    duration: 0.8,
                    ease: "power4.out",

                    scrollTrigger: {
                        trigger: card,
                        start: "top 82%",
                        once: true,
                    },
                });
            });
        }, section);

        return () => {
            ctx.revert();
        };
    }, []);
    const handleOpenCase = (slug: string) => {
        const transition = transitionRef.current;

        if (!transition) return;

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
                navigate(`/projects/${slug}`, {
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

            <section
                className="workSection"
                id="work"
                ref={sectionRef}
            >
                <div className="workHeader">
                    <span className="workNumber">01</span>

                    <div className="workHeadingWrap">
                        <span className="workKicker">
                            CASE FILES ///
                        </span>

                        <h2 className="workHeading">
                            WORK
                        </h2>
                    </div>

                    <span className="workHeaderNote">
                        SELECT A FILE
                        <br />
                        TO INVESTIGATE
                    </span>
                </div>

                <div className="projectList">
                    {projects.map((project) => (
                        <article
                            className="projectCard"
                            key={project.number}
                        >
                            <div className="projectIndex">
                                {project.number}
                            </div>

                            <div className="projectHoverNote" aria-hidden="true">
                                <span>!</span>
                                INVESTIGATE
                            </div>

                            <div className="projectImage">
                                <div className="projectImagePlaceholder">
                                    <span>PROJECT IMAGE</span>
                                </div>
                            </div>

                            <div className="projectContent">
                                <span className="projectCategory">
                                    {project.category}
                                </span>

                                <h3 className="projectTitle">
                                    {project.title.map((line) => (
                                        <span key={line}>
                                            {line}
                                        </span>
                                    ))}
                                </h3>

                                <p className="projectDescription">
                                    {project.description}
                                </p>

                                <div className="projectTags">
                                    {project.tags.map((tag) => (
                                        <span key={tag}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    className="projectOpen"
                                    type="button"
                                    onClick={() =>
                                        handleOpenCase(project.slug)}
                                >
                                    OPEN CASE
                                    <span>↗</span>
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}