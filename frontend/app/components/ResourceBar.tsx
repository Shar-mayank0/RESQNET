interface ResourceBarProps {
  name: string;
  percentage: number;
  color: string;
}

export default function ResourceBar({
  name,
  percentage,
  color,
}: ResourceBarProps) {
  return (
    <div className="mb-2">
      <div className="flex justify-between text-sm text-white">
        <span>{name}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
