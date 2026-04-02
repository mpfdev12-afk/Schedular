import React, { useState, useEffect } from "react";
import DetoxToolkit from "./DetoxToolkit";
import "./DetoxFAB.scss";

export default function DetoxFAB() {
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Gentle attention pulse every 45s when closed
  useEffect(() => {
    if (open) return;
    const timer = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 2000);
    }, 45000);
    // Initial pulse after 8s
    const init = setTimeout(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 2000);
    }, 8000);
    return () => { clearInterval(timer); clearTimeout(init); };
  }, [open]);

  return (
    <>
      <button
        className={`detox-fab ${pulse ? "pulse" : ""} ${open ? "active" : ""}`}
        onClick={() => setOpen(true)}
        aria-label="Open Detox Mode"
        title="Take a mindful break"
      >
        {/* Lotus SVG icon */}
        <svg viewBox="0 0 48 48" className="fab-icon" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lotusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="fabGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Center petal */}
          <path d="M24 8 C20 16, 20 24, 24 32 C28 24, 28 16, 24 8Z" fill="url(#lotusGrad)" opacity="0.9" filter="url(#fabGlow)" />
          {/* Left petal */}
          <path d="M24 20 C16 12, 8 16, 10 24 C12 28, 18 28, 24 24Z" fill="url(#lotusGrad)" opacity="0.7" />
          {/* Right petal */}
          <path d="M24 20 C32 12, 40 16, 38 24 C36 28, 30 28, 24 24Z" fill="url(#lotusGrad)" opacity="0.7" />
          {/* Outer left */}
          <path d="M18 24 C10 18, 4 22, 6 28 C8 30, 14 30, 18 26Z" fill="url(#lotusGrad)" opacity="0.45" />
          {/* Outer right */}
          <path d="M30 24 C38 18, 44 22, 42 28 C40 30, 34 30, 30 26Z" fill="url(#lotusGrad)" opacity="0.45" />
          {/* Base */}
          <path d="M16 30 Q24 36, 32 30" stroke="url(#lotusGrad)" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
        <span className="fab-label">Detox</span>
      </button>

      {open && <DetoxToolkit onClose={() => setOpen(false)} />}
    </>
  );
}

