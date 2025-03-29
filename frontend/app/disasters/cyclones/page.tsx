"use client";

import { useState } from "react";
import Link from "next/link";
import DisasterMap from "../../components/Maps";
import IncidentRow from "../../components/IncidentRow";

interface Cyclone {
  id: number;
  lat: number;
  lng: number;
  windSpeed: number;
  pressure: number;
  risk: "High" | "Medium" | "Low";
}

export default function CyclonesPage() {
  // State for cyclone data
  const [cyclones] = useState<Cyclone[]>([
    {
      id: 1,
      lat: 15.9129,
      lng: 84.124,
      windSpeed: 175,
      pressure: 950,
      risk: "High",
    }, // Bay of Bengal
    {
      id: 2,
      lat: 13.0827,
      lng: 80.2707,
      windSpeed: 165,
      pressure: 958,
      risk: "High",
    }, // Chennai Coast
    {
      id: 3,
      lat: 17.6868,
      lng: 83.2185,
      windSpeed: 120,
      pressure: 970,
      risk: "Medium",
    }, // Visakhapatnam
    {
      id: 4,
      lat: 20.2961,
      lng: 85.8245,
      windSpeed: 85,
      pressure: 990,
      risk: "Low",
    }, // Odisha Coast
  ]);

  // Predicted cyclone paths
  const cyclonePaths: { id: number; path: [number, number][] }[] = [
    {
      id: 1,
      path: [
        [15.9129, 84.124], // Bay of Bengal
        [14.9, 83.5],
        [14.0, 82.8],
        [13.1, 82.0],
        [13.0827, 80.2707], // Chennai
      ],
    },
    {
      id: 2,
      path: [
        [17.6868, 83.2185], // Visakhapatnam
        [18.1, 83.8],
        [18.5, 84.5],
        [19.0, 85.0],
        [20.2961, 85.8245], // Odisha
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
      type: "Cyclone",
      location: "Bay of Bengal",
      severity: "High",
      time: "3h ago",
      status: "In Progress",
      iconColor: "bg-red-500",
    },
    {
      type: "Storm Surge",
      location: "Chennai Coast",
      severity: "High",
      time: "5h ago",
      status: "In Progress",
      iconColor: "bg-red-500",
    },
    {
      type: "Flooding",
      location: "Andhra Pradesh Coast",
      severity: "Medium",
      time: "12h ago",
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
            <h2 className="text-xl font-semibold">Cyclones Overview</h2>
          </div>
          <div className="flex space-x-2">
            <select className="bg-[#2A3A3B] text-white p-2 rounded">
              <option>All Coastal Regions</option>
              <option>Bay of Bengal</option>
              <option>Arabian Sea</option>
              <option>Eastern Coast</option>
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
                <div className="text-gray-400 mb-1">Population at Risk</div>
                <div className="text-2xl font-bold">1.2M</div>
                <div className="text-sm text-gray-400">+250K in last 24h</div>
              </div>
              <div className="bg-[#1E2D3A] p-4 rounded">
                <div className="text-gray-400 mb-1">Evacuation Centers</div>
                <div className="text-2xl font-bold">78</div>
                <div className="text-sm text-gray-400">+12 in last 24h</div>
              </div>
              <div className="bg-[#1E2D3A] p-4 rounded">
                <div className="text-gray-400 mb-1">Highest Wind Speed</div>
                <div className="text-2xl font-bold">175 km/h</div>
                <div className="text-sm text-gray-400">
                  Bay of Bengal, 3h ago
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <DisasterMap disasters={cyclones} routes={cyclonePaths} />
              <div className="flex justify-center mt-2 space-x-4">
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
                  High Risk (Wind &gt; 150 km/h)
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></span>
                  Medium Risk (Wind 100-150 km/h)
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                  Low Risk (Wind &lt; 100 km/h)
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-blue-500 mr-2"></span>
                  Predicted Path
                </div>
              </div>
            </div>

            {/* Two Column Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column - Wind Speed Tracking */}
              <div className="bg-[#1E2D3A] p-4 rounded">
                <h3 className="text-lg font-semibold mb-4">
                  Wind Speed Tracking
                </h3>
                <div className="h-40 mb-4 flex items-center justify-center border border-gray-600 rounded">
                  {/* Placeholder for wind speed chart */}
                  <p className="text-gray-400">
                    Wind Speed Tracking (Last 72 Hours)
                  </p>
                </div>
                <div className="text-xs text-gray-400 mb-4">
                  Data sources: IMD, RSMC, Doppler Weather Radar Network
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#1A2526] p-2 rounded text-center">
                    <div className="text-gray-400 text-xs">Yesterday</div>
                    <div className="text-xl font-semibold">145</div>
                    <div className="text-xs text-gray-400">km/h</div>
                  </div>
                  <div className="bg-[#1A2526] p-2 rounded text-center">
                    <div className="text-gray-400 text-xs">Today</div>
                    <div className="text-xl font-semibold">175</div>
                    <div className="text-xs text-gray-400">km/h</div>
                  </div>
                  <div className="bg-[#1A2526] p-2 rounded text-center">
                    <div className="text-gray-400 text-xs">Tomorrow</div>
                    <div className="text-xl font-semibold">160</div>
                    <div className="text-xs text-gray-400">Predicted</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Cyclone Category Distribution */}
              <div className="bg-[#1E2D3A] p-4 rounded">
                <h3 className="text-lg font-semibold mb-4">
                  Cyclone Intensity Distribution
                </h3>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>Category 5 (≥ 170 km/h)</span>
                    <span className="text-red-500">1 Cyclone</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: "10%" }}
                    ></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>Category 4 (130-170 km/h)</span>
                    <span className="text-orange-500">1 Cyclone</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: "10%" }}
                    ></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>Category 3 (110-130 km/h)</span>
                    <span className="text-yellow-500">1 Cyclone</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: "10%" }}
                    ></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>Category 1-2 (&lt; 110 km/h)</span>
                    <span className="text-green-500">1 Cyclone</span>
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

            {/* AI-Driven Cyclone Path Prediction */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">
                AI-Driven Cyclone Path Prediction
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="h-60 flex items-center justify-center border border-gray-600 rounded mb-2">
                    {/* Placeholder for cyclone path prediction map */}
                    <p className="text-gray-400">
                      Predicted Cyclone Path (Next 72 Hours)
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    Using AI-driven meteorological analysis and historical
                    patterns
                  </div>
                </div>
                <div className="flex flex-col space-y-4">
                  <div className="bg-[#1A2526] p-4 rounded flex-grow">
                    <h4 className="font-semibold mb-2">AI Confidence Level</h4>
                    <div className="text-4xl font-bold mb-1">82%</div>
                    <div className="text-sm text-gray-400 mb-4">
                      High Confidence
                    </div>
                    <div className="text-xs text-gray-400">
                      Based on current meteorological data and satellite imagery
                    </div>
                  </div>
                  <div className="bg-[#1A2526] p-4 rounded flex-grow">
                    <h4 className="font-semibold mb-2">Landfall Prediction</h4>
                    <div className="flex justify-between">
                      <span className="text-sm">Location:</span>
                      <span className="text-yellow-400">Chennai Coast</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Expected Time:</span>
                      <span className="text-orange-400">~18 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Wind Speed:</span>
                      <span className="text-red-400">150-180 km/h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flood Risk Assessment */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">
                Flood Risk Assessment
              </h3>
              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span>Coastal Flooding</span>
                  <span className="text-red-400">High Risk (3-5m surge)</span>
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
                  <span>Urban Flooding</span>
                  <span className="text-orange-400">
                    Medium Risk (100-150mm rainfall)
                  </span>
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
                  <span>River Overflow</span>
                  <span className="text-yellow-400">
                    Medium Risk (2-3m above normal)
                  </span>
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
                Active Cyclone Incidents
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
            {/* Cyclone Alerts Card */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Cyclone Alerts</h3>
                <span className="bg-red-600 text-xs px-2 py-1 rounded">
                  4 New
                </span>
              </div>
              {/* Alert items */}
              <div className="space-y-3">
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-red-400 font-semibold">
                      Cyclonic Storm
                    </span>
                    <span className="text-xs text-gray-400">30m ago</span>
                  </div>
                  <p className="text-sm">
                    Intensified to 175 km/h - Bay of Bengal
                  </p>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 font-semibold">
                      Storm Surge Warning
                    </span>
                    <span className="text-xs text-gray-400">1h ago</span>
                  </div>
                  <p className="text-sm">
                    3-5m surge expected along Chennai coast
                  </p>
                </div>
              </div>
              <div className="text-center mt-4">
                <button className="text-blue-400 text-sm">
                  View All Cyclone Alerts
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
                    <h4 className="font-semibold">Chennai, Tamil Nadu</h4>
                    <span className="bg-red-600 text-xs px-2 py-1 rounded">
                      Severe
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Population at Risk: 320,000
                  </div>
                  <div className="text-sm text-gray-400">
                    Expected Landfall: ~18 hours
                  </div>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Mamallapuram, Tamil Nadu</h4>
                    <span className="bg-red-600 text-xs px-2 py-1 rounded">
                      Severe
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Population at Risk: 175,000
                  </div>
                  <div className="text-sm text-gray-400">
                    Expected Rainfall: 200-250mm
                  </div>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Nellore, Andhra Pradesh</h4>
                    <span className="bg-yellow-600 text-xs px-2 py-1 rounded">
                      Moderate
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Population at Risk: 110,000
                  </div>
                  <div className="text-sm text-gray-400">
                    Expected Rainfall: 150-200mm
                  </div>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Puducherry, UT</h4>
                    <span className="bg-yellow-600 text-xs px-2 py-1 rounded">
                      Moderate
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Population at Risk: 95,000
                  </div>
                  <div className="text-sm text-gray-400">
                    Expected Storm Surge: 2-3m
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <button className="text-blue-400 text-sm">
                  View All Vulnerable Areas
                </button>
              </div>
            </div>

            {/* Meteorological Information */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">
                Meteorological Information
              </h3>
              <div className="space-y-2">
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <h4 className="font-semibold text-sm">
                    Sea Surface Temperature
                  </h4>
                  <p className="text-sm text-gray-400">
                    29-31°C (Above normal by 1.5°C)
                  </p>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <h4 className="font-semibold text-sm">Wind Pattern</h4>
                  <p className="text-sm text-gray-400">
                    NE to SW, 175 km/h sustained
                  </p>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <h4 className="font-semibold text-sm">
                    Atmospheric Pressure
                  </h4>
                  <p className="text-sm text-gray-400">
                    950 hPa (Central pressure)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
