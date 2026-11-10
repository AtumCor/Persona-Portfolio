import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "./data/site";
import "./contact.css";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const { contact } = site;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      });

      tl.from(".contactNumber", {
        x: -140,
        autoAlpha: 0,
        duration: 0.55,
        ease: "back.out(1.6)",
      })
        .from(
          ".contactKicker",
          { x: -80, autoAlpha: 0, duration: 0.35 },
          "-=0.2",
        )
        .from(
          ".contactTitle span",
          {
            x: 180,
            autoAlpha: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: "power4.out",
          },
          "-=0.2",
        )
        .from(
          ".contactIntro",
          { y: 40, autoAlpha: 0, duration: 0.4 },
          "-=0.2",
        );

      gsap.from(".contactLink", {
        x: 120,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.55,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".contactLinks",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from(".contactFinal", {
        scale: 0.8,
        rotation: -6,
        autoAlpha: 0,
        duration: 0.65,
        ease: "back.out(1.6)",
        scrollTrigger: {
          trigger: ".contactFinal",
          start: "top 88%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="contactSection" id="contact" ref={sectionRef}>
      <div className="contactHeader">
        <span className="contactNumber">{contact.number}</span>
        <div>
          <span className="contactKicker">{contact.kicker}</span>
          <h2 className="contactTitle">
            <span>{contact.titleTop}</span>
            <span>{contact.titleBottom}</span>
          </h2>
        </div>
        <span className="contactStatus">
          {contact.statusLabel}
          <strong>{contact.statusValue}</strong>
        </span>
      </div>

      <div className="contactLayout">
        <div className="contactMessage">
          <span className="contactMessageLabel">{contact.messageLabel}</span>
          <p className="contactIntro">{contact.intro}</p>
          <p className="contactSubtext">{contact.subtext}</p>
          <a className="contactPrimary" href={`mailto:${contact.email}`}>
            <span>↗</span>
            {contact.buttonText}
          </a>
        </div>

        <div className="contactLinks">
          {contact.links.map((link, index) => (
            <a
              className="contactLink"
              href={link.href}
              key={link.label}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            >
              <span className="contactLinkNumber">0{index + 1}</span>
              <span className="contactLinkLabel">{link.label}</span>
              <strong>{link.value}</strong>
              <span className="contactLinkArrow">↗</span>
            </a>
          ))}
        </div>
      </div>

      <div className="contactFinal">
        <span>{contact.finalLabel}</span>
        <strong>
          {contact.finalMessageTop}
          <br />
          {contact.finalMessageBottom}
        </strong>
        <span>{contact.footerLabel}</span>
      </div>
    </section>
  );
}
