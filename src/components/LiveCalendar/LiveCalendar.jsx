import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./LiveCalendar.scss";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Generates a stable set of "event" dates from a seed so they look
// like real bookings without fetching any data.
function seededEvents(year, month, today) {
  const seed = year * 100 + month;
  const count = (seed % 5) + 4; // 4-8 events
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates = new Set();
  let n = seed;
  while (dates.size < count) {
    n = (n * 1664525 + 1013904223) & 0xffffffff;
    const d = (Math.abs(n) % daysInMonth) + 1;
    if (d !== today) dates.add(d);
  }
  return dates;
}

// Assigns a "type" color to each event date (mental / physical / financial)
function eventColor(date, month) {
  const types = ["mental", "physical", "financial"];
  return types[(date + month) % 3];
}

function buildGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function LiveCalendar() {
  const now = new Date();
  const [time, setTime] = useState(now);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const year  = time.getFullYear();
  const month = time.getMonth();
  const today = time.getDate();
  const hours = time.getHours();
  const mins  = String(time.getMinutes()).padStart(2, "0");
  const ampm  = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  const dayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][time.getDay()];

  const cells  = useMemo(() => buildGrid(year, month), [year, month]);
  const events = useMemo(() => seededEvents(year, month, today), [year, month, today]);

  return (
    <div className="live-cal">
      {/* ── Header ─────────────────────────────────── */}
      <div className="live-cal__header">
        <div className="live-cal__month-row">
          <span className="live-cal__month">{MONTHS[month]}</span>
          <span className="live-cal__year">{year}</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${hour12}${ampm}`}
            className="live-cal__clock"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.4 }}
          >
            {hour12}:{mins}
            <span className="live-cal__ampm">{ampm}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Today badge ────────────────────────────── */}
      <div className="live-cal__today-strip">
        <span className="live-cal__dot live-cal__dot--pulse" />
        <span className="live-cal__today-text">Today · {dayName}</span>
      </div>

      {/* ── Day labels ─────────────────────────────── */}
      <div className="live-cal__grid live-cal__grid--labels">
        {DAYS.map((d) => (
          <span key={d} className="live-cal__day-label">{d}</span>
        ))}
      </div>

      {/* ── Date grid ──────────────────────────────── */}
      <div className="live-cal__grid">
        {cells.map((d, i) => {
          const isToday   = d === today;
          const hasEvent  = d && events.has(d);
          const evColor   = hasEvent ? eventColor(d, month) : null;
          return (
            <div
              key={i}
              className={[
                "live-cal__cell",
                d      ? "live-cal__cell--active"  : "live-cal__cell--empty",
                isToday ? "live-cal__cell--today"   : "",
              ].join(" ")}
            >
              {d && (
                <>
                  <span className="live-cal__date-num">{d}</span>
                  {hasEvent && (
                    <span className={`live-cal__event-dot live-cal__event-dot--${evColor}`} />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Legend ─────────────────────────────────── */}
      <div className="live-cal__legend">
        {[["mental","Mental"],["physical","Physical"],["financial","Financial"]].map(([key, label]) => (
          <span key={key} className="live-cal__legend-item">
            <span className={`live-cal__legend-dot live-cal__event-dot--${key}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
