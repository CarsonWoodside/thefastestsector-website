import { Link } from "react-router-dom";

const getCountryFlag = (country) => {
  const countryFlags = {
    Australia: "🇦🇺",
    China: "🇨🇳",
    Japan: "🇯🇵",
    Bahrain: "🇧🇭",
    "Saudi Arabia": "🇸🇦",
    USA: "🇺🇸",
    Italy: "🇮🇹",
    Monaco: "🇲🇨",
    Spain: "🇪🇸",
    Canada: "🇨🇦",
    Austria: "🇦🇹",
    "Great Britain": "🇬🇧",
    Belgium: "🇧🇪",
    Hungary: "🇭🇺",
    Netherlands: "🇳🇱",
    Azerbaijan: "🇦🇿",
    Singapore: "🇸🇬",
    Mexico: "🇲🇽",
    Brazil: "🇧🇷",
    Qatar: "🇶🇦",
    "United Arab Emirates": "🇦🇪",
  };
  return countryFlags[country] || "🏁";
};

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

  // Fallback if no match found
  return (
    imageUrl || "https://via.placeholder.com/400x300?text=Track+Map+Unavailable"
  );
};

const correctOrder = [
  {
    round: 1,
    country: "Australia",
    raceName: "Australian Grand Prix",
    circuit: "Albert Park Circuit",
    dateRange: "March 14-16",
  },
  {
    round: 2,
    country: "China",
    raceName: "Chinese Grand Prix",
    circuit: "Shanghai International Circuit",
    dateRange: "March 21-23",
  },
  {
    round: 3,
    country: "Japan",
    raceName: "Japanese Grand Prix",
    circuit: "Suzuka Circuit",
    dateRange: "April 4-6",
  },
  {
    round: 4,
    country: "Bahrain",
    raceName: "Bahrain Grand Prix",
    circuit: "Bahrain International Circuit",
    dateRange: "April 11-13",
  },
  {
    round: 5,
    country: "Saudi Arabia",
    raceName: "Saudi Arabian Grand Prix",
    circuit: "Jeddah Corniche Circuit",
    dateRange: "April 18-20",
  },
  {
    round: 6,
    country: "USA",
    raceName: "Miami Grand Prix",
    circuit: "Miami International Autodrome",
    dateRange: "May 2-4",
  },
  {
    round: 7,
    country: "Italy",
    raceName: "Emilia Romagna Grand Prix",
    circuit: "Autodromo Enzo e Dino Ferrari",
    dateRange: "May 16-18",
  },
  {
    round: 8,
    country: "Monaco",
    raceName: "Monaco Grand Prix",
    circuit: "Circuit de Monaco",
    dateRange: "May 23-25",
  },
  {
    round: 9,
    country: "Spain",
    raceName: "Spanish Grand Prix",
    circuit: "Circuit de Barcelona-Catalunya",
    dateRange: "May 30 - June 1",
  },
  {
    round: 10,
    country: "Canada",
    raceName: "Canadian Grand Prix",
    circuit: "Circuit Gilles Villeneuve",
    dateRange: "June 13-15",
  },
  {
    round: 11,
    country: "Austria",
    raceName: "Austrian Grand Prix",
    circuit: "Red Bull Ring",
    dateRange: "June 27-29",
  },
  {
    round: 12,
    country: "Great Britain",
    raceName: "British Grand Prix",
    circuit: "Silverstone Circuit",
    dateRange: "July 4-6",
  },
  {
    round: 13,
    country: "Belgium",
    raceName: "Belgian Grand Prix",
    circuit: "Circuit de Spa-Francorchamps",
    dateRange: "July 25-27",
  },
  {
    round: 14,
    country: "Hungary",
    raceName: "Hungarian Grand Prix",
    circuit: "Hungaroring",
    dateRange: "August 1-3",
  },
  {
    round: 15,
    country: "Netherlands",
    raceName: "Dutch Grand Prix",
    circuit: "Circuit Park Zandvoort",
    dateRange: "August 29-31",
  },
  {
    round: 16,
    country: "Italy",
    raceName: "Italian Grand Prix",
    circuit: "Autodromo Nazionale Monza",
    dateRange: "September 5-7",
  },
  {
    round: 17,
    country: "Azerbaijan",
    raceName: "Azerbaijan Grand Prix",
    circuit: "Baku City Circuit",
    dateRange: "September 19-21",
  },
  {
    round: 18,
    country: "Singapore",
    raceName: "Singapore Grand Prix",
    circuit: "Marina Bay Street Circuit",
    dateRange: "October 3-5",
  },
  {
    round: 19,
    country: "USA",
    raceName: "United States Grand Prix",
    circuit: "Circuit of the Americas",
    dateRange: "October 17-19",
  },
  {
    round: 20,
    country: "Mexico",
    raceName: "Mexico City Grand Prix",
    circuit: "Autódromo Hermanos Rodríguez",
    dateRange: "October 24-26",
  },
  {
    round: 21,
    country: "Brazil",
    raceName: "São Paulo Grand Prix",
    circuit: "Autódromo José Carlos Pace",
    dateRange: "November 7-9",
  },
  {
    round: 22,
    country: "USA",
    raceName: "Las Vegas Grand Prix",
    circuit: "Las Vegas Strip Street Circuit",
    dateRange: "November 20-22",
  },
  {
    round: 23,
    country: "Qatar",
    raceName: "Qatar Grand Prix",
    circuit: "Losail International Circuit",
    dateRange: "November 28-30",
  },
  {
    round: 24,
    country: "United Arab Emirates",
    raceName: "Abu Dhabi Grand Prix",
    circuit: "Yas Marina Circuit",
    dateRange: "December 5-7",
  },
];

export default function Calendar() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f5] to-[#e5e5e5]">
      <section className="bg-gradient-to-r from-[#B91C3C] to-[#991B1B] text-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
              Formula 1 Calendar
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-red-100">
              2025 Season Schedule
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {correctOrder.map((race) => (
            <div
              key={race.round}
              className="flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              style={{ minHeight: "480px" }}
            >
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-[#B91C3C]">
                    {race.dateRange}
                  </span>
                  <span className="text-2xl">
                    {getCountryFlag(race.country)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {race.raceName}
                </h3>
                <p className="text-gray-600 mb-4">
                  {race.circuit}, {race.country}
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center bg-gray-100">
                <img
                  src={getCircuitLayout(race.circuit)}
                  alt={`${race.circuit} Track Map`}
                  className="w-full h-auto max-h-48 object-contain"
                />
              </div>
              <div className="p-6">
                <Link
                  to={`/race/${race.round}`}
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-[#B91C3C] text-white rounded-lg hover:bg-[#991B1B] transition-colors"
                >
                  View all information
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
