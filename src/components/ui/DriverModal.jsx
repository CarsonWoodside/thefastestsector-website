import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { getDriverResults } from "../../utils/f1Api";

const DriverModal = ({ driver, isOpen, onClose }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Format date consistently with home page
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      return dateStr;
    }
  };

  // Get country flag
  const getCountryFlag = (nationality) => {
    const countryFlags = {
      Dutch: "🇳🇱",
      Mexican: "🇲🇽",
      British: "🇬🇧",
      Australian: "🇦🇺",
      Monegasque: "🇲🇨",
      Spanish: "🇪🇸",
      German: "🇩🇪",
      Canadian: "🇨🇦",
      French: "🇫🇷",
      Japanese: "🇯🇵",
      Danish: "🇩🇰",
      Thai: "🇹🇭",
      Finnish: "🇫🇮",
      Chinese: "🇨🇳",
      American: "🇺🇸",
      Italian: "🇮🇹",
      "New Zealander": "🇳🇿",
      Argentine: "🇦🇷",
      Brazilian: "🇧🇷",
    };
    return countryFlags[nationality] || "🏁";
  };

  // Get result styling for podium positions only
  const getResultStyling = (position, status) => {
    if (status && status !== "Finished") {
      return "text-gray-700";
    }

    const pos = parseInt(position);
    if (pos === 1) return "text-yellow-600 font-bold";
    if (pos === 2) return "text-gray-600 font-bold";
    if (pos === 3) return "text-amber-600 font-bold";
    return "text-gray-700";
  };

  // Get position display
  const getPositionDisplay = (position, status) => {
    if (status && status !== "Finished") {
      return status;
    }
    return position;
  };

  useEffect(() => {
    if (isOpen && driver) {
      setLoading(true);
      getDriverResults(driver.Driver.driverId)
        .then(setResults)
        .finally(() => setLoading(false));
    }
  }, [isOpen, driver]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !driver) return null;

  return (
    <div className="fixed inset-0 flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 pt-4 sm:pt-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[96vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-[#B91C3C] to-[#991B1B] text-white p-3 sm:p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xl sm:text-3xl">
                {getCountryFlag(driver.Driver.nationality)}
              </span>
              <div>
                <h2 className="text-base sm:text-2xl font-bold">
                  {driver.Driver.givenName} {driver.Driver.familyName}
                </h2>
                <p className="text-red-100 text-xs sm:text-base">
                  2025 Season Performance
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-red-200 transition-colors p-1 cursor-pointer"
            >
              <X size={18} className="sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#B91C3C] animate-spin mr-3" />
              <span className="text-gray-600">Loading race results...</span>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-bold text-gray-700">
                        Round
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700">
                        Race
                      </th>
                      <th className="text-center py-3 px-4 font-bold text-gray-700">
                        Grid
                      </th>
                      <th className="text-center py-3 px-4 font-bold text-gray-700">
                        Finish
                      </th>
                      <th className="text-center py-3 px-4 font-bold text-gray-700">
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((race) => {
                      const result = race.Results[0];
                      return (
                        <tr
                          key={race.round}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4 font-medium text-gray-900">
                            {race.round}
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-gray-900">
                                {race.raceName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(race.date)}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-gray-700 font-medium">
                              {result.grid}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span
                              className={getResultStyling(
                                result.position,
                                result.status
                              )}
                            >
                              {getPositionDisplay(
                                result.position,
                                result.status
                              )}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-gray-700 font-medium">
                              {result.points}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Layout */}
              <div className="sm:hidden space-y-3">
                {results.map((race) => {
                  const result = race.Results[0];
                  return (
                    <div key={race.round} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#B91C3C] text-white text-xs px-2 py-1 rounded font-bold">
                            R{race.round}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(race.date)}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-900">
                            {result.points} pts
                          </div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="font-medium text-gray-900 text-sm">
                          {race.raceName}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex gap-4">
                          <div>
                            <span className="text-gray-500">Grid:</span>
                            <span className="font-medium ml-1">
                              {result.grid}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Finish:</span>
                            <span
                              className={`ml-1 ${getResultStyling(
                                result.position,
                                result.status
                              )}`}
                            >
                              {getPositionDisplay(
                                result.position,
                                result.status
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverModal;
