// src/hooks/useLiveRaceStatus.jsx
import { useState, useEffect, useRef } from "react";

/**
 * useLiveRaceStatus
 * - polls OpenF1 sessions endpoint and returns:
 *   { isLiveRace, liveSession, lastChecked }
 */
export const useLiveRaceStatus = (pollIntervalMs = 15000) => {
  const [isLiveRace, setIsLiveRace] = useState(false);
  const [liveSession, setLiveSession] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const controllerRef = { controller: null };

    const check = async () => {
      if (controllerRef.controller) {
        controllerRef.controller.abort();
      }
      controllerRef.controller = new AbortController();
      try {
        const res = await fetch(
          "https://api.openf1.org/v1/sessions?session_key=latest",
          { signal: controllerRef.controller.signal }
        );
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const sessions = await res.json();
        // OpenF1 returns an array; take most recent
        const latest = Array.isArray(sessions) ? sessions[0] : sessions;

        // Determine "active" status robustly:
        // OpenF1 uses different fields (status, session_status); check common values
        const statusString = (latest && (latest.status || latest.session_status || "")).toString().toLowerCase();

        // Consider it live if a session indicates started/in-progress/live/running
        const isActive =
          !!latest &&
          ["started", "live", "running", "in progress", "in_progress"].some((s) =>
            statusString.includes(s)
          );

        if (!mountedRef.current) return;
        setIsLiveRace(isActive);
        setLiveSession(isActive ? latest : null);
        setLastChecked(new Date());
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("[useLiveRaceStatus] failed to check sessions:", err);
        if (!mountedRef.current) return;
        setIsLiveRace(false);
        setLiveSession(null);
        setLastChecked(new Date());
      }
    };

    // initial check immediately
    check();
    const id = setInterval(check, pollIntervalMs);

    return () => {
      mountedRef.current = false;
      clearInterval(id);
      if (controllerRef.controller) controllerRef.controller.abort();
    };
  }, [pollIntervalMs]);

  return { isLiveRace, liveSession, lastChecked };
};

export default useLiveRaceStatus;
