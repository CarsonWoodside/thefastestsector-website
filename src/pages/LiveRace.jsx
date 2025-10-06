import { useState, useEffect } from "react";
import { useLiveRaceStatus } from "../hooks/useLiveRaceStatus";

const LiveRace = () => {
  const [intervals, setIntervals] = useState([]);
  const [drivers, setDrivers] = useState({});
  const [loading, setLoading] = useState(true);
  const [retiredDrivers, setRetiredDrivers] = useState(new Set());
  const { isLiveRace } = useLiveRaceStatus();

  useEffect(() => {
    // Only fetch data if there's a live race
    if (!isLiveRace) {
      setLoading(false);
      return;
    }

    // Fetch driver information once
    const fetchDrivers = async () => {
      try {
        const response = await fetch(
          "https://api.openf1.org/v1/drivers?session_key=latest"
        );
        const data = await response.json();
        const driverMap = data.reduce((acc, driver) => {
          acc[driver.driver_number] = driver;
          return acc;
        }, {});
        setDrivers(driverMap);
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
      }
    };
    fetchDrivers();
  }, [isLiveRace]);

  useEffect(() => {
    // Only set up live updates if there's a live race
    if (!isLiveRace) {
      setLoading(false);
      return;
    }

    const fetchLiveIntervals = async () => {
      try {
        // Fetch both intervals and position data
        const [intervalsResponse, positionResponse] = await Promise.all([
          fetch("https://api.openf1.org/v1/intervals?session_key=latest"),
          fetch("https://api.openf1.org/v1/position?session_key=latest"),
        ]);

        const intervalsData = await intervalsResponse.json();
        const positionData = await positionResponse.json();

        // Get latest intervals
        const latestIntervals = Object.values(
          intervalsData.reduce((acc, item) => {
            acc[item.driver_number] = item;
            return acc;
          }, {})
        );

        // Get latest positions for cross-reference
        const latestPositions = Object.values(
          positionData.reduce((acc, item) => {
            acc[item.driver_number] = item;
            return acc;
          }, {})
        );

        // Create position map for validation
        const positionMap = latestPositions.reduce((acc, pos) => {
          acc[pos.driver_number] = pos.position;
          return acc;
        }, {});

        // Detect retired drivers (no recent data or specific status)
        const activeDriverNumbers = new Set(
          latestIntervals.map((d) => d.driver_number)
        );
        const allDriverNumbers = Object.keys(drivers).map(Number);

        const newRetiredDrivers = new Set(retiredDrivers);
        allDriverNumbers.forEach((driverNum) => {
          if (!activeDriverNumbers.has(driverNum)) {
            newRetiredDrivers.add(driverNum);
          }
        });

        // Enhanced sorting with position validation
        const sortedIntervals = latestIntervals
          .filter(
            (driver) =>
              driver.gap_to_leader !== null || driver.interval !== null
          )
          .sort((a, b) => {
            // First, try to use position data if available
            const posA = positionMap[a.driver_number];
            const posB = positionMap[b.driver_number];

            if (posA && posB) {
              return posA - posB;
            }

            // Fallback to gap sorting with stability improvements
            const gapA = a.gap_to_leader ?? 999999;
            const gapB = b.gap_to_leader ?? 999999;

            // Handle leader case (gap = 0)
            if (gapA === 0 && gapB !== 0) return -1;
            if (gapB === 0 && gapA !== 0) return 1;
            if (gapA === 0 && gapB === 0) {
              // Both leaders? Use driver number as tiebreaker
              return a.driver_number - b.driver_number;
            }

            // Normal gap sorting
            if (gapA !== 999999 && gapB !== 999999) {
              const diff = gapA - gapB;
              // Add small tolerance to prevent micro-fluctuations
              if (Math.abs(diff) < 0.1) {
                return a.driver_number - b.driver_number;
              }
              return diff;
            }

            // Handle null gaps
            if (gapA === 999999 && gapB !== 999999) return 1;
            if (gapB === 999999 && gapA !== 999999) return -1;

            return a.driver_number - b.driver_number;
          });

        // Add retired drivers at the end
        const retiredDriversData = Array.from(newRetiredDrivers)
          .filter((driverNum) => drivers[driverNum])
          .map((driverNum) => ({
            driver_number: driverNum,
            gap_to_leader: null,
            interval: null,
            status: "OUT",
          }));

        setIntervals([...sortedIntervals, ...retiredDriversData]);
        setRetiredDrivers(newRetiredDrivers);
      } catch (error) {
        console.error("Failed to fetch live intervals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveIntervals();
    // Reduce update frequency to prevent jitter
    const intervalId = setInterval(fetchLiveIntervals, 10000); // 10 seconds instead of 5

    return () => clearInterval(intervalId);
  }, [drivers, retiredDrivers, isLiveRace]);

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to live feed...</p>
        </div>
      </div>
    );
  }

  // Show no race message when there's no live race
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
              There is no current race happening right now.
            </p>
            <div className="space-y-4 text-gray-500">
              <p>
                Check back during race weekends for live timing and standings!
              </p>
              <div className="flex justify-center space-x-4 mt-8">
                <a
                  href="/schedule"
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  View Schedule
                </a>
                <a
                  href="/results"
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Latest Results
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show live race data
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
              const isLapped = driver.gap_to_leader > 60; // More than 1 minute behind

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
