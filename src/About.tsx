import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./about.css";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    label: "CREATIVE DIRECTION",
    value: 92,
  },
  {
    label: "DEVELOPMENT",
    value: 86,
  },
  {
    label: "DESIGN",
    value: 88,
  },
  {
    label: "EXPERIMENTATION",
    value: 95,
  },
];

const specialties = [
  "INTERACTION",
  "MOTION",
  "WEB",
  "VISUAL SYSTEMS",
  "EXPERIMENTS",
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(".aboutNumber", {
        x: -140,
        autoAlpha: 0,
        duration: 0.6,
        ease: "back.out(1.6)",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      gsap.from(".aboutTitle", {
        x: 180,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power4.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      gsap.from(".aboutPortrait", {
        scale: 0.7,
        rotation: -12,
        autoAlpha: 0,
        duration: 0.7,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: ".aboutPortrait",
          start: "top 82%",
          once: true,
        },
      });

      gsap.from(".aboutInfoPanel", {
        x: 100,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".aboutInfoPanel",
          start: "top 82%",
          once: true,
        },
      });

      gsap.from(".aboutStatFill", {
        width: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".aboutStats",
          start: "top 85%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="aboutSection"
      id="about"
      ref={sectionRef}
    >
      <div className="aboutHeader">
        <span className="aboutNumber">02</span>

        <div>
          <span className="aboutKicker">
            PROFILE DATA ///
          </span>

          <h2 className="aboutTitle">
            ABOUT
          </h2>
        </div>

        <span className="aboutStatus">
          STATUS
          <strong>ACTIVE</strong>
        </span>
      </div>

      <div className="aboutLayout">
        <div className="aboutPortrait">
          <div className="aboutPortraitInner">
            <span>PORTRAIT</span>

            <small>
              / CHARACTER ART /
            </small>
          </div>

          <span className="aboutPortraitTag">
            PLAYER 00
          </span>
        </div>

        <div className="aboutInfoPanel">
          <span className="aboutLabel">
            IDENTITY ///
          </span>

          <h3>
            CREATIVE
            <span>PROFILE</span>
          </h3>

          <p className="aboutBio">
            A short introduction goes here. Use
            this space to describe the person,
            their creative interests, and what
            kind of work they enjoy making.
          </p>

          <div className="aboutSpecialties">
            {specialties.map((specialty) => (
              <span key={specialty}>
                {specialty}
              </span>
            ))}
          </div>

          <div className="aboutStats">
            {stats.map((stat) => (
              <div
                className="aboutStat"
                key={stat.label}
              >
                <div className="aboutStatHeader">
                  <span>{stat.label}</span>

                  <strong>
                    {stat.value}
                  </strong>
                </div>

                <div className="aboutStatTrack">
                  <div
                    className="aboutStatFill"
                    style={{
                      width: `${stat.value}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="aboutFooterNote">
        <span>PROFILE // 02</span>

        <strong>
          KEEP MAKING WEIRD THINGS.
        </strong>
      </div>
    </section>
  );
}