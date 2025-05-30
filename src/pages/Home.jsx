import { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  Trophy,
  TrendingUp,
  Loader2,
  Medal,
  Flag,
  TestTube,
} from "lucide-react";
import { useF1Data } from "../hooks/useF1Data";

const Home = () => {
  const [timeToRace, setTimeToRace] = useState("");
  const [testMode, setTestMode] = useState(false);
  const [testCircuit, setTestCircuit] = useState("");
  const [imageErrors, setImageErrors] = useState({}); // Track image load errors
  const {
    nextRace,
    recentRaceResults,
    championshipLeader,
    completedRaces,
    totalRaces,
    season,
    loading,
    error,
  } = useF1Data();

  // List of circuits for testing
  const testCircuits = [
    "Circuit de Monaco",
    "Silverstone Circuit",
    "Circuit de Barcelona-Catalunya",
    "Circuit de Spa-Francorchamps",
    "Autodromo Nazionale Monza",
    "Suzuka Circuit",
    "Red Bull Ring",
    "Hungaroring",
    "Circuit Zandvoort",
    "Miami International Autodrome",
    "Jeddah Corniche Circuit",
    "Bahrain International Circuit",
    "Albert Park Circuit",
    "Baku City Circuit",
    "Circuit Gilles Villeneuve",
    "Marina Bay Street Circuit",
    "Circuit of the Americas",
    "Autódromo Hermanos Rodríguez",
    "Autódromo José Carlos Pace",
    "Las Vegas Strip Circuit",
    "Yas Marina Circuit",
  ];

  // Circuit to country mapping for flags
  const circuitCountries = {
    "Circuit de Monaco": "Monaco",
    "Silverstone Circuit": "UK",
    "Circuit de Barcelona-Catalunya": "Spain",
    "Circuit de Spa-Francorchamps": "Belgium",
    "Autodromo Nazionale Monza": "Italy",
    "Suzuka Circuit": "Japan",
    "Red Bull Ring": "Austria",
    Hungaroring: "Hungary",
    "Circuit Zandvoort": "Netherlands",
    "Miami International Autodrome": "USA",
    "Jeddah Corniche Circuit": "Saudi Arabia",
    "Bahrain International Circuit": "Bahrain",
    "Albert Park Circuit": "Australia",
    "Baku City Circuit": "Azerbaijan",
    "Circuit Gilles Villeneuve": "Canada",
    "Marina Bay Street Circuit": "Singapore",
    "Circuit of the Americas": "USA",
    "Autódromo Hermanos Rodríguez": "Mexico",
    "Autódromo José Carlos Pace": "Brazil",
    "Las Vegas Strip Circuit": "USA",
    "Yas Marina Circuit": "UAE",
  };

  // Helper function to format race time properly
  const formatRaceTime = (date, time) => {
    try {
      let timeStr = time || "14:00:00";
      if (timeStr.endsWith("Z")) {
        const utcDateTime = new Date(`${date}T${timeStr}`);
        return utcDateTime.toLocaleString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        });
      } else {
        return `${date} at ${timeStr}`;
      }
    } catch (error) {
      return `${date} at ${time || "14:00"}`;
    }
  };

  // Helper function to format latest results date consistently
  const formatLatestResultsDate = (dateStr) => {
    try {
      const date = new Date(dateStr + "T14:00:00Z");
      return date.toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      return dateStr;
    }
  };

  // Get country flag
  const getCountryFlag = (country) => {
    const countryFlags = {
      Monaco: "🇲🇨",
      UK: "🇬🇧",
      Spain: "🇪🇸",
      Italy: "🇮🇹",
      Belgium: "🇧🇪",
      Netherlands: "🇳🇱",
      France: "🇫🇷",
      Hungary: "🇭🇺",
      Germany: "🇩🇪",
      Austria: "🇦🇹",
      Singapore: "🇸🇬",
      Japan: "🇯🇵",
      Australia: "🇦🇺",
      Bahrain: "🇧🇭",
      "Saudi Arabia": "🇸🇦",
      UAE: "🇦🇪",
      USA: "🇺🇸",
      Mexico: "🇲🇽",
      Brazil: "🇧🇷",
      Canada: "🇨🇦",
      Azerbaijan: "🇦🇿",
      Miami: "🇺🇸",
      "Las Vegas": "🇺🇸",
    };

    return countryFlags[country] || "🏁";
  };

  // Get actual circuit layout image
  const getCircuitLayout = (circuitName) => {
    const f1CircuitMaps = {
      "Circuit de Monaco":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Monaco_Circuit",
      "Silverstone Circuit":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Great_Britain_Circuit",
      "Circuit de Barcelona-Catalunya":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Spain_Circuit",
      "Circuit de Catalunya":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Spain_Circuit",
      Barcelona:
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Spain_Circuit",
      "Circuit de Spa-Francorchamps":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Belgium_Circuit",
      "Autodromo Nazionale Monza":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Italy_Circuit",
      "Suzuka Circuit":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Japan_Circuit",
      "Red Bull Ring":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Austria_Circuit",
      Hungaroring:
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Hungary_Circuit",
      "Circuit Zandvoort":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Netherlands_Circuit",
      "Autodromo Enzo e Dino Ferrari":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/EmiliaRomagna_Circuit",
      "Miami International Autodrome":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Miami_Circuit",
      "Jeddah Corniche Circuit":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Saudi_Arabia_Circuit",
      "Bahrain International Circuit":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Bahrain_Circuit",
      "Albert Park Circuit":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Australia_Circuit",
      "Baku City Circuit":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Baku_Circuit",
      "Circuit Gilles Villeneuve":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Canada_Circuit",
      "Marina Bay Street Circuit":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Singapore_Circuit",
      "Suzuka International Racing Course":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Japan_Circuit",
      "Circuit of the Americas":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/USA_Circuit",
      "Autódromo Hermanos Rodríguez":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Mexico_Circuit",
      "Autódromo José Carlos Pace":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Brazil_Circuit",
      "Las Vegas Strip Circuit":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Las_Vegas_Circuit",
      "Yas Marina Circuit":
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Abu_Dhabi_Circuit",
    };

    // Try exact match first
    let imageUrl = f1CircuitMaps[circuitName];

    // If no exact match, try partial matching for common variations
    if (!imageUrl) {
      const lowerCircuitName = circuitName.toLowerCase();
      if (
        lowerCircuitName.includes("barcelona") ||
        lowerCircuitName.includes("catalunya")
      ) {
        imageUrl =
          "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Spain_Circuit";
      } else if (lowerCircuitName.includes("silverstone")) {
        imageUrl =
          "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Great_Britain_Circuit";
      } else if (lowerCircuitName.includes("monaco")) {
        imageUrl =
          "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Monaco_Circuit";
      } else if (lowerCircuitName.includes("spa")) {
        imageUrl =
          "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Belgium_Circuit";
      } else if (lowerCircuitName.includes("monza")) {
        imageUrl =
          "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Italy_Circuit";
      } else if (lowerCircuitName.includes("suzuka")) {
        imageUrl =
          "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit maps 16x9/Japan_Circuit";
      }
    }

    const hasError = imageErrors[circuitName];

    if (imageUrl && !hasError) {
      return (
        <div className="rounded-lg p-4 mb-4">
          <div className="flex items-center justify-center">
            <img
              key={circuitName}
              src={imageUrl}
              alt={`${circuitName} layout`}
              className="max-h-24 w-auto object-contain"
              onError={() => {
                setImageErrors((prev) => ({ ...prev, [circuitName]: true }));
              }}
              onLoad={() => {
                setImageErrors((prev) => ({ ...prev, [circuitName]: false }));
              }}
            />
          </div>
          <p className="text-center text-xs text-gray-600 mt-2">
            {circuitName}
          </p>
        </div>
      );
    }

    // Fallback if no circuit image is available or error occurred
    return (
      <div className="rounded-lg p-4 mb-4">
        <div className="flex items-center justify-center h-20">
          <div className="text-center text-gray-500 text-sm">
            <div className="text-4xl mb-2">🏁</div>
            Circuit layout coming soon
          </div>
        </div>
        <p className="text-center text-xs text-gray-600 mt-2">{circuitName}</p>
      </div>
    );
  };

  // Get podium position styling
  const getPodiumStyling = (position) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800";
      case 3:
        return "bg-gradient-to-r from-amber-600 to-amber-700 text-amber-100";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Reset image errors when exiting test mode or changing circuits
  useEffect(() => {
    if (!testMode) {
      setImageErrors({});
    }
  }, [testMode]);

  useEffect(() => {
    if (testCircuit) {
      setImageErrors((prev) => ({ ...prev, [testCircuit]: false }));
    }
  }, [testCircuit]);

  useEffect(() => {
    if (!nextRace) return;

    const calculateTimeToRace = () => {
      const raceDateTime = `${nextRace.date}T${nextRace.time || "14:00:00"}`;
      const raceDate = new Date(raceDateTime);
      const now = new Date();
      const difference = raceDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeToRace(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        const daysSince = Math.floor(
          Math.abs(difference) / (1000 * 60 * 60 * 24)
        );
        const hoursSince = Math.floor(
          (Math.abs(difference) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        setTimeToRace(`${daysSince}d ${hoursSince}h ago`);
      }
    };

    calculateTimeToRace();
    const interval = setInterval(calculateTimeToRace, 1000);

    return () => clearInterval(interval);
  }, [nextRace]);

  const seasonProgress =
    totalRaces > 0 ? Math.round((completedRaces / totalRaces) * 100) : 0;
  const isUpcomingRace =
    nextRace &&
    new Date(`${nextRace.date}T${nextRace.time || "14:00:00"}`) > new Date();

  // Get display circuit name and flag (test mode or actual)
  const displayCircuitName =
    testMode && testCircuit ? testCircuit : nextRace?.Circuit.circuitName;
  const displayCountry =
    testMode && testCircuit
      ? circuitCountries[testCircuit]
      : nextRace?.Circuit.Location.country;
  const countryFlag = displayCountry ? getCountryFlag(displayCountry) : "🏁";

  const recentRaceFlag = recentRaceResults
    ? getCountryFlag(recentRaceResults.location.split(", ")[1])
    : "🏁";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#B91C3C] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading F1 data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#B91C3C] text-white px-4 py-2 rounded-lg hover:bg-[#991B1B]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#B91C3C] to-[#991B1B] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              The Fastest Sector
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100">
              Your ultimate destination for F1 news, analysis, and insights
            </p>
          </div>
        </div>
      </section>

      {/* Race Information Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Test Mode Controls */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TestTube className="text-[#B91C3C]" size={20} />
                <span className="font-semibold text-gray-800">
                  Circuit Testing Mode
                </span>
              </div>
              <div className="flex items-center gap-4">
                {testMode && (
                  <select
                    value={testCircuit}
                    onChange={(e) => setTestCircuit(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select a circuit...</option>
                    {testCircuits.map((circuit) => (
                      <option key={circuit} value={circuit}>
                        {circuit}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  onClick={() => {
                    setTestMode(!testMode);
                    if (testMode) {
                      setTestCircuit("");
                      setImageErrors({});
                    }
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    testMode
                      ? "bg-gray-500 text-white hover:bg-gray-600"
                      : "bg-[#B91C3C] text-white hover:bg-[#991B1B]"
                  }`}
                >
                  {testMode ? "Exit Test Mode" : "Test Circuits"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Next Race */}
            {nextRace && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 flex items-center justify-center gap-3">
                  <Flag className="text-[#B91C3C]" size={32} />
                  {testMode
                    ? "Testing Circuit"
                    : isUpcomingRace
                    ? "Next Race"
                    : "Latest Race"}
                </h2>
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-[#B91C3C] mb-4 flex items-center justify-center gap-3">
                      {testMode && testCircuit
                        ? testCircuit
                        : nextRace.raceName}
                      <span className="text-3xl">{countryFlag}</span>
                    </h3>
                    {!testMode && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center space-x-3 text-gray-600">
                          <MapPin size={20} />
                          <span className="text-sm">
                            {nextRace.Circuit.Location.locality},{" "}
                            {nextRace.Circuit.Location.country}
                          </span>
                        </div>
                        <div className="flex items-center justify-center space-x-3 text-gray-500">
                          <Clock size={20} />
                          <span className="text-sm">
                            {formatRaceTime(nextRace.date, nextRace.time)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Circuit Layout */}
                  {displayCircuitName && getCircuitLayout(displayCircuitName)}

                  {!testMode && (
                    <div className="text-center">
                      <div className="text-4xl md:text-5xl font-mono font-bold text-[#B91C3C] mb-2">
                        {timeToRace}
                      </div>
                      <p className="text-gray-600">
                        {isUpcomingRace
                          ? "until lights out"
                          : "since race ended"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recent Race Results */}
            {recentRaceResults && !testMode && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 flex items-center justify-center gap-3">
                  <Medal className="text-[#B91C3C]" size={32} />
                  Latest Results
                </h2>
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-[#B91C3C] mb-4 flex items-center justify-center gap-3">
                      {recentRaceResults.raceName}
                      <span className="text-3xl">{recentRaceFlag}</span>
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center space-x-3 text-gray-600">
                        <MapPin size={20} />
                        <span className="text-sm">
                          {recentRaceResults.location}
                        </span>
                      </div>
                      <div className="flex items-center justify-center space-x-3 text-gray-500">
                        <Clock size={20} />
                        <span className="text-sm">
                          {formatLatestResultsDate(recentRaceResults.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {recentRaceResults.podium.map((driver) => (
                      <div
                        key={driver.position}
                        className={`p-4 rounded-lg ${getPodiumStyling(
                          driver.position
                        )}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold">
                              {driver.position === 1
                                ? "🥇"
                                : driver.position === 2
                                ? "🥈"
                                : "🥉"}
                            </span>
                            <div>
                              <p className="font-semibold">
                                {driver.driverName}
                              </p>
                              <p className="text-sm opacity-80">
                                {driver.constructorName}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-sm">{driver.time}</p>
                            <p className="text-xs opacity-80">
                              {driver.points} pts
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          {!testMode && (
            <>
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                  <Trophy className="w-12 h-12 text-[#B91C3C] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Championship Leader
                  </h3>
                  {championshipLeader ? (
                    <>
                      <p className="text-gray-600">
                        {championshipLeader.Driver.givenName}{" "}
                        {championshipLeader.Driver.familyName}
                      </p>
                      <p className="text-2xl font-bold text-[#B91C3C]">
                        {championshipLeader.points} pts
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-400">No data available</p>
                  )}
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                  <TrendingUp className="w-12 h-12 text-[#B91C3C] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Races Completed
                  </h3>
                  <p className="text-2xl font-bold text-[#B91C3C]">
                    {completedRaces} / {totalRaces}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                  <Clock className="w-12 h-12 text-[#B91C3C] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Season Progress
                  </h3>
                  <p className="text-2xl font-bold text-[#B91C3C]">
                    {seasonProgress}%
                  </p>
                </div>
              </div>

              {/* Latest Blog Posts Preview */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-8 text-gray-900">
                  Latest News
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((post) => (
                    <article
                      key={post}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-lg font-semibold mb-3 text-gray-900">
                        Analysis: {nextRace?.raceName || "Latest Race"}{" "}
                        {isUpcomingRace ? "Preview" : "Review"}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        {isUpcomingRace
                          ? "Breaking down what to expect from the upcoming race..."
                          : "Analyzing the key moments from the latest race..."}
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>2 hours ago</span>
                        <a href="#" className="text-[#B91C3C] hover:underline">
                          Read more
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
