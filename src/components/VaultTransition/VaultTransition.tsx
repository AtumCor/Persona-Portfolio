import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import "./vaultTransition.css";

type VaultDirection = "enter" | "exit";
type VaultActions = {
  enterArchive: () => void;
  returnToWork: () => void;
};

const VaultContext = createContext<VaultActions | null>(null);

export function useVaultTransition(): VaultActions {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error("useVaultTransition requires VaultTransitionProvider");
  }
  return context;
}

/** Mounted outside <Routes>, so the vault stays on screen during navigation. */
export function VaultTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  const [direction, setDirection] = useState<VaultDirection | null>(null);
  const busyRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLSpanElement>(null);

  // Always play the vault transition, including when Windows disables animations.
  const start = useCallback((next: VaultDirection) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setDirection(next);
  }, []);

  const enterArchive = useCallback(() => start("enter"), [start]);
  const returnToWork = useCallback(() => start("exit"), [start]);

  useLayoutEffect(() => {
    if (!direction) return;

    const overlay = overlayRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const wheel = wheelRef.current;
    const lock = lockRef.current;
    const frame = frameRef.current;
    const caption = captionRef.current;

    if (!overlay || !left || !right || !wheel || !lock || !frame || !caption) {
      busyRef.current = false;
      setDirection(null);
      return;
    }

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const destination = direction === "enter" ? "/archive" : "/#work";
    let navigated = false;
    const changePage = () => {
      if (navigated) return;
      navigated = true;
      navigateRef.current(destination);
      if (direction === "enter") {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    };

    // New vault doors always BEGIN off screen. Unlike the previous implementation,
    // the first thing visitors see is a physical door closing over their page.
    gsap.set(overlay, { autoAlpha: 1 });
    gsap.set(left, { xPercent: -106 });
    gsap.set(right, { xPercent: 106 });
    gsap.set(lock, { autoAlpha: 0 });
    gsap.set(frame, { scale: 0.7 });
    gsap.set(caption, { autoAlpha: 0, y: 12 });
    gsap.set(wheel, { rotation: direction === "enter" ? -105 : 125 });

    const timeline = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = oldOverflow;
        busyRef.current = false;
        setDirection(null);
      },
    });

    timeline
      // 00: large metallic slabs enter visibly from both screen edges.
      .to(left, { xPercent: 0, duration: 0.84, ease: "power4.inOut" }, 0)
      .to(right, { xPercent: 0, duration: 0.84, ease: "power4.inOut" }, 0)
      // 01: a heavy circular lock materializes after the central seam seals.
      .to(lock, { autoAlpha: 1, duration: 0.22 }, 0.68)
      .to(frame, { scale: 1, duration: 0.39, ease: "back.out(1.5)" }, 0.72)
      .to(caption, { autoAlpha: 1, y: 0, duration: 0.18 }, 0.79)
      // 02: the handle turns: unlock on the way in, lock on the way back.
      .to(wheel, {
        rotation: direction === "enter" ? 145 : 0,
        duration: 0.55,
        ease: "power3.inOut",
      }, 0.99)
      .to(frame, { scale: 1.06, duration: 0.1, yoyo: true, repeat: 1 }, 1.48)
      // 03: switch routes ONLY after the doors are fully closed.
      .add(changePage, 1.70)
      // 04: open the vault to reveal the destination, with the overlay still mounted.
      .to(lock, { autoAlpha: 0, duration: 0.18 }, 1.79)
      .to(left, { xPercent: -106, duration: 1.03, ease: "power3.inOut" }, 1.91)
      .to(right, { xPercent: 106, duration: 1.03, ease: "power3.inOut" }, 1.91)
      .set(overlay, { autoAlpha: 0 }, 2.97);

    return () => {
      timeline.kill();
      document.body.style.overflow = oldOverflow;
    };
  }, [direction]);

  return (
    <VaultContext.Provider value={{ enterArchive, returnToWork }}>
      {children}
      {direction && (
        <div
          ref={overlayRef}
          className={`vaultTransition vaultTransition--${direction}`}
          data-vault-transition="active"
          aria-hidden="true"
        >
          <div className="vaultBackdrop" />
          <div ref={leftRef} className="vaultDoor vaultDoor--left">
            <div className="vaultDoorRivets" />
            <div className="vaultDoorInset" />
            <div className="vaultDoorMark">00 / SECURE</div>
          </div>
          <div ref={rightRef} className="vaultDoor vaultDoor--right">
            <div className="vaultDoorRivets" />
            <div className="vaultDoorInset" />
            <div className="vaultDoorMark">PERSONA / FILES</div>
          </div>
          <div ref={lockRef} className="vaultLock">
            <div ref={frameRef} className="vaultLockFrame">
              <div ref={wheelRef} className="vaultWheel">
                <span className="vaultWheelSpoke vaultWheelSpoke--one" />
                <span className="vaultWheelSpoke vaultWheelSpoke--two" />
                <span className="vaultWheelSpoke vaultWheelSpoke--three" />
                <span className="vaultWheelSpoke vaultWheelSpoke--four" />
                <span className="vaultWheelHub" />
              </div>
            </div>
            <span ref={captionRef} className="vaultLockLabel">
              {direction === "enter" ? "UNLOCKING // ARCHIVE" : "LOCKING // ARCHIVE"}
            </span>
          </div>
        </div>
      )}
    </VaultContext.Provider>
  );
}
