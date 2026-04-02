import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { fetchDataFromApi, sendDataToapi } from "../utils/api";

/**
 * useDetoxSync — Hybrid hook for Detox activity persistence.
 *
 * For logged-in users:  API-first with localStorage cache.
 * For guests:           localStorage-only fallback.
 *
 * Returns:
 *   weekData     — array of 7 day objects (from API or localStorage)
 *   streak       — { streak, nextMilestone, todayActive }
 *   loading      — boolean
 *   logCalm      — (seconds) => void
 *   logGratitude — (entries: string[]) => void
 *   logReflection— (text: string) => void
 *   logChallenge — (title: string) => void
 *   refetch      — () => void
 */
export default function useDetoxSync() {
  const user = useSelector((state) => state.user);
  const isLoggedIn = Boolean(user && user._id);

  const [weekData, setWeekData] = useState([]);
  const [streak, setStreak] = useState({ streak: 0, nextMilestone: 3, todayActive: false });
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  const today = new Date().toISOString().slice(0, 10);

  // ─── Fetch from API ─────────────────────────────────────────
  const fetchFromApi = useCallback(async () => {
    if (!isLoggedIn) {
      loadFromLocalStorage();
      return;
    }
    try {
      setLoading(true);
      const [weekRes, streakRes] = await Promise.all([
        fetchDataFromApi("/detox/week", { date: today }),
        fetchDataFromApi("/detox/streak"),
      ]);
      if (weekRes?.data?.days) setWeekData(weekRes.data.days);
      if (streakRes?.data) setStreak(streakRes.data);
    } catch (err) {
      console.warn("Detox API fetch failed, falling back to localStorage", err);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, today]);

  // ─── Fallback: Load from localStorage ───────────────────────
  const loadFromLocalStorage = useCallback(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      const calmSeconds = parseInt(localStorage.getItem(`detox_calm_${d}`) || "0", 10);
      const gratRaw = localStorage.getItem(`detox_gratitude_${d}`) || localStorage.getItem(`gratitude_${d}`);
      let gratitude = [];
      if (gratRaw) try { gratitude = JSON.parse(gratRaw); } catch (e) { /**/ }
      const reflection = localStorage.getItem(`detox_reflect_${d}`) || localStorage.getItem(`journal_${d}`) || "";
      const challengeDone = localStorage.getItem(`challenge_${d}`) === "done";
      days.push({ date: d, calmSeconds, gratitude, reflection, challengeDone, challengeTitle: "" });
    }
    setWeekData(days);

    // Streak from localStorage
    const savedStreak = parseInt(localStorage.getItem("zen_streak") || "0", 10);
    const milestones = [3, 7, 14, 21, 30, 60, 100];
    const nextMilestone = milestones.find((m) => m > savedStreak) || savedStreak + 10;
    setStreak({ streak: savedStreak, nextMilestone, todayActive: true });
    setLoading(false);
  }, []);

  // Initial fetch
  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchFromApi();
    }
  }, [fetchFromApi]);

  // ─── Log helpers ────────────────────────────────────────────

  const postLog = useCallback(
    async (body) => {
      if (!isLoggedIn) return;
      try {
        await sendDataToapi("/detox/log", body, "application/json");
      } catch (err) {
        console.warn("Detox log failed:", err);
      }
    },
    [isLoggedIn]
  );

  const logCalm = useCallback(
    (seconds) => {
      if (!seconds || seconds <= 0) return;
      // localStorage (optimistic)
      const key = `detox_calm_${today}`;
      const prev = parseInt(localStorage.getItem(key) || "0", 10);
      localStorage.setItem(key, (prev + seconds).toString());
      // API
      postLog({ date: today, calmSeconds: seconds });
    },
    [today, postLog]
  );

  const logGratitude = useCallback(
    (entries) => {
      if (!Array.isArray(entries)) return;
      // localStorage
      localStorage.setItem(`detox_gratitude_${today}`, JSON.stringify(entries));
      // API
      postLog({ date: today, gratitude: entries });
    },
    [today, postLog]
  );

  const logReflection = useCallback(
    (text) => {
      if (typeof text !== "string") return;
      // localStorage
      localStorage.setItem(`detox_reflect_${today}`, text);
      // API
      postLog({ date: today, reflection: text });
    },
    [today, postLog]
  );

  const logChallenge = useCallback(
    (title = "") => {
      // localStorage
      localStorage.setItem(`challenge_${today}`, "done");
      // Update streak in localStorage
      const streakVal = parseInt(localStorage.getItem("zen_streak") || "0", 10);
      const lastDate = localStorage.getItem("zen_streak_date");
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (lastDate === yesterday || lastDate === today) {
        localStorage.setItem("zen_streak", (lastDate === today ? streakVal : streakVal + 1).toString());
      } else {
        localStorage.setItem("zen_streak", "1");
      }
      localStorage.setItem("zen_streak_date", today);
      // API
      postLog({ date: today, challengeDone: true, challengeTitle: title });
    },
    [today, postLog]
  );

  return {
    weekData,
    streak,
    loading,
    logCalm,
    logGratitude,
    logReflection,
    logChallenge,
    refetch: fetchFromApi,
  };
}
