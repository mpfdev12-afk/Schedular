import React, { useMemo } from "react";
import { useOrgBranding } from "../../../context/OrgBrandingContext";
import "./EngagementHeatmap.scss";

/**
 * Renders a 7x24 heatmap grid representing activity density over the last 30 days.
 * @param {Array} data - Array of { dayOfWeek, hour, count }
 */
export default function EngagementHeatmap({ data = [] }) {
  const { branding } = useOrgBranding();
  
  // Mapping: Monday (0) to Sunday (6)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  // Transform raw MongoDB data into a 7x24 matrix
  const matrix = useMemo(() => {
    const m = Array.from({ length: 7 }, () => Array(24).fill(0));
    data.forEach((item) => {
      // MongoDB 1=Sun, 2=Mon... to 0=Mon, 6=Sun
      const dayIdx = (item.dayOfWeek + 5) % 7;
      const hourIdx = item.hour;
      if (dayIdx >= 0 && dayIdx < 7 && hourIdx >= 0 && hourIdx < 24) {
        m[dayIdx][hourIdx] += item.count;
      }
    });
    return m;
  }, [data]);

  const maxCount = useMemo(() => {
    let max = 0;
    matrix.forEach(row => row.forEach(val => { if (val > max) max = val; }));
    return max || 1;
  }, [matrix]);

  return (
    <div className="engagement-heatmap-container">
      <div className="heatmap-header">
        <h5>Activity Intensity (24h Window)</h5>
        <div className="heatmap-legend">
          <span>Less</span>
          <div className="legend-strip" style={{ background: branding?.primaryColor || "#1a56db" }}></div>
          <span>More</span>
        </div>
      </div>

      <div className="heatmap-wrapper">
        <div className="hour-labels">
          {hours.filter((_, i) => i % 3 === 0).map(h => <span key={h}>{h}</span>)}
        </div>
        
        <div className="heatmap-grid">
          {matrix.map((row, dIdx) => (
            <div key={days[dIdx]} className="heatmap-row">
              <div className="day-label">{days[dIdx]}</div>
              <div className="tiles">
                {row.map((count, hIdx) => {
                  const intensity = count / maxCount;
                  return (
                    <div
                      key={hIdx}
                      className="heatmap-tile"
                      style={{
                        backgroundColor: branding?.primaryColor || "#1a56db",
                        opacity: intensity > 0 ? 0.1 + intensity * 0.9 : 0.05,
                      }}
                      title={`${days[dIdx]}, ${hIdx}:00 - ${count} activities`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
