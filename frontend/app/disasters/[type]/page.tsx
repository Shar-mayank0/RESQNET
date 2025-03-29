"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DisasterMap from "../../components/Maps";
import IncidentRow from "../../components/IncidentRow";

interface Disaster {
  id: number;
  lat: number;
  lng: number;
  risk: "High" | "Medium" | "Low";
}

interface DisasterData {
  floods: Disaster[];
  earthquakes: Disaster[];
  cyclones: Disaster[];
  wildfires: Disaster[];
  landslides: Disaster[];
}

type Severity = "High" | "Medium" | "Low";

export default function DisasterPage() {
  const { type } = useParams() as { type: keyof DisasterData };
  const disasterType = type.charAt(0).toUpperCase() + type.slice(1);

  const [disasters] = useState<DisasterData>({
    floods: [
      { id: 1, lat: 13.0827, lng: 80.2707, risk: "High" }, // Chennai
      { id: 2, lat: 25.3176, lng: 82.9739, risk: "Medium" }, // Varanasi
    ],
    earthquakes: [
      { id: 3, lat: 34.0837, lng: 74.7973, risk: "Medium" }, // Srinagar
    ],
    cyclones: [
      { id: 4, lat: 19.076, lng: 72.8777, risk: "Low" }, // Mumbai
    ],
    wildfires: [
      { id: 5, lat: 30.3165, lng: 78.0322, risk: "High" }, // Dehradun
    ],
    landslides: [
      { id: 6, lat: 31.1048, lng: 77.1734, risk: "Medium" }, // Shimla
    ],
  });

  const incidents: Record<
    string,
    Array<{
      type: string;
      location: string;
      severity: Severity;
      time: string;
      status: "In Progress" | "Resolved";
      iconColor: string;
    }>
  > = {
    floods: [
      {
        type: "Flood",
        location: "Ganges Basin, Bihar",
        severity: "High",
        time: "3h ago",
        status: "In Progress",
        iconColor: "bg-blue-500",
      },
    ],
    earthquakes: [
      {
        type: "Earthquake",
        location: "Himalayan Region",
        severity: "Medium",
        time: "2d ago",
        status: "Resolved",
        iconColor: "bg-yellow-500",
      },
    ],
    cyclones: [
      {
        type: "Cyclone",
        location: "Mumbai Coast",
        severity: "Low",
        time: "1d ago",
        status: "In Progress",
        iconColor: "bg-green-500",
      },
    ],
    wildfires: [
      {
        type: "Wildfire",
        location: "Uttarakhand Forests",
        severity: "High",
        time: "5h ago",
        status: "In Progress",
        iconColor: "bg-red-500",
      },
    ],
    landslides: [
      {
        type: "Landslide",
        location: "Shimla Hills",
        severity: "Medium",
        time: "1d ago",
        status: "Resolved",
        iconColor: "bg-gray-500",
      },
    ],
  };

  const disasterData = disasters[type] || [];
  const incidentData = incidents[type] || [];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
            ← Back to Dashboard
          </Link>
          <h2 className="text-xl font-semibold">{disasterType} Overview</h2>
        </div>
        <div className="flex space-x-2">
          <select className="bg-[#2A3A3B] text-white p-2 rounded">
            <option>All Regions</option>
          </select>
          <select className="bg-[#2A3A3B] text-white p-2 rounded">
            <option>Last 24 Hours</option>
          </select>
        </div>
      </div>

      {/* Map */}
      <div className="mb-6">
        <DisasterMap disasters={disasterData} />
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

      {/* Incidents */}
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Active {disasterType} Incidents
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
            {incidentData.map((incident, index) => (
              <IncidentRow key={index} {...incident} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
