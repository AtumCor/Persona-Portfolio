import PageTransition from "./components/PageTransition/PageTransition";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./home.css";

const navItems = [
    { index: "01", label: "WORK" },
    { index: "02", label: "ABOUT" },
    { index: "03", label: "CONTACT" },
];
export default function Home() {
    const pageRef = useRef<HTMLElement>(null);
    const transitionRef = useRef<HTMLDivElement>(null);
    const transitionTextRef = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        const page = pageRef.current;

        if (!page) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: {
                    ease: "power4.out",
                },
            });

            gsap.set(".heroEyebrow", {
                autoAlpha: 0,
                x: -120,
                rotation: -8,
            });

            gsap.set(".heroTitleTop", {
                autoAlpha: 0,
                x: -180,
                rotation: -10,
            });

            gsap.set(".heroTitleAccent", {
                autoAlpha: 0,
                x: -220,
                scale: 1.2,
            });

            gsap.set(".heroTitleBottom", {
                autoAlpha: 0,
                x: -160,
                y: 40,
                rotation: -12,
            });

            gsap.set(".heroIntro", {
                autoAlpha: 0,
                y: 30,
            });

            gsap.set(".heroCta", {
                autoAlpha: 0,
                y: 50,
                rotation: -5,
            });

            gsap.set(".visualBurstBack", {
                scale: 0,
                rotation: -40,
            });

            gsap.set(".visualBurstFront", {
                scale: 0,
                rotation: 35,
            });

            gsap.set(".portraitFrame", {
                autoAlpha: 0,
                scale: 0.65,
                rotation: 16,
                x: 100,
            });

            gsap.set(".visualStickerOne", {
                autoAlpha: 0,
                scale: 0,
                rotation: 25,
            });

            gsap.set(".visualStickerTwo", {
                autoAlpha: 0,
                scale: 0,
                rotation: -25,
            });

            gsap.set(".personaNavItem", {
                autoAlpha: 0,
                x: 160,
            });

            gsap.set(".heroFooter", {
                autoAlpha: 0,
                y: 20,
            });

            gsap.set(".personaSlashOne", {
                xPercent: 120,
            });

            gsap.set(".personaSlashTwo", {
                xPercent: -120,
            });

            tl.to(
                ".personaSlashOne",
                {
                    xPercent: 0,
                    duration: 0.7,
                },
                0,
            )
                .to(
                    ".personaSlashTwo",
                    {
                        xPercent: 0,
                        duration: 0.8,
                    },
                    0.1,
                )
                .to(
                    ".heroEyebrow",
                    {
                        autoAlpha: 1,
                        x: 0,
                        rotation: -2,
                        duration: 0.45,
                    },
                    0.25,
                )
                .to(
                    ".heroTitleTop",
                    {
                        autoAlpha: 1,
                        x: 0,
                        rotation: -2,
                        duration: 0.5,
                    },
                    0.35,
                )
                .to(
                    ".heroTitleAccent",
                    {
                        autoAlpha: 1,
                        x: 0,
                        scale: 1,
                        duration: 0.45,
                    },
                    0.48,
                )
                .to(
                    ".heroTitleBottom",
                    {
                        autoAlpha: 1,
                        x: 0,
                        y: 0,
                        rotation: -4,
                        duration: 0.45,
                    },
                    0.62,
                )
                .to(
                    ".visualBurstBack",
                    {
                        scale: 1,
                        rotation: 4,
                        duration: 0.7,
                        ease: "back.out(1.5)",
                    },
                    0.42,
                )
                .to(
                    ".visualBurstFront",
                    {
                        scale: 1,
                        rotation: -7,
                        duration: 0.65,
                        ease: "back.out(1.7)",
                    },
                    0.5,
                )
                .to(
                    ".portraitFrame",
                    {
                        autoAlpha: 1,
                        scale: 1,
                        rotation: 3,
                        x: 0,
                        duration: 0.7,
                        ease: "back.out(1.35)",
                    },
                    0.65,
                )
                .to(
                    ".visualStickerOne",
                    {
                        autoAlpha: 1,
                        scale: 1,
                        rotation: 8,
                        duration: 0.35,
                        ease: "back.out(2.4)",
                    },
                    1.05,
                )
                .to(
                    ".visualStickerTwo",
                    {
                        autoAlpha: 1,
                        scale: 1,
                        rotation: -8,
                        duration: 0.35,
                        ease: "back.out(2.4)",
                    },
                    1.12,
                )
                .to(
                    ".personaNavItem",
                    {
                        autoAlpha: 1,
                        x: 0,
                        duration: 0.35,
                        stagger: 0.08,
                    },
                    0.8,
                )
                .to(
                    ".heroIntro",
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.4,
                    },
                    1.1,
                )
                .to(
                    ".heroCta",
                    {
                        autoAlpha: 1,
                        y: 0,
                        rotation: -1,
                        duration: 0.45,
                    },
                    1.2,
                )
                .to(
                    ".heroFooter",
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.4,
                    },
                    1.35,
                );
        }, pageRef);

        // Parallax
        const moveCopyX = gsap.quickTo(".heroCopy", "x", {
            duration: 0.8,
            ease: "power3.out",
        });

        const moveCopyY = gsap.quickTo(".heroCopy", "y", {
            duration: 0.8,
            ease: "power3.out",
        });

        const moveVisualX = gsap.quickTo(".heroVisual", "x", {
            duration: 1,
            ease: "power3.out",
        });

        const moveVisualY = gsap.quickTo(".heroVisual", "y", {
            duration: 1,
            ease: "power3.out",
        });

        const moveNavX = gsap.quickTo(".personaNav", "x", {
            duration: 0.9,
            ease: "power3.out",
        });

        const moveNavY = gsap.quickTo(".personaNav", "y", {
            duration: 0.9,
            ease: "power3.out",
        });

        const handlePointerMove = (event: PointerEvent) => {
            const rect = page.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) / rect.width - 0.5;

            const y =
                (event.clientY - rect.top) / rect.height - 0.5;

            moveCopyX(x * -10);
            moveCopyY(y * -8);

            moveVisualX(x * 24);
            moveVisualY(y * 18);

            moveNavX(x * 8);
            moveNavY(y * 6);
        };

        const handlePointerLeave = () => {
            moveCopyX(0);
            moveCopyY(0);

            moveVisualX(0);
            moveVisualY(0);

            moveNavX(0);
            moveNavY(0);
        };

        page.addEventListener("pointermove", handlePointerMove);
        page.addEventListener("pointerleave", handlePointerLeave);

        return () => {
            page.removeEventListener(
                "pointermove",
                handlePointerMove,
            );

            page.removeEventListener(
                "pointerleave",
                handlePointerLeave,
            );

            ctx.revert();
        };
    }, []);

    const handleSectionEnter = (
        sectionId: string,
        label: string,
        event?: React.MouseEvent<HTMLElement>,
    ) => {
        event?.preventDefault();

        const transition = transitionRef.current;
        const section = document.querySelector(sectionId);

        if (!transition || !section) return;

        if (transitionTextRef.current) {
            transitionTextRef.current.textContent = label;
        }

        gsap.killTweensOf(transition);

        gsap.set(transition, {
            display: "block",
            xPercent: -120,
        });

        gsap
            .timeline({
                onComplete: () => {
                    gsap.set(transition, {
                        display: "none",
                    });
                },
            })
            .to(transition, {
                xPercent: 0,
                duration: 0.45,
                ease: "power4.in",
            })
            .add(() => {
                section.scrollIntoView({
                    behavior: "auto",
                    block: "start",
                });
            })
            .to(transition, {
                xPercent: 120,
                duration: 0.55,
                ease: "power4.out",
            });
    };
    return (
        <>
            <PageTransition
                ref={transitionRef}
                label="01 / WORK"
            />

            <main className="personaHome" ref={pageRef}>
                <div className="personaNoise" aria-hidden="true" />

                <div
                    className="personaSlash personaSlashOne"
                    aria-hidden="true"
                />

                <div
                    className="personaSlash personaSlashTwo"
                    aria-hidden="true"
                />

                <section className="personaHero">
                    <div className="heroCopy">
                        <div className="heroEyebrow">
                            <span>CREATIVE PORTFOLIO</span>
                            <span className="heroEyebrowMark">///</span>
                        </div>

                        <h1 className="heroTitle">
                            <span className="heroTitleTop">MAKE</span>
                            <span className="heroTitleAccent">
                                SOMETHING
                            </span>
                            <span className="heroTitleBottom">
                                LOUD.
                            </span>
                        </h1>

                        <p className="heroIntro">
                            A hyper-stylized portfolio for projects,
                            experiments, and ideas.
                        </p>

                        <button
                            className="heroCta"
                            type="button"
                            onClick={(event) =>
                                handleSectionEnter(
                                    "#work",
                                    "01 / WORK",
                                    event,
                                )
                            }
                        >
                            <span className="heroCtaArrow">↗</span>
                            <span>ENTER THE ARCHIVE</span>
                        </button>
                    </div>

                    <div className="heroVisual" aria-hidden="true">
                        <div className="visualBurst visualBurstBack" />
                        <div className="visualBurst visualBurstFront" />

                        <div className="portraitFrame">
                            <div className="portraitPlaceholder">
                                <span>PORTRAIT</span>
                                <small>/ CHARACTER ART /</small>
                            </div>
                        </div>

                        <div className="visualSticker visualStickerOne">
                            SELECT
                            <br />
                            YOUR
                            <br />
                            PATH
                        </div>

                        <div className="visualSticker visualStickerTwo">
                            NO. 00
                        </div>
                    </div>

                    <nav
                        className="personaNav"
                        aria-label="Primary navigation"
                    >
                        {navItems.map((item) => (
                            <a
                                className="personaNavItem"
                                href={`#${item.label.toLowerCase()}`}
                                key={item.index}
                                onClick={
                                    item.label === "WORK"
                                        ? (event) =>
                                            handleSectionEnter(
                                                "#work",
                                                "01 / WORK",
                                                event,
                                            )
                                        : item.label === "ABOUT"
                                            ? (event) =>
                                                handleSectionEnter(
                                                    "#about",
                                                    "02 / ABOUT",
                                                    event,
                                                )
                                            : item.label === "CONTACT"
                                                ? (event) =>
                                                    handleSectionEnter(
                                                        "#contact",
                                                        "03 / CONTACT",
                                                        event,
                                                    )
                                                : undefined
                                }
                            >
                                <span className="personaNavIndex">
                                    {item.index}
                                </span>

                                <span className="personaNavLabel">
                                    {item.label}
                                </span>

                                <span className="personaNavArrow">
                                    →
                                </span>
                            </a>
                        ))}
                    </nav>

                    <div className="heroFooter">
                        <span>SCROLL TO INVESTIGATE</span>
                        <span className="heroFooterLine" />
                        <span>2026</span>
                    </div>
                </section>
            </main>
        </>
    );
}