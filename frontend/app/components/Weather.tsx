// pages/weather.js
import { useState, useEffect } from "react";
import Head from "next/head";

export default function Weather() {
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  interface WeatherData {
    city?: string;
    location?: string;
    weather?: {
      current?: {
        temperature?: {
          max?: { value: number };
          min?: { value: number };
        };
        humidity?: {
          morning?: number;
          evening?: number;
        };
        rainfall?: number;
      };
      astronomical?: {
        sunrise?: string;
        sunset?: string;
        moonrise?: string;
        moonset?: string;
      };
      forecast?: Array<{
        date: string;
        max_temp: number;
        min_temp: number;
        description?: string;
      }>;
    };
    current?: {
      temperature?: number;
      feels_like?: number;
      humidity?: number;
      wind_speed?: number;
      wind_direction?: string;
      condition?: string;
      uv_index?: number;
    };
    forecast?: Array<{
      date: string;
      max_temp: number;
      min_temp: number;
      description?: string;
      chance_of_rain?: number;
    }>;
  }

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchType, setSearchType] = useState("india"); // 'india' or 'global'
  const [indiaStations, setIndiaStations] = useState<Record<string, string>>(
    {}
  );
  const [showStations, setShowStations] = useState(false);

  // Function to fetch Indian stations
  const fetchIndiaStations = async () => {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    if (!apiKey) {
      setError("API key is not configured");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://weather.indianapi.in/india/cities",
        {
          headers: {
            "x-api-key": apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch stations");
      }

      const data = await response.json();
      setIndiaStations(data);
      setLoading(false);
    } catch (err) {
      setError(
        "Failed to fetch stations: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch stations when component mounts if API key is available
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    if (apiKey) {
      fetchIndiaStations();
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    if (!apiKey) {
      setError(
        "API key is not configured. Please check your environment variables."
      );
      return;
    }

    if (searchType === "india" && !city) {
      setError("City name is required");
      return;
    }

    if (searchType === "global" && !location) {
      setError("Location is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      let response;
      const data = await (async () => {
        if (searchType === "india") {
          // Fetch Indian city weather
          response = await fetch(
            `https://weather.indianapi.in/india/weather?city=${encodeURIComponent(
              city
            )}`,
            {
              headers: {
                "x-api-key": apiKey,
              },
            }
          );
        } else {
          // Fetch global weather
          response = await fetch(
            `https://weather.indianapi.in/global/weather?location=${encodeURIComponent(
              location
            )}`,
            {
              headers: {
                "x-api-key": apiKey,
              },
            }
          );
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API Error (${response.status}): ${errorText}`);
        }

        return response.json();
      })();
      setWeatherData(data);
      setLoading(false);
    } catch (err) {
      setError(
        "Failed to fetch weather data: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Weather Info - Disaster Management</title>
      </Head>

      <main className="container mx-auto p-6">
        {/* API Key and Search Form */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Weather API Query</h3>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block mb-1">API Key</label>
                <input
                  type="password"
                  value="API key from environment variables"
                  className="w-full p-2 rounded bg-gray-700"
                  placeholder="Using API key from environment variables"
                  disabled
                />
              </div>

              <div className="flex-1">
                <label className="block mb-1">Search Type</label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700"
                >
                  <option value="india">Indian Cities (IMD)</option>
                  <option value="global">Global Weather</option>
                </select>
              </div>
            </div>

            {searchType === "india" ? (
              <div>
                <label className="block mb-1">City</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter an Indian city name"
                    className="flex-1 p-2 rounded bg-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowStations(!showStations);
                      if (!Object.keys(indiaStations).length) {
                        fetchIndiaStations();
                      }
                    }}
                    className="px-3 py-2 bg-blue-600 rounded text-sm"
                  >
                    {showStations ? "Hide" : "Show"} Stations
                  </button>
                </div>

                {showStations && (
                  <div className="mt-2 p-3 bg-gray-700 rounded max-h-40 overflow-y-auto">
                    <h4 className="text-sm font-medium mb-1">
                      Available IMD Stations:
                    </h4>
                    {loading ? (
                      <p className="text-sm text-gray-400">
                        Loading stations...
                      </p>
                    ) : Object.keys(indiaStations).length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(indiaStations).map(([id, name]) => (
                          <div
                            key={id}
                            className="cursor-pointer hover:bg-gray-600 p-1 rounded"
                            onClick={() => {
                              setCity(name);
                              setShowStations(false);
                            }}
                          >
                            {name} (ID: {id})
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No stations found</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City name, airport code, or lat,long"
                  className="w-full p-2 rounded bg-gray-700"
                />
              </div>
            )}

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-medium"
              disabled={loading}
            >
              {loading ? "Loading..." : "Get Weather Data"}
            </button>
          </form>
        </div>

        {/* Weather Data Display */}
        {weatherData && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              Weather for{" "}
              {searchType === "india" ? weatherData.city : weatherData.location}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Weather */}
              <div className="bg-gray-700 p-4 rounded-md">
                <h4 className="text-md font-medium mb-3 border-b border-gray-600 pb-2">
                  Current Conditions
                </h4>

                {searchType === "india" && weatherData.weather?.current ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Max Temperature:</span>
                      <span className="font-semibold">
                        {weatherData.weather.current.temperature?.max?.value}°C
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min Temperature:</span>
                      <span className="font-semibold">
                        {weatherData.weather.current.temperature?.min?.value}°C
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Morning Humidity:</span>
                      <span className="font-semibold">
                        {weatherData.weather.current.humidity?.morning}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Evening Humidity:</span>
                      <span className="font-semibold">
                        {weatherData.weather.current.humidity?.evening}%
                      </span>
                    </div>
                    {weatherData.weather.current.rainfall && (
                      <div className="flex justify-between">
                        <span>Rainfall:</span>
                        <span className="font-semibold">
                          {weatherData.weather.current.rainfall} mm
                        </span>
                      </div>
                    )}
                  </div>
                ) : searchType === "global" && weatherData.current ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Temperature:</span>
                      <span className="font-semibold">
                        {weatherData.current.temperature}°C
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Feels Like:</span>
                      <span className="font-semibold">
                        {weatherData.current.feels_like}°C
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Humidity:</span>
                      <span className="font-semibold">
                        {weatherData.current.humidity}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wind:</span>
                      <span className="font-semibold">
                        {weatherData.current.wind_speed} km/h{" "}
                        {weatherData.current.wind_direction}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Condition:</span>
                      <span className="font-semibold">
                        {weatherData.current.condition}
                      </span>
                    </div>
                    {weatherData.current.uv_index && (
                      <div className="flex justify-between">
                        <span>UV Index:</span>
                        <span className="font-semibold">
                          {weatherData.current.uv_index}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400">
                    No current weather data available
                  </p>
                )}
              </div>

              {/* Astronomical Data (India only) */}
              {searchType === "india" && weatherData.weather?.astronomical && (
                <div className="bg-gray-700 p-4 rounded-md">
                  <h4 className="text-md font-medium mb-3 border-b border-gray-600 pb-2">
                    Astronomical Data
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sunrise:</span>
                      <span className="font-semibold">
                        {weatherData.weather.astronomical.sunrise}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunset:</span>
                      <span className="font-semibold">
                        {weatherData.weather.astronomical.sunset}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Moonrise:</span>
                      <span className="font-semibold">
                        {weatherData.weather.astronomical.moonrise}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Moonset:</span>
                      <span className="font-semibold">
                        {weatherData.weather.astronomical.moonset}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Forecast */}
              <div
                className={`bg-gray-700 p-4 rounded-md ${
                  searchType === "india" && !weatherData.weather?.astronomical
                    ? "md:col-span-1"
                    : "md:col-span-2"
                }`}
              >
                <h4 className="text-md font-medium mb-3 border-b border-gray-600 pb-2">
                  Weather Forecast
                </h4>

                {searchType === "india" && weatherData.weather?.forecast ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {weatherData.weather.forecast.map((day, index) => (
                      <div key={index} className="bg-gray-800 p-3 rounded-md">
                        <div className="font-medium text-blue-300 mb-2">
                          {day.date}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Max Temp:</span>
                            <span>{day.max_temp}°C</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Min Temp:</span>
                            <span>{day.min_temp}°C</span>
                          </div>
                          <div className="text-sm mt-2">{day.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchType === "global" && weatherData.forecast ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className="bg-gray-800 p-3 rounded-md">
                        <div className="font-medium text-blue-300 mb-2">
                          {day.date}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Max Temp:</span>
                            <span>{day.max_temp}°C</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Min Temp:</span>
                            <span>{day.min_temp}°C</span>
                          </div>
                          {day.description && (
                            <div className="text-sm mt-2">
                              {day.description}
                            </div>
                          )}
                          {day.chance_of_rain !== undefined && (
                            <div className="flex justify-between">
                              <span>Rain Chance:</span>
                              <span>{day.chance_of_rain}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No forecast data available</p>
                )}
              </div>
            </div>

            {/* Weather Alerts Section - Integration with your disaster system */}
            <div className="mt-6 bg-gray-700 p-4 rounded-md">
              <h4 className="text-md font-medium mb-3 border-b border-gray-600 pb-2">
                Weather-Related Disaster Alerts
              </h4>

              <div className="space-y-3">
                {/* Check weather conditions and show relevant alerts */}
                {searchType === "india" &&
                  weatherData.weather?.forecast?.some(
                    (day) =>
                      day.description?.toLowerCase().includes("heavy rain") ||
                      day.description?.toLowerCase().includes("flood")
                  ) && (
                    <div className="bg-red-900/50 border border-red-700 p-3 rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">Flood Risk Alert</span>
                        <span className="text-sm">Based on forecast</span>
                      </div>
                      <p className="text-sm mt-1">
                        Heavy rainfall forecast may lead to flooding in
                        low-lying areas.
                      </p>
                    </div>
                  )}

                {searchType === "india" &&
                  weatherData.weather?.forecast?.some(
                    (day) =>
                      day.description?.toLowerCase().includes("storm") ||
                      day.description?.toLowerCase().includes("thunder")
                  ) && (
                    <div className="bg-yellow-800/50 border border-yellow-700 p-3 rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">Storm Warning</span>
                        <span className="text-sm">Based on forecast</span>
                      </div>
                      <p className="text-sm mt-1">
                        Storm conditions expected. Secure loose items and stay
                        indoors during peak periods.
                      </p>
                    </div>
                  )}

                {searchType === "global" &&
                  weatherData.forecast?.some((day) =>
                    day.chance_of_rain
                      ? day.chance_of_rain
                      : 0 > 70 ||
                        (day.description?.toLowerCase().includes("rain") &&
                          day.description?.toLowerCase().includes("heavy"))
                  ) && (
                    <div className="bg-yellow-800/50 border border-yellow-700 p-3 rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          Heavy Rainfall Warning
                        </span>
                        <span className="text-sm">Based on forecast</span>
                      </div>
                      <p className="text-sm mt-1">
                        High probability of heavy rainfall. Exercise caution in
                        flood-prone areas.
                      </p>
                    </div>
                  )}

                {/* If no weather alerts are necessary */}
                {!(
                  (searchType === "india" &&
                    weatherData.weather?.forecast?.some(
                      (day) =>
                        day.description?.toLowerCase().includes("heavy rain") ||
                        day.description?.toLowerCase().includes("flood") ||
                        day.description?.toLowerCase().includes("storm") ||
                        day.description?.toLowerCase().includes("thunder")
                    )) ||
                  (searchType === "global" &&
                    weatherData.forecast?.some((day) =>
                      day.chance_of_rain
                        ? day.chance_of_rain
                        : 0 > 70 ||
                          (day.description?.toLowerCase().includes("rain") &&
                            day.description?.toLowerCase().includes("heavy"))
                    ))
                ) && (
                  <div className="bg-green-900/50 border border-green-700 p-3 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">No Weather Alerts</span>
                      <span className="text-sm">Current status</span>
                    </div>
                    <p className="text-sm mt-1">
                      Weather conditions do not currently indicate heightened
                      disaster risk.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 p-4 mt-8">
        <div className="container mx-auto text-center text-gray-400 text-sm">
          <p>
            Powered by Indian Weather API • © 2025 ResoNet Disaster Management
          </p>
          <p className="mt-1">
            <a
              href="http://indianapi.in/weather-api"
              className="text-blue-400 hover:underline"
            >
              Get your own API key
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
