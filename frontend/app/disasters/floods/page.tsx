"use client";

import Link from "next/link";

import IncidentRow from "../../components/IncidentRow";

export default function FloodsPage() {
  // State for flood disasters

  // Evacuation routes data

  // State for active incidents
  const incidents: {
    type: string;
    location: string;
    severity: "High" | "Medium" | "Low";
    time: string;
    status: "In Progress";
    iconColor: string;
  }[] = [
    {
      type: "Flood",
      location: "Ganges Basin, Bihar",
      severity: "High",
      time: "3h ago",
      status: "In Progress",
      iconColor: "bg-blue-500",
    },
    {
      type: "Flood",
      location: "Brahmaputra Basin, Assam",
      severity: "High",
      time: "5h ago",
      status: "In Progress",
      iconColor: "bg-blue-500",
    },
    {
      type: "Flash Flood",
      location: "Yamuna Basin, Delhi",
      severity: "Medium",
      time: "1d ago",
      status: "In Progress",
      iconColor: "bg-blue-500",
    },
  ];

  return (
    <div className="bg-[#1A2526] text-white min-h-screen">
      {/* Main layout container */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm text-gray-400 hover:text-white">
              ← Back to Dashboard
            </Link>
            <h2 className="text-xl font-semibold">Floods Overview</h2>
          </div>
          <div className="flex space-x-2">
            <select className="bg-[#2A3A3B] text-white p-2 rounded">
              <option>All Regions</option>
              <option>Bihar</option>
              <option>Assam</option>
              <option>Uttar Pradesh</option>
            </select>
            <select className="bg-[#2A3A3B] text-white p-2 rounded">
              <option>Last 24 Hours</option>
              <option>Last 48 Hours</option>
              <option>Last Week</option>
            </select>
          </div>
        </div>

        {/* Main content grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left column (3/4 width) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#1E2D3A] p-4 rounded">
                <div className="text-gray-400 mb-1">Affected Districts</div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-gray-400">+3 in last 24h</div>
              </div>
              <div className="bg-[#1E2D3A] p-4 rounded">
                <div className="text-gray-400 mb-1">Affected Population</div>
                <div className="text-2xl font-bold">1.2M</div>
                <div className="text-sm text-gray-400">+210K in last 24h</div>
              </div>
              <div className="bg-[#1E2D3A] p-4 rounded">
                <div className="text-gray-400 mb-1">Evacuation Centers</div>
                <div className="text-2xl font-bold">84</div>
                <div className="text-sm text-gray-400">+12 in last 24h</div>
              </div>
              <div className="bg-[#1E2D3A] p-4 rounded">
                <div className="text-gray-400 mb-1">Rainfall Level</div>
                <div className="text-2xl font-bold">258mm</div>
                <div className="text-sm text-gray-400">+28mm in last 24h</div>
              </div>
            </div>

            {/* Two Column Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column - Precipitation Data */}
              <div className="bg-[#1E2D3A] p-4 rounded">
                <h3 className="text-lg font-semibold mb-4">
                  Live Precipitation Data
                </h3>
                <div className="h-40 mb-4 flex items-center justify-center border border-gray-600 rounded">
                  {/* Placeholder for precipitation trend chart */}
                  <p className="text-gray-400">
                    Precipitation Trend (Last 7 Days)
                  </p>
                </div>
                <div className="text-xs text-gray-400 mb-4">
                  Data sources: IMD, NASA, Weather Services
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#1A2526] p-2 rounded text-center">
                    <div className="text-gray-400 text-xs">Yesterday</div>
                    <div className="text-xl font-semibold">62mm</div>
                  </div>
                  <div className="bg-[#1A2526] p-2 rounded text-center">
                    <div className="text-gray-400 text-xs">Today</div>
                    <div className="text-xl font-semibold">98mm</div>
                  </div>
                  <div className="bg-[#1A2526] p-2 rounded text-center">
                    <div className="text-gray-400 text-xs">Tomorrow</div>
                    <div className="text-xl font-semibold">80mm</div>
                    <div className="text-xs text-gray-400">Predicted</div>
                  </div>
                </div>
              </div>

              {/* Right Column - River & Dam Levels */}
              <div className="bg-[#1E2D3A] p-4 rounded">
                <h3 className="text-lg font-semibold mb-4">
                  River & Dam Levels
                </h3>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>Ganges at Patna</span>
                    <span className="text-red-500">Critical (92%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: "92%" }}
                    ></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>Brahmaputra at Guwahati</span>
                    <span className="text-yellow-500">Warning (78%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: "78%" }}
                    ></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>Yamuna at Delhi</span>
                    <span className="text-yellow-500">Warning (75%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>Narmada Dam</span>
                    <span className="text-green-500">Normal (52%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "52%" }}
                    ></div>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white p-2 rounded mt-4">
                  View All Rivers & Dams
                </button>
              </div>
            </div>

            {/* AI-Driven Flood Path Prediction */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">
                AI-Driven Flood Path Prediction
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="h-60 flex items-center justify-center border border-gray-600 rounded mb-2">
                    {/* Placeholder for prediction map */}
                    <p className="text-gray-400">
                      Flood Path Prediction Map (Next 48 Hours)
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    Using AI-driven hydrological models
                  </div>
                </div>
                <div className="flex flex-col space-y-4">
                  <div className="bg-[#1A2526] p-4 rounded flex-grow">
                    <h4 className="font-semibold mb-2">AI Confidence Level</h4>
                    <div className="text-4xl font-bold mb-1">86%</div>
                    <div className="text-sm text-gray-400 mb-4">
                      High Confidence
                    </div>
                    <div className="text-xs text-gray-400">
                      Based on historical patterns and current data
                    </div>
                  </div>
                  <div className="bg-[#1A2526] p-4 rounded flex-grow">
                    <h4 className="font-semibold mb-2">Prediction Timeline</h4>
                    {/* Timeline content would go here */}
                  </div>
                </div>
              </div>
            </div>

            {/* Relief Operations */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">Relief Operations</h3>
              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span>Rescue Boats Deployed</span>
                  <span className="text-blue-400">86/100</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "86%" }}
                  ></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span>Relief Camps Operational</span>
                  <span className="text-blue-400">42/50</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "84%" }}
                  ></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span>Food Supplies (Days)</span>
                  <span className="text-yellow-400">7/15</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: "47%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Active Incidents */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">
                Active Flood Incidents
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400">
                    <th className="p-2">Type</th>
                    <th className="p-2">Location</th>
                    <th className="p-2">Severity</th>
                    <th className="p-2">Time</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((incident, index) => (
                    <IncidentRow key={index} {...incident} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column (1/4 width) */}
          <div className="space-y-6">
            {/* Flood Alerts Card */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Flood Alerts</h3>
                <span className="bg-red-600 text-xs px-2 py-1 rounded">
                  8 New
                </span>
              </div>
              {/* Alert items would go here */}
              <div className="text-center mt-4">
                <button className="text-blue-400 text-sm">
                  View All Flood Alerts
                </button>
              </div>
            </div>

            {/* Most Affected Areas */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">
                Most Affected Areas
              </h3>
              <div className="space-y-3">
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Darbhanga, Bihar</h4>
                    <span className="bg-red-600 text-xs px-2 py-1 rounded">
                      Severe
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Population Affected: 245,000
                  </div>
                  <div className="text-sm text-gray-400">Villages: 76</div>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Dibrugarh, Assam</h4>
                    <span className="bg-red-600 text-xs px-2 py-1 rounded">
                      Severe
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Population Affected: 188,000
                  </div>
                  <div className="text-sm text-gray-400">Villages: 52</div>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Gorakhpur, UP</h4>
                    <span className="bg-yellow-600 text-xs px-2 py-1 rounded">
                      Moderate
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Population Affected: 120,000
                  </div>
                  <div className="text-sm text-gray-400">Villages: 37</div>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Barpeta, Assam</h4>
                    <span className="bg-yellow-600 text-xs px-2 py-1 rounded">
                      Moderate
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Population Affected: 97,000
                  </div>
                  <div className="text-sm text-gray-400">Villages: 29</div>
                </div>
              </div>
              <div className="text-center mt-4">
                <button className="text-blue-400 text-sm">
                  View All Affected Areas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
