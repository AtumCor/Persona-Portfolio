import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./contact.css";

gsap.registerPlugin(ScrollTrigger);

const contactLinks = [
  {
    label: "EMAIL",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
  },
  {
    label: "LINKEDIN",
    value: "/IN/USERNAME",
    href: "#",
  },
  {
    label: "INSTAGRAM",
    value: "@USERNAME",
    href: "#",
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      tl.from(".contactNumber", {
        x: -140,
        autoAlpha: 0,
        duration: 0.55,
        ease: "back.out(1.6)",
      })
        .from(
          ".contactKicker",
          {
            x: -80,
            autoAlpha: 0,
            duration: 0.35,
          },
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
          {
            y: 40,
            autoAlpha: 0,
            duration: 0.4,
          },
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
    <section
      className="contactSection"
      id="contact"
      ref={sectionRef}
    >
      <div className="contactHeader">
        <span className="contactNumber">03</span>

        <div>
          <span className="contactKicker">
            FINAL TRANSMISSION ///
          </span>

          <h2 className="contactTitle">
            <span>GET IN</span>
            <span>TOUCH.</span>
          </h2>
        </div>

        <span className="contactStatus">
          CHANNEL
          <strong>OPEN</strong>
        </span>
      </div>

      <div className="contactLayout">
        <div className="contactMessage">
          <span className="contactMessageLabel">
            MESSAGE ///
          </span>

          <p className="contactIntro">
            LET'S TALK!
          </p>

          <p className="contactSubtext">
            Use this space for a short final
            invitation to reach out.
          </p>

          <a
            className="contactPrimary"
            href="mailto:hello@example.com"
          >
            <span>↗</span>
            SEND A MESSAGE
          </a>
        </div>

        <div className="contactLinks">
          {contactLinks.map((link, index) => (
            <a
              className="contactLink"
              href={link.href}
              key={link.label}
            >
              <span className="contactLinkNumber">
                0{index + 1}
              </span>

              <span className="contactLinkLabel">
                {link.label}
              </span>

              <strong>
                {link.value}
              </strong>

              <span className="contactLinkArrow">
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="contactFinal">
        <span>END OF FILE ///</span>

        <strong>
          LET&apos;S MAKE
          <br />
          SOMETHING LOUD.
        </strong>

        <span>03 / CONTACT</span>
      </div>
    </section>
  );
}