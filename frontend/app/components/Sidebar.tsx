import Link from "next/link";

export default function Sidebar() {
  const disasterTypes = [
    { name: "Floods", path: "/disasters/floods", color: "bg-blue-500" },
    {
      name: "Earthquakes",
      path: "/disasters/earthquakes",
      color: "bg-yellow-500",
    },
    { name: "Cyclones", path: "/disasters/cyclones", color: "bg-green-500" },
    { name: "Wildfires", path: "/disasters/wildfires", color: "bg-red-500" },
    { name: "Landslides", path: "/disasters/landslides", color: "bg-gray-500" },
  ];

  return (
    <div className="w-64 h-screen bg-[#1A2526] text-white flex flex-col p-4">
      {/* Title */}
      <div className="flex items-center mb-8">
        <svg
          className="w-6 h-6 mr-2 text-red-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L3 12h3v8h6v-6h4v6h6v-8h3L12 2z" />
        </svg>
        <h1 className="text-xl font-bold">DisasterSync</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <h2 className="text-sm font-semibold text-gray-400 mb-2">
          DISASTER TYPES
        </h2>
        <ul>
          {disasterTypes.map((disaster) => (
            <li key={disaster.name} className="mb-2">
              <Link
                href={disaster.path}
                className="flex items-center p-2 rounded hover:bg-[#2A3A3B]"
              >
                <span
                  className={`w-5 h-5 mr-2 ${disaster.color} rounded`}
                ></span>
                {disaster.name}
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="text-sm font-semibold text-gray-400 mt-4 mb-2">
          DASHBOARD
        </h2>
        <ul>
          <li className="mb-2">
            <Link
              href="#"
              className="flex items-center p-2 rounded hover:bg-[#2A3A3B]"
            >
              <span className="w-5 h-5 mr-2 text-purple-500">📊</span>
              Analytics
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="#"
              className="flex items-center p-2 rounded hover:bg-[#2A3A3B]"
            >
              <span className="w-5 h-5 mr-2 text-green-500">📚</span>
              Resources
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="#"
              className="flex items-center p-2 rounded hover:bg-[#2A3A3B]"
            >
              <span className="w-5 h-5 mr-2 text-gray-500">⚙️</span>
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
