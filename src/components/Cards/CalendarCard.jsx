import "./CalenderCard.scss";
import {
  capitalizeWords,
  formatDateToYYYYMMDD,
} from "../../utils/usableFunctions";
import React, { useState, useMemo } from "react";

export default function CalendarCard({ events, onDateSelect, selectedDate }) {
  const today = new Date();
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const eventsByDate = useMemo(() => {
    const map = {};
    for (const ev of events) {
      map[ev.date] = map[ev.date] || [];
      map[ev.date].push(ev);
    }
    return map;
  }, [events]);

  function getMonthDays(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const arr = [];
    for (let i = 0; i < startDay; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(year, month, d));
    return arr;
  }

  function prevMonth() {
    setVisibleMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }
  function nextMonth() {
    setVisibleMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }

  function selectDate(dObj) {
    if (!dObj) return;
    const ymd = formatDateToYYYYMMDD(dObj);
    if (onDateSelect) onDateSelect(ymd);
    console.log("Selected Date:", ymd);
  }

  return (
    <aside className="calendar-card">
      <div className="cal-header">
        <h3>
          {visibleMonth.toLocaleString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <div className="cal-nav">
          <button onClick={prevMonth}>‹</button>
          <button onClick={nextMonth}>›</button>
        </div>
      </div>
      <div className="weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {getMonthDays(visibleMonth).map((d, idx) => {
          if (!d) return <div key={idx} className="blank" />;
          const ymd = formatDateToYYYYMMDD(d);
          const has = eventsByDate[ymd] && eventsByDate[ymd].length > 0;
          const active = ymd === selectedDate;
          return (
            <button
              key={idx}
              className={`day ${active ? "active" : ""}`}
              onClick={() => selectDate(d)}
            >
              <div className="day-num">{d.getDate()}</div>
              {has && (
                <div className="dots">
                  {(eventsByDate[ymd] || []).slice(0, 3).map((ev) => (
                    <span key={ev.id} className={`dot ${ev.color}`}></span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
