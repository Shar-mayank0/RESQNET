interface IncidentRowProps {
  type: string;
  location: string;
  severity: "High" | "Medium" | "Low";
  time: string;
  status: "In Progress" | "Resolved";
  iconColor: string;
}

export default function IncidentRow({
  type,
  location,
  severity,
  time,
  status,
  iconColor,
}: IncidentRowProps) {
  return (
    <tr className="border-b border-gray-700">
      <td className="p-2 flex items-center">
        <span className={`w-5 h-5 ${iconColor} rounded mr-2`}></span>
        {type}
      </td>
      <td className="p-2">{location}</td>
      <td className="p-2">
        <span
          className={`px-2 py-1 rounded text-xs ${
            severity === "High" ? "bg-red-500" : "bg-yellow-500"
          } text-white`}
        >
          {severity}
        </span>
      </td>
      <td className="p-2">{time}</td>
      <td className="p-2">
        <span
          className={`text-xs ${
            status === "In Progress" ? "text-yellow-400" : "text-green-400"
          }`}
        >
          {status}
        </span>
      </td>
      <td className="p-2">
        <button className="text-xs text-gray-300 border border-gray-300 px-2 py-1 rounded">
          Details
        </button>
      </td>
    </tr>
  );
}
