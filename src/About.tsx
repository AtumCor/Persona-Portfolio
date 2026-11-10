import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "./data/site";
import "./about.css";

gsap.registerPlugin(ScrollTrigger);

const skills = site.about.specialties;

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

      gsap.from(".aboutCharacterStage", {
        x: -90,
        y: 35,
        scale: 0.92,
        autoAlpha: 0,
        duration: 0.85,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".aboutCharacterStage",
          start: "top 82%",
          once: true,
        },
      });

      gsap.from(".aboutInfoBox", {
        x: 90,
        autoAlpha: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".aboutInfoStack",
          start: "top 82%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="aboutSection" id="about" ref={sectionRef}>
      <div className="aboutHeader">
        <span className="aboutNumber">01</span>

        <div>
          <span className="aboutKicker">PROFILE DATA ///</span>
          <h2 className="aboutTitle">ABOUT</h2>
        </div>

        <span className="aboutStatus">
          STATUS
          <strong>ACTIVE</strong>
        </span>
      </div>

      <div className="aboutLayout">
        <div className="aboutCharacterStage">
          <img
            className="aboutCharacterImage"
            src={site.about.portraitImage}
            alt="Profile portrait"
          />

          <div className="aboutCharacterName">
            <span>PLAYER</span>
            <strong>00</strong>
          </div>

          <div className="aboutCharacterReadout">
            <span>PROFILE</span>
            <strong>LV. 01</strong>
          </div>
        </div>

        <div className="aboutInfoStack">
          <article className="aboutInfoBox aboutNameBox">
            <span className="aboutBoxLabel">NAME ///</span>
            <h3>{site.owner.name}</h3>
          </article>

          <article className="aboutInfoBox aboutDescriptionBox">
            <span className="aboutBoxLabel">DESCRIPTION ///</span>
            <p>{site.about.bio}</p>
          </article>

          <article className="aboutInfoBox aboutSkillsBox">
            <div className="aboutSkillsHeader">
              <span className="aboutBoxLabel">SKILLS ///</span>
              <span className="aboutSkillsHint">SELECT YOUR SKILLS</span>
            </div>

            <div className="aboutSkillList">
              {skills.map((skill, index) => (
                <div className="aboutSkillItem" key={skill}>
                  <span className="aboutSkillNumber">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="aboutSkillName">{skill}</span>

                  <span className="aboutSkillArrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>

      <div className="aboutFooterNote">
        <span>PROFILE // 01</span>
        <strong>KEEP MAKING WEIRD THINGS.</strong>
      </div>
    </section>
  );
}
