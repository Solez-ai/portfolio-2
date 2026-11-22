import { useEffect, useRef, useState } from "react";

type CursorVariant = "default" | "pointer" | "text" | "grab" | "grabbing";

const HOTSPOT: Record<CursorVariant, [number, number]> = {
  default: [-3, -2],
  pointer: [-7, -2],
  text: [-7, -11],
  grab: [-10, -10],
  grabbing: [-10, -10],
};

function resolveVariant(target: EventTarget | null, isMouseDown: boolean): CursorVariant {
  if (!(target instanceof Element)) return "default";
  if (target.closest("[data-cursor-dragging='true']")) return "grabbing";
  if (target.closest("a, button, [role='button'], select, label, summary, .cursor-hover")) {
    return "pointer";
  }
  if (target.closest("input[type='text'], input[type='email'], input[type='search'], input[type='url'], input[type='password'], textarea, [contenteditable='true']")) {
    return "text";
  }
  if (target.closest("[data-cursor='grab']")) {
    return isMouseDown ? "grabbing" : "grab";
  }
  return "default";
}

export function Cursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");

  const variantRef = useRef<CursorVariant>("default");
  const posRef = useRef({ x: -100, y: -100 });
  const downRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);

    const updateTransform = () => {
      const el = wrapRef.current;
      if (!el) return;
      const [ox, oy] = HOTSPOT[variantRef.current];
      el.style.transform = `translate3d(${posRef.current.x + ox}px, ${posRef.current.y + oy}px, 0)`;
    };

    const setNextVariant = (next: CursorVariant) => {
      if (next !== variantRef.current) {
        variantRef.current = next;
        setVariant(next);
        updateTransform();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      setVisible(true);
      updateTransform();
      setNextVariant(resolveVariant(e.target, downRef.current));
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      downRef.current = true;
      innerRef.current?.classList.add("is-pressed");
      setNextVariant(resolveVariant(e.target, true));
    };

    const onPointerUp = (e: PointerEvent) => {
      downRef.current = false;
      innerRef.current?.classList.remove("is-pressed");
      setNextVariant(resolveVariant(e.target, false));
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("blur", onLeave);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("blur", onLeave);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={wrapRef}
      className="macos-cursor"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    >
      <div ref={innerRef} className="macos-cursor-inner">
        {variant === "default" && (
          /* Authentic macOS Arrow Pointer */
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4.2 2.4L4.2 19.2L8.35 15.15L11.2 21.15C11.45 21.65 12.05 21.85 12.55 21.6L13.75 21.0C14.25 20.75 14.45 20.15 14.2 19.65L11.35 13.75L16.75 13.75L4.2 2.4Z"
              fill="#0A0A0A"
              stroke="#FFFFFF"
              strokeWidth="1.45"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {variant === "pointer" && (
          /* Authentic macOS Pointing Hand */
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9.2 3.2C9.2 2.35 9.85 1.7 10.65 1.7C11.45 1.7 12.1 2.35 12.1 3.2V9.1C12.35 8.85 12.75 8.7 13.15 8.7C13.95 8.7 14.55 9.25 14.65 10.0C14.95 9.75 15.35 9.6 15.8 9.6C16.55 9.6 17.15 10.15 17.25 10.9C17.5 10.75 17.8 10.65 18.15 10.65C18.95 10.65 19.6 11.3 19.6 12.1V15.4C19.6 18.7 17.25 21.3 13.85 21.3H12.2C9.9 21.3 8.1 20.1 6.85 18.1L4.15 13.95C3.7 13.25 3.9 12.3 4.6 11.85C5.25 11.45 6.15 11.6 6.6 12.25L8.2 14.35L9.2 14.35V3.2Z"
              fill="#FFFFFF"
              stroke="#0A0A0A"
              strokeWidth="1.35"
              strokeLinejoin="round"
            />
            <path d="M12.1 9.1V12.2" stroke="#0A0A0A" strokeWidth="1.1" strokeLinecap="round" />
            <path d="M14.65 10.0V12.5" stroke="#0A0A0A" strokeWidth="1.1" strokeLinecap="round" />
            <path d="M17.25 10.9V12.9" stroke="#0A0A0A" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
        )}

        {variant === "grab" && (
          /* Authentic macOS Open Hand */
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M8.1 10.6V6.2C8.1 5.45 8.7 4.85 9.45 4.85C10.2 4.85 10.8 5.45 10.8 6.2V9.6V4.9C10.8 4.15 11.4 3.55 12.15 3.55C12.9 3.55 13.5 4.15 13.5 4.9V9.6V5.7C13.5 4.95 14.1 4.35 14.85 4.35C15.6 4.35 16.2 4.95 16.2 5.7V10.1V7.6C16.2 6.85 16.8 6.25 17.55 6.25C18.3 6.25 18.9 6.85 18.9 7.6V14.4C18.9 17.9 16.45 20.5 13.0 20.5H11.6C9.3 20.5 7.55 19.35 6.3 17.35L4.35 14.2C3.95 13.55 4.15 12.7 4.8 12.3C5.45 11.9 6.3 12.1 6.7 12.75L8.1 14.6V10.6Z"
              fill="#FFFFFF"
              stroke="#0A0A0A"
              strokeWidth="1.35"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {variant === "grabbing" && (
          /* Authentic macOS Closed Hand */
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M7.6 12.2V9.4C7.6 8.6 8.25 7.95 9.05 7.95C9.85 7.95 10.5 8.6 10.5 9.4V8.4C10.5 7.6 11.15 6.95 11.95 6.95C12.75 6.95 13.4 7.6 13.4 8.4V8.8C13.4 8.0 14.05 7.35 14.85 7.35C15.65 7.35 16.3 8.0 16.3 8.8V9.8C16.3 9.05 16.9 8.45 17.65 8.45C18.4 8.45 19.0 9.05 19.0 9.8V14.1C19.0 17.5 16.55 20.1 13.1 20.1H11.6C9.45 20.1 7.75 19.0 6.55 17.1L5.1 14.65C4.7 14.0 4.9 13.15 5.55 12.75C6.2 12.35 7.05 12.55 7.45 13.2L7.6 13.45V12.2Z"
              fill="#FFFFFF"
              stroke="#0A0A0A"
              strokeWidth="1.35"
              strokeLinejoin="round"
            />
            <path d="M10.5 9.4V12.3" stroke="#0A0A0A" strokeWidth="1.1" strokeLinecap="round" />
            <path d="M13.4 8.8V12.2" stroke="#0A0A0A" strokeWidth="1.1" strokeLinecap="round" />
            <path d="M16.3 9.8V12.4" stroke="#0A0A0A" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
        )}

        {variant === "text" && (
          /* Authentic macOS I-Beam */
          <svg width="16" height="22" viewBox="0 0 16 22" fill="none">
            <path
              d="M4.5 2.5C6.1 2.5 7.3 3.2 8 4.4C8.7 3.2 9.9 2.5 11.5 2.5M4.5 19.5C6.1 19.5 7.3 18.8 8 17.6C8.7 18.8 9.9 19.5 11.5 19.5M8 4.2V17.8"
              stroke="#FFFFFF"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.5 2.5C6.1 2.5 7.3 3.2 8 4.4C8.7 3.2 9.9 2.5 11.5 2.5M4.5 19.5C6.1 19.5 7.3 18.8 8 17.6C8.7 18.8 9.9 19.5 11.5 19.5M8 4.2V17.8"
              stroke="#0A0A0A"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
