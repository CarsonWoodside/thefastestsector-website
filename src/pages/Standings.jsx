import { useState, useEffect } from "react";
import { Trophy, Users, Loader2, Crown, Medal, Award } from "lucide-react";
import { getDriverStandings, getConstructorStandings } from "../utils/f1Api";
import DriverModal from "../components/ui/DriverModal";

const Standings = () => {
  const [driverStandings, setDriverStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("drivers");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  // Manual override for mid-season transfers
  const getCorrectTeam = (driverName, originalTeam) => {
    const transfers = {
      "Yuki Tsunoda": "Red Bull",
      "Liam Lawson": "RB F1 Team",
    };

    return transfers[driverName] || originalTeam;
  };

  // Get position styling
  const getPositionStyling = (position) => {
    switch (parseInt(position)) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-bold";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 font-bold";
      case 3:
        return "bg-gradient-to-r from-amber-600 to-amber-700 text-amber-100 font-bold";
      default:
        if (position <= 10) {
          return "bg-green-100 text-green-800 font-semibold";
        }
        return "bg-gray-100 text-gray-700";
    }
  };

  // Get position icon
  const getPositionIcon = (position) => {
    switch (parseInt(position)) {
      case 1:
        return <Crown className="inline mr-1" size={14} />;
      case 2:
        return <Medal className="inline mr-1" size={14} />;
      case 3:
        return <Award className="inline mr-1" size={14} />;
      default:
        return null;
    }
  };

  // Calculate points gap
  const calculatePointsGap = (standings, currentIndex) => {
    if (currentIndex === 0) return "Leader";
    const leaderPoints = parseInt(standings[0].points);
    const currentPoints = parseInt(standings[currentIndex].points);
    return `-${leaderPoints - currentPoints}`;
  };

  // Handle driver click
  const handleDriverClick = (driver) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDriver(null);
  };

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const [drivers, constructors] = await Promise.all([
          getDriverStandings(),
          getConstructorStandings(),
        ]);
        setDriverStandings(drivers);
        setConstructorStandings(constructors);
      } catch (error) {
        console.error("Error fetching standings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#B91C3C] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading standings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content with conditional blur */}
      <div
        className={`transition-all duration-300 ${
          isModalOpen ? "blur-sm" : ""
        }`}
      >
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#B91C3C] to-[#991B1B] text-white py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
                Championship Standings
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-red-100">
                2025 Formula 1 World Championship
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="bg-white rounded-xl p-1 sm:p-2 shadow-lg w-full max-w-2xl">
              <div className="grid grid-cols-2 gap-1 sm:gap-0">
                <button
                  onClick={() => setActiveTab("drivers")}
                  className={`px-3 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-200 cursor-pointer text-sm sm:text-base ${
                    activeTab === "drivers"
                      ? "bg-[#B91C3C] text-white shadow-md"
                      : "text-gray-600 hover:text-[#B91C3C] hover:bg-gray-50"
                  }`}
                >
                  <Trophy className="inline mr-1 sm:mr-2" size={16} />
                  <span className="hidden sm:inline">Drivers Championship</span>
                  <span className="sm:hidden">Drivers</span>
                </button>
                <button
                  onClick={() => setActiveTab("constructors")}
                  className={`px-3 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-200 cursor-pointer text-sm sm:text-base ${
                    activeTab === "constructors"
                      ? "bg-[#B91C3C] text-white shadow-md"
                      : "text-gray-600 hover:text-[#B91C3C] hover:bg-gray-50"
                  }`}
                >
                  <Users className="inline mr-1 sm:mr-2" size={16} />
                  <span className="hidden sm:inline">
                    Constructors Championship
                  </span>
                  <span className="sm:hidden">Constructors</span>
                </button>
              </div>
            </div>
          </div>

          {/* Standings Tables */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {activeTab === "drivers" ? (
              <div className="p-3 sm:p-8">
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b-2 border-gray-200">
                        <th className="text-left py-4 px-6 font-bold text-gray-700">
                          Position
                        </th>
                        <th className="text-left py-4 px-6 font-bold text-gray-700">
                          Driver
                        </th>
                        <th className="text-left py-4 px-6 font-bold text-gray-700">
                          Team
                        </th>
                        <th className="text-center py-4 px-6 font-bold text-gray-700">
                          Points
                        </th>
                        <th className="text-center py-4 px-6 font-bold text-gray-700">
                          Gap
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {driverStandings.map((driver, index) => {
                        return (
                          <tr
                            key={driver.Driver.driverId}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => handleDriverClick(driver)}
                          >
                            <td className="py-6 px-6">
                              <div
                                className={`inline-flex items-center px-3 py-2 rounded-full text-sm ${getPositionStyling(
                                  driver.position
                                )}`}
                              >
                                {getPositionIcon(driver.position)}
                                {driver.position}
                              </div>
                            </td>
                            <td className="py-6 px-6">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">
                                  {getCountryFlag(driver.Driver.nationality)}
                                </span>
                                <div>
                                  <div className="font-bold text-lg text-gray-900">
                                    {driver.Driver.givenName}{" "}
                                    {driver.Driver.familyName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {driver.Driver.nationality}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-6 px-6">
                              <span className="font-semibold text-gray-700">
                                {getCorrectTeam(
                                  `${driver.Driver.givenName} ${driver.Driver.familyName}`,
                                  driver.Constructors[0]?.name
                                )}
                              </span>
                            </td>
                            <td className="py-6 px-6 text-center">
                              <span className="text-2xl font-bold text-[#B91C3C]">
                                {driver.points}
                              </span>
                            </td>
                            <td className="py-6 px-6 text-center">
                              <span
                                className={`text-sm font-medium ${
                                  index === 0
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {calculatePointsGap(driverStandings, index)}
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
                  {driverStandings.map((driver, index) => (
                    <div
                      key={driver.Driver.driverId}
                      className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleDriverClick(driver)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getPositionStyling(
                              driver.position
                            )}`}
                          >
                            {getPositionIcon(driver.position)}
                            {driver.position}
                          </div>
                          <span className="text-xl">
                            {getCountryFlag(driver.Driver.nationality)}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-[#B91C3C]">
                            {driver.points}
                          </div>
                          <div
                            className={`text-xs ${
                              index === 0 ? "text-green-600" : "text-gray-500"
                            }`}
                          >
                            {calculatePointsGap(driverStandings, index)}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 mb-1">
                          {driver.Driver.givenName} {driver.Driver.familyName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {getCorrectTeam(
                            `${driver.Driver.givenName} ${driver.Driver.familyName}`,
                            driver.Constructors[0]?.name
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 sm:p-8">
                {/* Desktop Constructor Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b-2 border-gray-200">
                        <th className="text-left py-4 px-6 font-bold text-gray-700">
                          Position
                        </th>
                        <th className="text-left py-4 px-6 font-bold text-gray-700">
                          Team
                        </th>
                        <th className="text-center py-4 px-6 font-bold text-gray-700">
                          Points
                        </th>
                        <th className="text-center py-4 px-6 font-bold text-gray-700">
                          Gap
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {constructorStandings.map((constructor, index) => {
                        return (
                          <tr
                            key={constructor.Constructor.constructorId}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-6 px-6">
                              <div
                                className={`inline-flex items-center px-3 py-2 rounded-full text-sm ${getPositionStyling(
                                  constructor.position
                                )}`}
                              >
                                {getPositionIcon(constructor.position)}
                                {constructor.position}
                              </div>
                            </td>
                            <td className="py-6 px-6">
                              <div className="font-bold text-lg text-gray-900">
                                {constructor.Constructor.name}
                              </div>
                            </td>
                            <td className="py-6 px-6 text-center">
                              <span className="text-2xl font-bold text-[#B91C3C]">
                                {constructor.points}
                              </span>
                            </td>
                            <td className="py-6 px-6 text-center">
                              <span
                                className={`text-sm font-medium ${
                                  index === 0
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {calculatePointsGap(
                                  constructorStandings,
                                  index
                                )}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Constructor Cards */}
                <div className="sm:hidden space-y-3">
                  {constructorStandings.map((constructor, index) => (
                    <div
                      key={constructor.Constructor.constructorId}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getPositionStyling(
                            constructor.position
                          )}`}
                        >
                          {getPositionIcon(constructor.position)}
                          {constructor.position}
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-[#B91C3C]">
                            {constructor.points}
                          </div>
                          <div
                            className={`text-xs ${
                              index === 0 ? "text-green-600" : "text-gray-500"
                            }`}
                          >
                            {calculatePointsGap(constructorStandings, index)}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-gray-900">
                        {constructor.Constructor.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Driver Modal */}
      <DriverModal
        driver={selectedDriver}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default Standings;
