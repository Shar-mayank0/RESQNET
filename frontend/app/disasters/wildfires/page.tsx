"use client";

import { useState } from "react";
import Link from "next/link";
import DisasterMap from "../../components/Maps";
import IncidentRow from "../../components/IncidentRow";

interface Wildfire {
  id: number;
  lat: number;
  lng: number;
  intensity: number;
  size: number; // in hectares
  risk: "High" | "Medium" | "Low";
}

export default function WildfiresPage() {
  // State for wildfire data
  const [wildfires] = useState<Wildfire[]>([
    {
      id: 1,
      lat: 21.7679,
      lng: 78.8718,
      intensity: 85,
      size: 1200,
      risk: "High",
    }, // Central India
    {
      id: 2,
      lat: 19.076,
      lng: 72.8777,
      intensity: 75,
      size: 850,
      risk: "High",
    }, // Maharashtra
    {
      id: 3,
      lat: 28.7041,
      lng: 77.1025,
      intensity: 60,
      size: 620,
      risk: "Medium",
    }, // Northern India
    {
      id: 4,
      lat: 12.9716,
      lng: 77.5946,
      intensity: 40,
      size: 320,
      risk: "Low",
    }, // Southern India
  ]);

  // Predicted wildfire spread
  const fireSpreadPaths: { id: number; path: [number, number][] }[] = [
    {
      id: 1,
      path: [
        [21.7679, 78.8718], // Central India
        [21.9, 79.0],
        [22.1, 79.2],
        [22.3, 79.4],
        [22.5, 79.6],
      ],
    },
    {
      id: 2,
      path: [
        [19.076, 72.8777], // Maharashtra
        [19.2, 73.0],
        [19.3, 73.1],
        [19.4, 73.2],
        [19.5, 73.3],
      ],
    },
  ];

  // State for active incidents
  const incidents: {
    type: string;
    location: string;
    severity: "High" | "Medium" | "Low";
    time: string;
    status: "In Progress" | "Monitoring";
    iconColor: string;
  }[] = [
    {
      type: "Wildfire",
      location: "Central India",
      severity: "High",
      time: "2h ago",
      status: "In Progress",
      iconColor: "bg-red-500",
    },
    {
      type: "Forest Fire",
      location: "Maharashtra",
      severity: "High",
      time: "4h ago",
      status: "In Progress",
      iconColor: "bg-red-500",
    },
    {
      type: "Brush Fire",
      location: "Northern India",
      severity: "Medium",
      time: "10h ago",
      status: "Monitoring",
      iconColor: "bg-orange-500",
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
            <h2 className="text-xl font-semibold">Wildfires Overview</h2>
          </div>
          <div className="flex space-x-2">
            <select className="bg-[#2A3A3B] text-white p-2 rounded">
              <option>All Regions</option>
              <option>Northern India</option>
              <option>Central India</option>
              <option>Southern India</option>
              <option>Western India</option>
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
                <div className="text-gray-400 mb-1">Active Fires</div>
                <div className="text-2xl font-bold">28</div>
                <div className="text-sm text-gray-400">+5 in last 24h</div>
              </div>
              <div className="bg-[#1E2D3A] p-4 rounded">
                <div className="text-gray-400 mb-1">Area Burned</div>
                <div className="text-2xl font-bold">3,540</div>
                <div className="text-sm text-text-gray-400">hectares</div>
              </div>
              <div className="bg-[#1E2D3A] p-4 rounded">
                <div className="text-gray-400 mb-1">Evacuation Centers</div>
                <div className="text-2xl font-bold">42</div>
                <div className="text-sm text-gray-400">+8 in last 24h</div>
              </div>
              <div className="bg-[#1E2D3A] p-4 rounded">
                <div className="text-gray-400 mb-1">Highest Intensity</div>
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm text-gray-400">
                  Central India, 2h ago
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <DisasterMap disasters={wildfires} routes={fireSpreadPaths} />
              <div className="flex justify-center mt-2 space-x-4">
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
                  High Risk (Intensity &gt; 70%)
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></span>
                  Medium Risk (Intensity 40-70%)
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                  Low Risk (Intensity &lt; 40%)
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-orange-500 mr-2"></span>
                  Predicted Spread
                </div>
              </div>
            </div>

            {/* Two Column Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column - Fire Intensity Tracking */}
              <div className="bg-[#1E2D3A] p-4 rounded">
                <h3 className="text-lg font-semibold mb-4">
                  Fire Intensity Tracking
                </h3>
                <div className="h-40 mb-4 flex items-center justify-center border border-gray-600 rounded">
                  {/* Placeholder for fire intensity chart */}
                  <p className="text-gray-400">
                    Fire Intensity Tracking (Last 72 Hours)
                  </p>
                </div>
                <div className="text-xs text-gray-400 mb-4">
                  Data sources: Forest Survey of India, Satellite Imagery, Fire
                  Weather Index
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#1A2526] p-2 rounded text-center">
                    <div className="text-gray-400 text-xs">Yesterday</div>
                    <div className="text-xl font-semibold">72%</div>
                    <div className="text-xs text-gray-400">intensity</div>
                  </div>
                  <div className="bg-[#1A2526] p-2 rounded text-center">
                    <div className="text-gray-400 text-xs">Today</div>
                    <div className="text-xl font-semibold">85%</div>
                    <div className="text-xs text-gray-400">intensity</div>
                  </div>
                  <div className="bg-[#1A2526] p-2 rounded text-center">
                    <div className="text-gray-400 text-xs">Tomorrow</div>
                    <div className="text-xl font-semibold">78%</div>
                    <div className="text-xs text-gray-400">Predicted</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Wildfire Category Distribution */}
              <div className="bg-[#1E2D3A] p-4 rounded">
                <h3 className="text-lg font-semibold mb-4">
                  Wildfire Type Distribution
                </h3>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>Forest Fires</span>
                    <span className="text-red-500">12 Active</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>Brush Fires</span>
                    <span className="text-orange-500">8 Active</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: "30%" }}
                    ></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>Grassland Fires</span>
                    <span className="text-yellow-500">5 Active</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: "15%" }}
                    ></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>Urban Interface Fires</span>
                    <span className="text-green-500">3 Active</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "10%" }}
                    ></div>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white p-2 rounded mt-4">
                  View Detailed Analysis
                </button>
              </div>
            </div>

            {/* AI-Driven Fire Spread Prediction */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">
                AI-Driven Fire Spread Prediction
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="h-60 flex items-center justify-center border border-gray-600 rounded mb-2">
                    {/* Placeholder for fire spread prediction map */}
                    <p className="text-gray-400">
                      Predicted Fire Spread (Next 48 Hours)
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    Using AI-driven wildfire behavior modeling based on weather,
                    topography, and fuel conditions
                  </div>
                </div>
                <div className="flex flex-col space-y-4">
                  <div className="bg-[#1A2526] p-4 rounded flex-grow">
                    <h4 className="font-semibold mb-2">AI Confidence Level</h4>
                    <div className="text-4xl font-bold mb-1">78%</div>
                    <div className="text-sm text-gray-400 mb-4">
                      Moderate Confidence
                    </div>
                    <div className="text-xs text-gray-400">
                      Based on current weather conditions, vegetation dryness,
                      and terrain
                    </div>
                  </div>
                  <div className="bg-[#1A2526] p-4 rounded flex-grow">
                    <h4 className="font-semibold mb-2">
                      Critical Spread Points
                    </h4>
                    <div className="flex justify-between">
                      <span className="text-sm">Location:</span>
                      <span className="text-yellow-400">
                        Central India Forest
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Expected Rate:</span>
                      <span className="text-orange-400">3.5 ha/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Wind Direction:</span>
                      <span className="text-red-400">SE to NW</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Air Quality Assessment */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">
                Air Quality Assessment
              </h3>
              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span>PM2.5 Levels</span>
                  <span className="text-red-400">
                    Hazardous (250-300 µg/m³)
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span>Smoke Dispersion</span>
                  <span className="text-orange-400">Poor (25-50km radius)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span>Visibility</span>
                  <span className="text-yellow-400">Reduced (1-3km)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: "45%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Active Incidents */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">
                Active Wildfire Incidents
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
            {/* Wildfire Alerts Card */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Wildfire Alerts</h3>
                <span className="bg-red-600 text-xs px-2 py-1 rounded">
                  5 New
                </span>
              </div>
              {/* Alert items */}
              <div className="space-y-3">
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-red-400 font-semibold">
                      New Outbreak
                    </span>
                    <span className="text-xs text-gray-400">15m ago</span>
                  </div>
                  <p className="text-sm">
                    Forest fire detected in Central India
                  </p>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 font-semibold">
                      Wind Advisory
                    </span>
                    <span className="text-xs text-gray-400">45m ago</span>
                  </div>
                  <p className="text-sm">
                    25-30 km/h winds expected to accelerate fire spread
                  </p>
                </div>
              </div>
              <div className="text-center mt-4">
                <button className="text-blue-400 text-sm">
                  View All Wildfire Alerts
                </button>
              </div>
            </div>

            {/* Most Vulnerable Areas */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">
                Most Vulnerable Areas
              </h3>
              <div className="space-y-3">
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Central India Forests</h4>
                    <span className="bg-red-600 text-xs px-2 py-1 rounded">
                      Severe
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Population at Risk: 75,000
                  </div>
                  <div className="text-sm text-gray-400">
                    Fire Spread Rate: 3.5 ha/hr
                  </div>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Maharashtra Western Ghats</h4>
                    <span className="bg-red-600 text-xs px-2 py-1 rounded">
                      Severe
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Population at Risk: 62,000
                  </div>
                  <div className="text-sm text-gray-400">
                    Containment Level: 15%
                  </div>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Northern India Grasslands</h4>
                    <span className="bg-yellow-600 text-xs px-2 py-1 rounded">
                      Moderate
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Population at Risk: 45,000
                  </div>
                  <div className="text-sm text-gray-400">
                    Critical Infrastructure: 8 sites
                  </div>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">
                      Southern India Forest Edge
                    </h4>
                    <span className="bg-yellow-600 text-xs px-2 py-1 rounded">
                      Moderate
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Population at Risk: 38,000
                  </div>
                  <div className="text-sm text-gray-400">
                    Urban Interface Risk: High
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <button className="text-blue-400 text-sm">
                  View All Vulnerable Areas
                </button>
              </div>
            </div>

            {/* Environmental Conditions */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">
                Environmental Conditions
              </h3>
              <div className="space-y-2">
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <h4 className="font-semibold text-sm">Temperature</h4>
                  <p className="text-sm text-gray-400">
                    36-42°C (Above normal by 5°C)
                  </p>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <h4 className="font-semibold text-sm">Wind Pattern</h4>
                  <p className="text-sm text-gray-400">SE to NW, 25-30 km/h</p>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <h4 className="font-semibold text-sm">Humidity</h4>
                  <p className="text-sm text-gray-400">15-25% (Very low)</p>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <h4 className="font-semibold text-sm">
                    Fuel Moisture Content
                  </h4>
                  <p className="text-sm text-gray-400">5-8% (Critically low)</p>
                </div>
              </div>
            </div>

            {/* Response Resources */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">Response Resources</h3>
              <div className="space-y-2">
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <h4 className="font-semibold text-sm">Firefighting Teams</h4>
                  <p className="text-sm text-gray-400">
                    32 teams deployed (285 personnel)
                  </p>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <h4 className="font-semibold text-sm">Aerial Support</h4>
                  <p className="text-sm text-gray-400">
                    4 water bombers, 2 surveillance aircraft
                  </p>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <h4 className="font-semibold text-sm">
                    Fire Breaks Established
                  </h4>
                  <p className="text-sm text-gray-400">
                    75 km (42% of required)
                  </p>
                </div>
                <div className="text-center mt-4">
                  <button className="text-blue-400 text-sm">
                    View Resource Allocation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
