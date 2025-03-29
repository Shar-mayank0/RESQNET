interface StatsCardProps {
  type: string;
  count: number;
  change: string;
  iconColor: string;
}

export default function StatsCard({
  type,
  count,
  change,
  iconColor,
}: StatsCardProps) {
  return (
    <div className="bg-[#2A3A3B] text-white p-4 rounded-lg flex items-center space-x-4">
      <span className={`w-8 h-8 ${iconColor} rounded`}></span>
      <div>
        <h3 className="text-sm font-semibold">{type}</h3>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-xs text-gray-400">{change}</p>
      </div>
    </div>
  );
}
