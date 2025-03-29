"use client";

import { useState } from "react";
import Link from "next/link";
import DisasterMap from "../../components/Maps";
import IncidentRow from "../../components/IncidentRow";

interface Earthquake {
  id: number;
  lat: number;
  lng: number;
  magnitude: number;
  depth: number;
  risk: "High" | "Medium" | "Low";
}

export default function EarthquakesPage() {
  // State for earthquake data
  const [earthquakes] = useState<Earthquake[]>([
    {
      id: 1,
      lat: 28.7041,
      lng: 77.1025,
      magnitude: 5.8,
      depth: 12,
      risk: "High",
    }, // Delhi
    {
      id: 2,
      lat: 34.0837,
      lng: 74.7973,
      magnitude: 6.2,
      depth: 15,
      risk: "High",
    }, // Kashmir
    {
      id: 3,
      lat: 30.7333,
      lng: 79.0667,
      magnitude: 4.5,
      depth: 8,
      risk: "Medium",
    }, // Uttarakhand
    {
      id: 4,
      lat: 23.0225,
      lng: 72.5714,
      magnitude: 3.8,
      depth: 5,
      risk: "Low",
    }, // Gujarat
  ]);

  // Fault lines data
  const faultLines: { id: number; path: [number, number][] }[] = [
    {
      id: 1,
      path: [
        [34.0837, 74.7973], // Kashmir
        [33.9, 75.1],
        [33.5, 75.5],
      ],
    },
    {
      id: 2,
      path: [
        [30.7333, 79.0667], // Uttarakhand
        [30.6, 79.2],
        [30.4, 79.4],
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
      type: "Earthquake",
      location: "Kashmir Valley",
      severity: "High",
      time: "2h ago",
      status: "In Progress",
      iconColor: "bg-red-500",
    },
    {
      type: "Aftershock",
      location: "Uttarakhand Himalayas",
      severity: "Medium",
      time: "4h ago",
      status: "Monitoring",
      iconColor: "bg-orange-500",
    },
    {
      type: "Landslide",
      location: "Shimla, Himachal Pradesh",
      severity: "High",
      time: "1d ago",
      status: "In Progress",
      iconColor: "bg-red-500",
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
            <h2 className="text-xl font-semibold">Earthquakes Overview</h2>
          </div>
          <div className="flex space-x-2">
            <select className="bg-[#2A3A3B] text-white p-2 rounded">
              <option>All Regions</option>
              <option>Himalayan Belt</option>
              <option>North Eastern Zone</option>
              <option>Western Zone</option>
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
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-gray-400">+2 in last 24h</div>
              </div>
              <div className="bg-[#1E2D3A] p-4 rounded">
                <div className="text-gray-400 mb-1">Affected Population</div>
                <div className="text-2xl font-bold">950K</div>
                <div className="text-sm text-gray-400">+150K in last 24h</div>
              </div>
              <div className="bg-[#1E2D3A] p-4 rounded">
                <div className="text-gray-400 mb-1">Evacuation Centers</div>
                <div className="text-2xl font-bold">42</div>
                <div className="text-sm text-gray-400">+6 in last 24h</div>
              </div>
              <div className="bg-[#1E2D3A] p-4 rounded">
                <div className="text-gray-400 mb-1">Largest Magnitude</div>
                <div className="text-2xl font-bold">6.2</div>
                <div className="text-sm text-gray-400">Kashmir, 2h ago</div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <DisasterMap disasters={earthquakes} routes={faultLines} />
              <div className="flex justify-center mt-2 space-x-4">
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
                  High Risk (Mag &gt; 5.5)
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></span>
                  Medium Risk (Mag 4-5.5)
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                  Low Risk (Mag &lt; 4)
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-red-500 mr-2"></span>
                  Fault Lines
                </div>
              </div>
            </div>

            {/* Two Column Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column - Seismic Activity */}
              <div className="bg-[#1E2D3A] p-4 rounded">
                <h3 className="text-lg font-semibold mb-4">
                  Live Seismic Activity
                </h3>
                <div className="h-40 mb-4 flex items-center justify-center border border-gray-600 rounded">
                  {/* Placeholder for seismic wave chart */}
                  <p className="text-gray-400">
                    Seismic Activity (Last 7 Days)
                  </p>
                </div>
                <div className="text-xs text-gray-400 mb-4">
                  Data sources: IMD, USGS, National Seismological Network
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#1A2526] p-2 rounded text-center">
                    <div className="text-gray-400 text-xs">Yesterday</div>
                    <div className="text-xl font-semibold">12</div>
                    <div className="text-xs text-gray-400">Events</div>
                  </div>
                  <div className="bg-[#1A2526] p-2 rounded text-center">
                    <div className="text-gray-400 text-xs">Today</div>
                    <div className="text-xl font-semibold">18</div>
                    <div className="text-xs text-gray-400">Events</div>
                  </div>
                  <div className="bg-[#1A2526] p-2 rounded text-center">
                    <div className="text-gray-400 text-xs">Tomorrow</div>
                    <div className="text-xl font-semibold">15</div>
                    <div className="text-xs text-gray-400">Predicted</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Magnitude & Depth Distribution */}
              <div className="bg-[#1E2D3A] p-4 rounded">
                <h3 className="text-lg font-semibold mb-4">
                  Magnitude Distribution
                </h3>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>Magnitude &gt; 6.0</span>
                    <span className="text-red-500">2 Events</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: "15%" }}
                    ></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>Magnitude 5.0-6.0</span>
                    <span className="text-orange-500">5 Events</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: "35%" }}
                    ></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>Magnitude 4.0-5.0</span>
                    <span className="text-yellow-500">8 Events</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: "50%" }}
                    ></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>Magnitude &lt; 4.0</span>
                    <span className="text-green-500">15 Events</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "90%" }}
                    ></div>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white p-2 rounded mt-4">
                  View Detailed Analysis
                </button>
              </div>
            </div>

            {/* AI-Driven Aftershock Prediction */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">
                AI-Driven Aftershock Prediction
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="h-60 flex items-center justify-center border border-gray-600 rounded mb-2">
                    {/* Placeholder for aftershock prediction map */}
                    <p className="text-gray-400">
                      Aftershock Prediction Map (Next 72 Hours)
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    Using AI-driven seismic pattern recognition
                  </div>
                </div>
                <div className="flex flex-col space-y-4">
                  <div className="bg-[#1A2526] p-4 rounded flex-grow">
                    <h4 className="font-semibold mb-2">AI Confidence Level</h4>
                    <div className="text-4xl font-bold mb-1">78%</div>
                    <div className="text-sm text-gray-400 mb-4">
                      Medium Confidence
                    </div>
                    <div className="text-xs text-gray-400">
                      Based on tectonic activity and historical data
                    </div>
                  </div>
                  <div className="bg-[#1A2526] p-4 rounded flex-grow">
                    <h4 className="font-semibold mb-2">Expected Aftershocks</h4>
                    <div className="flex justify-between">
                      <span className="text-sm">Magnitude 4+:</span>
                      <span className="text-yellow-400">6-8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Magnitude 5+:</span>
                      <span className="text-orange-400">2-3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Magnitude 6+:</span>
                      <span className="text-red-400">0-1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Structural Damage Assessment */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">
                Structural Damage Assessment
              </h3>
              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span>Heavily Damaged Buildings</span>
                  <span className="text-red-400">43/2156</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: "2%" }}
                  ></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span>Partially Damaged Buildings</span>
                  <span className="text-orange-400">186/2156</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: "8.6%" }}
                  ></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span>Critical Infrastructure</span>
                  <span className="text-yellow-400">6/124</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: "4.8%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Active Incidents */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">
                Active Earthquake Incidents
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
            {/* Earthquake Alerts Card */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Earthquake Alerts</h3>
                <span className="bg-red-600 text-xs px-2 py-1 rounded">
                  5 New
                </span>
              </div>
              {/* Alert items */}
              <div className="space-y-3">
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 font-semibold">
                      Moderate Shaking
                    </span>
                    <span className="text-xs text-gray-400">15m ago</span>
                  </div>
                  <p className="text-sm">M4.2 - 10km NE of Uttarkashi</p>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-red-400 font-semibold">
                      Strong Shaking
                    </span>
                    <span className="text-xs text-gray-400">2h ago</span>
                  </div>
                  <p className="text-sm">M6.2 - 25km W of Srinagar</p>
                </div>
              </div>
              <div className="text-center mt-4">
                <button className="text-blue-400 text-sm">
                  View All Earthquake Alerts
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
                    <h4 className="font-semibold">Baramulla, Kashmir</h4>
                    <span className="bg-red-600 text-xs px-2 py-1 rounded">
                      Severe
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Population Affected: 156,000
                  </div>
                  <div className="text-sm text-gray-400">
                    Damaged Buildings: 132
                  </div>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Kupwara, Kashmir</h4>
                    <span className="bg-red-600 text-xs px-2 py-1 rounded">
                      Severe
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Population Affected: 112,000
                  </div>
                  <div className="text-sm text-gray-400">
                    Damaged Buildings: 97
                  </div>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Uttarkashi, Uttarakhand</h4>
                    <span className="bg-yellow-600 text-xs px-2 py-1 rounded">
                      Moderate
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Population Affected: 75,000
                  </div>
                  <div className="text-sm text-gray-400">
                    Damaged Buildings: 51
                  </div>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Pithoragarh, Uttarakhand</h4>
                    <span className="bg-yellow-600 text-xs px-2 py-1 rounded">
                      Moderate
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Population Affected: 42,000
                  </div>
                  <div className="text-sm text-gray-400">
                    Damaged Buildings: 28
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <button className="text-blue-400 text-sm">
                  View All Affected Areas
                </button>
              </div>
            </div>

            {/* Tectonic Information */}
            <div className="bg-[#1E2D3A] p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">
                Tectonic Information
              </h3>
              <div className="space-y-2">
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <h4 className="font-semibold text-sm">Active Fault Lines</h4>
                  <p className="text-sm text-gray-400">
                    Himalayan Frontal Thrust, Main Boundary Thrust
                  </p>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <h4 className="font-semibold text-sm">Tectonic Plates</h4>
                  <p className="text-sm text-gray-400">
                    Indian Plate, Eurasian Plate
                  </p>
                </div>
                <div className="bg-[#2A3A3B] p-3 rounded">
                  <h4 className="font-semibold text-sm">
                    Recent Plate Movement
                  </h4>
                  <p className="text-sm text-gray-400">5.6cm/year northward</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
