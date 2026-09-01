import { forwardRef, type Ref } from "react";
import "./PageTransition.css";

type PageTransitionProps = {
    label: string;
    textRef?: Ref<HTMLSpanElement>;
    reverse?: boolean;
};

const PageTransition = forwardRef<
    HTMLDivElement,
    PageTransitionProps
>(({ label, textRef, reverse = false }, ref) => {
    return (
        <div
            className={`pageTransition${reverse ? " pageTransitionReverse" : ""}`}
            ref={ref}
            aria-hidden="true"
        >
            <div className="pageTransitionStripe" />

            <span
                className="pageTransitionText"
                ref={textRef}
            >
                {label}
            </span>
        </div>
    );
});

PageTransition.displayName = "PageTransition";

export default PageTransition;