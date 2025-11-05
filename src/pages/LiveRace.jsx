// src/components/LiveRace.jsx
import { useState, useEffect, useRef } from "react";
import useLiveRaceStatus from "../hooks/useLiveRaceStatus";

const LiveRace = () => {
  const [intervals, setIntervals] = useState([]);
  const [drivers, setDrivers] = useState({});
  const [loading, setLoading] = useState(true);
  const [retiredDrivers, setRetiredDrivers] = useState(new Set());
  const { isLiveRace, liveSession } = useLiveRaceStatus(15000); // poll sessions every 15s

  const pollRef = useRef(null);

  // Fetch drivers once when session becomes live
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://api.openf1.org/v1/drivers?session_key=latest",
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`Drivers fetch failed ${res.status}`);
        const data = await res.json();
        // Build a map keyed by number (numbers sometimes strings) -> normalize to Number keys
        const map = {};
        (data || []).forEach((d) => {
          const num = Number(d.driver_number);
          map[num] = d;
        });
        if (!cancelled) {
          setDrivers(map);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch drivers:", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (isLiveRace) {
      fetchDrivers();
    } else {
      // If no live race, clear things
      setIntervals([]);
      setDrivers({});
      setRetiredDrivers(new Set());
      setLoading(false);
    }

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [isLiveRace]);

  // Poll live intervals + positions while race is live
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const fetchLive = async () => {
      try {
        setLoading(true);
        const [intervalsRes, positionRes] = await Promise.all([
          fetch("https://api.openf1.org/v1/intervals?session_key=latest", {
            signal: controller.signal,
          }),
          fetch("https://api.openf1.org/v1/position?session_key=latest", {
            signal: controller.signal,
          }),
        ]);
        if (!intervalsRes.ok || !positionRes.ok) {
          throw new Error("Live endpoints returned non-OK");
        }
        const intervalsData = await intervalsRes.json();
        const positionsData = await positionRes.json();

        // Normalize arrays
        const latestIntervals = Array.isArray(intervalsData)
          ? intervalsData
          : Object.values(intervalsData || {});
        const latestPositions = Array.isArray(positionsData)
          ? positionsData
          : Object.values(positionsData || {});

        // Build position map
        const positionMap = latestPositions.reduce((acc, pos) => {
          acc[Number(pos.driver_number)] = Number(pos.position);
          return acc;
        }, {});

        // Latest intervals map by driver_number
        const intervalsMap = latestIntervals.reduce((acc, it) => {
          acc[Number(it.driver_number)] = it;
          return acc;
        }, {});

        // Detect retired drivers (drivers in drivers map but not in intervalsMap)
        const activeSet = new Set(Object.keys(intervalsMap).map(Number));
        const allDriverNums = Object.keys(drivers).map((k) => Number(k));
        const newRetired = new Set(retiredDrivers);
        allDriverNums.forEach((num) => {
          if (!activeSet.has(num)) newRetired.add(num);
        });

        // Convert intervals map to array
        const intervalsArray = Object.values(intervalsMap).map((it) => ({
          ...it,
          driver_number: Number(it.driver_number),
          gap_to_leader:
            it.gap_to_leader === null || it.gap_to_leader === undefined
              ? null
              : Number(it.gap_to_leader),
          interval:
            it.interval === null || it.interval === undefined
              ? null
              : Number(it.interval),
        }));

        // Sorting: use position if present, else gap_to_leader
        const sorted = intervalsArray.slice().sort((a, b) => {
          const posA = positionMap[a.driver_number];
          const posB = positionMap[b.driver_number];
          if (posA !== undefined && posB !== undefined) return posA - posB;

          const gapA = a.gap_to_leader ?? Number.POSITIVE_INFINITY;
          const gapB = b.gap_to_leader ?? Number.POSITIVE_INFINITY;
          if (gapA === gapB) return a.driver_number - b.driver_number;
          return gapA - gapB;
        });

        // Retired drivers appended at the end
        const retiredData = Array.from(newRetired)
          .filter((num) => drivers[num]) // only show drivers we know
          .map((num) => ({
            driver_number: num,
            gap_to_leader: null,
            interval: null,
            status: "OUT",
          }));

        if (!cancelled) {
          setIntervals([...sorted, ...retiredData]);
          setRetiredDrivers(newRetired);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch live intervals:", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // If live, fetch now and set repeating timer
    if (isLiveRace) {
      fetchLive();
      pollRef.current = setInterval(fetchLive, 10000); // every 10s
    }

    // Cleanup or stop polling
    return () => {
      cancelled = true;
      controller.abort();
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
    // we intentionally include drivers and retiredDrivers in deps so poll logic responds to them
  }, [isLiveRace, drivers, retiredDrivers]);

  // Loading / no live race messages
  if (loading && isLiveRace) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to live feed...</p>
        </div>
      </div>
    );
  }

  if (!isLiveRace) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-16">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🏁</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No Live Race
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              There is no current session running right now.
            </p>
            <p className="text-sm text-gray-500">
              Latest session:{" "}
              {liveSession
                ? `${liveSession.name || liveSession.session_type || ""} - ${
                    liveSession.status || liveSession.session_status || ""
                  }`
                : "None"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Live race UI (table)
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Live Race Leaderboard</h1>
        <span className="flex items-center gap-2 text-red-600 animate-pulse">
          <span className="w-3 h-3 bg-red-600 rounded-full"></span>
          LIVE
        </span>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 font-semibold">Pos</th>
              <th className="p-4 font-semibold">Driver</th>
              <th className="p-4 font-semibold">Gap to Leader</th>
              <th className="p-4 font-semibold">Interval</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {intervals.map((driver, index) => {
              const isRetired = driver.status === "OUT";
              const isLapped =
                driver.gap_to_leader !== null &&
                driver.gap_to_leader !== undefined &&
                driver.gap_to_leader > 60; // > 60s => lapped

              return (
                <tr
                  key={driver.driver_number}
                  className={`border-b last:border-b-0 ${
                    index < 3 && !isRetired ? "bg-yellow-50" : ""
                  } ${isRetired ? "bg-red-50 opacity-60" : ""} ${
                    isLapped && !isRetired ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="p-4 font-bold">
                    {isRetired ? "OUT" : index + 1}
                    {index === 0 && !isRetired && (
                      <span className="ml-2 text-yellow-500">👑</span>
                    )}
                  </td>
                  <td className="p-4 font-medium">
                    {drivers[driver.driver_number]?.full_name ||
                      `Driver #${driver.driver_number}`}
                    {isLapped && !isRetired && (
                      <span className="ml-2 text-blue-500 text-xs">
                        (+1 Lap)
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {isRetired
                      ? "DNF"
                      : driver.gap_to_leader !== null &&
                        driver.gap_to_leader !== undefined
                      ? driver.gap_to_leader.toFixed(3)
                      : "0.000"}
                  </td>
                  <td className="p-4">
                    {isRetired
                      ? "-"
                      : driver.interval !== null &&
                        driver.interval !== undefined
                      ? `+${driver.interval.toFixed(3)}`
                      : "0.000"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        isRetired
                          ? "bg-red-100 text-red-800"
                          : isLapped
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {isRetired ? "OUT" : isLapped ? "LAPPED" : "RUNNING"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        Updates every 10 seconds • Retired drivers shown at bottom
      </div>
    </div>
  );
};

export default LiveRace;
