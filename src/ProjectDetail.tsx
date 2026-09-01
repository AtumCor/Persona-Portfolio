import PageTransition from "./components/PageTransition/PageTransition";
import { getProjectBySlug, projects } from "./data/projects";
import { useLayoutEffect, useRef } from "react";
import {
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";
import gsap from "gsap";
import "./projectDetail.css";



export default function ProjectDetail() {
    const pageRef = useRef<HTMLElement>(null);
    const transitionRef = useRef<HTMLDivElement>(null);
    const transitionTextRef = useRef<HTMLSpanElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { slug } = useParams();

    const project = getProjectBySlug(slug) ?? projects[0];

    useLayoutEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });

        const transition = transitionRef.current;

        const cameFromWork =
            location.state?.fromWork === true;

        if (cameFromWork && transition) {
            if (transitionTextRef.current) {
                transitionTextRef.current.textContent =
                    "OPEN CASE";
            }

            gsap.set(transition, {
                display: "block",
                xPercent: 0,
            });

            gsap.to(transition, {
                xPercent: 120,
                duration: 0.6,
                delay: 0.12,
                ease: "power4.out",

                onComplete: () => {
                    gsap.set(transition, {
                        display: "none",
                    });
                },
            });
        }

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: {
                    ease: "power4.out",
                },
            });

            tl.from(".detailNumber", {
                x: -180,
                autoAlpha: 0,
                duration: 0.5,
            })
                .from(
                    ".detailKicker",
                    {
                        x: -80,
                        autoAlpha: 0,
                        duration: 0.35,
                    },
                    "-=0.2",
                )
                .from(
                    ".detailTitle span",
                    {
                        x: 180,
                        autoAlpha: 0,
                        stagger: 0.08,
                        duration: 0.5,
                    },
                    "-=0.15",
                )
                .from(
                    ".detailMeta",
                    {
                        y: 40,
                        autoAlpha: 0,
                        duration: 0.45,
                    },
                    "-=0.15",
                )
                .from(
                    ".detailHeroImage",
                    {
                        scale: 0.8,
                        rotation: 8,
                        autoAlpha: 0,
                        duration: 0.65,
                        ease: "back.out(1.5)",
                    },
                    "-=0.3",
                );
        }, pageRef);

        return () => ctx.revert();
    }, [slug, location.state]);

    const handleBackToWork = () => {
        const transition = transitionRef.current;
        if (transitionTextRef.current) {
            transitionTextRef.current.textContent =
                "01 / WORK";
        }

        if (!transition) return;

        gsap.killTweensOf(transition);

        gsap.set(transition, {
            display: "block",
            xPercent: 120,
        });

        const tl = gsap.timeline();

        tl.to(transition, {
            xPercent: 0,
            duration: 0.45,
            ease: "power4.in",
        })

            .add(() => {
                navigate("/");

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        document
                            .querySelector("#work")
                            ?.scrollIntoView({
                                behavior: "auto",
                                block: "start",
                            });
                    });
                });
            })

            .to(transition, {
                xPercent: -120,
                duration: 0.55,
                ease: "power4.out",
            });
    };

    return (
        <>
            <PageTransition
                ref={transitionRef}
                textRef={transitionTextRef}
                label="BACK TO WORK"
                reverse
            />

            <main
                className="projectDetail"
                ref={pageRef}
            >
                <button
                    className="detailBack"
                    type="button"
                    onClick={handleBackToWork}
                >
                    ← BACK TO CASES
                </button>

                <section className="detailHero">
                    <div className="detailIntro">
                        <span className="detailNumber">
                            {project.number}
                        </span>

                        <span className="detailKicker">
                            CASE FILE ///
                        </span>

                        <h1 className="detailTitle">
                            {project.title.map((line) => (
                                <span key={line}>{line}</span>
                            ))}
                        </h1>

                        <div className="detailMeta">
                            <span>{project.category}</span>
                            <span>{project.role}</span>
                        </div>
                    </div>

                    <div className="detailHeroImage">
                        <div className="detailImagePlaceholder">
                            PROJECT IMAGE
                        </div>
                    </div>
                </section>

                <section className="detailBody">
                    <div className="detailSectionLabel">
                        01 / OVERVIEW
                    </div>

                    <p className="detailLead">
                        {project.description}
                    </p>

                    <div className="detailGrid">
                        <article>
                            <span className="detailSmallLabel">
                                THE PROBLEM
                            </span>
                            <h2>
                                What needed to be solved?
                            </h2>
                            <p>
                                Explain the context, constraint, or
                                creative challenge here.
                            </p>
                        </article>

                        <article>
                            <span className="detailSmallLabel">
                                THE APPROACH
                            </span>
                            <h2>
                                How was it attacked?
                            </h2>
                            <p>
                                Describe the design process,
                                technical approach, or experiments.
                            </p>
                        </article>

                        <article>
                            <span className="detailSmallLabel">
                                THE RESULT
                            </span>
                            <h2>
                                What happened?
                            </h2>
                            <p>
                                Add outcomes, lessons learned, and
                                what changed because of the work.
                            </p>
                        </article>
                    </div>

                    <div className="detailTools">
                        <span>TOOLS ///</span>

                        {project.tools.map((tool) => (
                            <b key={tool}>{tool}</b>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}