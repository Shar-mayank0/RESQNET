"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import LiveAlert from "../components/LiveAlert";
import IncidentRow from "../components/IncidentRow";
import ResourceBar from "../components/ResourceBar";
import Weather from "../components/Weather";
import dynamic from "next/dynamic";

interface Disaster {
  id: number;
  lat: number;
  lng: number;
  risk: "High" | "Medium" | "Low";
}

interface Stat {
  type: string;
  count: number;
  change: string;
  iconColor: string;
}

interface Alert {
  title: string;
  description: string;
  time: string;
  type: "Critical" | "Warning" | "Information";
}

interface Incident {
  type: string;
  location: string;
  severity: "High" | "Medium" | "Low";
  time: string;
  status: "In Progress" | "Resolved";
  iconColor: string;
}

interface Resource {
  name: string;
  percentage: number;
  color: string;
}
const DynamicDisasterMap = dynamic(() => import("../components/Maps"), {
  ssr: false, // This will only load the component on the client side
});
export default function Home() {
  const [disasters] = useState<Disaster[]>([
    { id: 1, lat: 13.0827, lng: 80.2707, risk: "High" }, // Chennai
    { id: 2, lat: 19.076, lng: 72.8777, risk: "Medium" }, // Mumbai
    { id: 3, lat: 28.7041, lng: 77.1025, risk: "Low" }, // Delhi
  ]);

  const stats: Stat[] = [
    {
      type: "Floods",
      count: 12,
      change: "+3 from yesterday",
      iconColor: "bg-blue-500",
    },
    {
      type: "Earthquakes",
      count: 5,
      change: "+1 from yesterday",
      iconColor: "bg-yellow-500",
    },
    {
      type: "Cyclones",
      count: 3,
      change: "No change",
      iconColor: "bg-green-500",
    },
    {
      type: "Wildfires",
      count: 8,
      change: "+2 from yesterday",
      iconColor: "bg-red-500",
    },
  ];

  const alerts: Alert[] = [
    {
      title: "Critical Flood Alert",
      description:
        "Flash flood warning issued for Ganges Basin. Evacuate immediately.",
      time: "10 min ago",
      type: "Critical",
    },
    {
      title: "Seismic Activity",
      description: "Magnitude 4.2 earthquake in Himalayan Region.",
      time: "25 min ago",
      type: "Warning",
    },
    {
      title: "Heavy Rainfall",
      description:
        "Heavy rainfall predicted in coastal areas for next 48 hours.",
      time: "1 hour ago",
      type: "Information",
    },
  ];

  const incidents: Incident[] = [
    {
      type: "Flood",
      location: "Ganges Basin, Bihar",
      severity: "High",
      time: "3h ago",
      status: "In Progress",
      iconColor: "bg-blue-500",
    },
    {
      type: "Wildfire",
      location: "Uttarakhand Forests",
      severity: "High",
      time: "5h ago",
      status: "In Progress",
      iconColor: "bg-red-500",
    },
    {
      type: "Earthquake",
      location: "Himalayan Region",
      severity: "Medium",
      time: "2d ago",
      status: "Resolved",
      iconColor: "bg-yellow-500",
    },
  ];

  const resources: Resource[] = [
    { name: "Emergency Response Teams", percentage: 78, color: "bg-green-500" },
    { name: "Medical Supplies", percentage: 45, color: "bg-yellow-500" },
    { name: "Food & Water", percentage: 32, color: "bg-red-500" },
    { name: "Shelter Capacity", percentage: 85, color: "bg-green-500" },
  ];

  return (
    <div className="flex min-h-screen bg-[#1A2526] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Disaster Overview</h2>
          <div className="flex space-x-2">
            <select className="bg-[#2A3A3B] text-white p-2 rounded">
              <option>All Regions</option>
            </select>
            <select className="bg-[#2A3A3B] text-white p-2 rounded">
              <option>Last 24 Hours</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <StatsCard key={stat.type} {...stat} />
          ))}
        </div>

        {/* Map and Alerts */}
        <div className="flex space-x-4 mb-6">
          <div className="w-2/3">
            <DynamicDisasterMap
              disasters={disasters}
              routes={[
                {
                  id: 1,
                  path: [
                    [13.0827, 80.2707],
                    [19.076, 72.8777],
                  ],
                },
                {
                  id: 2,
                  path: [
                    [19.076, 72.8777],
                    [28.7041, 77.1025],
                  ],
                },
              ]}
            />
            <div className="flex justify-center mt-2 space-x-4">
              <div className="flex items-center">
                <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
                High Risk
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></span>
                Medium Risk
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                Low Risk
              </div>
            </div>
          </div>
          <div className="w-1/3">
            <div className="relative">
              <h3 className="text-lg font-semibold mb-2">Live Alerts</h3>
              <span className="absolute top-0 right-0 bg-red-500 text-xs px-2 py-1 rounded-full">
                3 NEW
              </span>
            </div>
            {alerts.map((alert, index) => (
              <LiveAlert key={index} {...alert} />
            ))}
            <button className="text-sm text-gray-400 mt-2">
              View All Alerts
            </button>
          </div>
        </div>

        {/* Active Incidents and Resources */}
        <div className="flex space-x-4">
          <div className="w-2/3">
            <h3 className="text-lg font-semibold mb-2">Active Incidents</h3>
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
            <button className="text-sm text-gray-400 mt-2">View All</button>
          </div>
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-2">
              Resource Availability
            </h3>
            {resources.map((resource, index) => (
              <ResourceBar key={index} {...resource} />
            ))}
          </div>
        </div>
        <Weather />
      </div>
    </div>
  );
}
