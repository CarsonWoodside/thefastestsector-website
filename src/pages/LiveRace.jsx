import { useState, useEffect } from "react";

const LiveRace = () => {
  const [intervals, setIntervals] = useState([]);
  const [drivers, setDrivers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const fetchLiveIntervals = async () => {
      try {
        const response = await fetch(
          "https://api.openf1.org/v1/intervals?session_key=latest"
        );
        const data = await response.json();
        const latestIntervals = Object.values(
          data.reduce((acc, item) => {
            acc[item.driver_number] = item;
            return acc;
          }, {})
        );
        setIntervals(
          latestIntervals.sort((a, b) => a.gap_to_leader - b.gap_to_leader)
        );
      } catch (error) {
        console.error("Failed to fetch live intervals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveIntervals();
    const intervalId = setInterval(fetchLiveIntervals, 5000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div className="text-center py-8">Connecting to live feed...</div>;
  }

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
            </tr>
          </thead>
          <tbody>
            {intervals.map((driver, index) => (
              <tr
                key={driver.driver_number}
                className="border-b last:border-b-0"
              >
                <td className="p-4 font-bold">{index + 1}</td>
                <td className="p-4 font-medium">
                  {drivers[driver.driver_number]?.full_name ||
                    `Driver #${driver.driver_number}`}
                </td>
                <td className="p-4">
                  {driver.gap_to_leader?.toFixed(3) || "0.000"}
                </td>
                <td className="p-4">
                  +{driver.interval?.toFixed(3) || "0.000"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveRace;
