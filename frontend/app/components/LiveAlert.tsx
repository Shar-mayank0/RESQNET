interface LiveAlertProps {
  title: string;
  description: string;
  time: string;
  type: "Critical" | "Warning" | "Information";
}

export default function LiveAlert({
  title,
  description,
  time,
  type,
}: LiveAlertProps) {
  return (
    <div
      className={`p-4 rounded-lg mb-2 ${
        type === "Critical" ? "bg-red-900" : "bg-[#3A4A4B]"
      }`}
    >
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="text-xs text-gray-300">{description}</p>
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-400">{time}</p>
        <button className="text-xs text-gray-300 border border-gray-300 px-2 py-1 rounded">
          View Details
        </button>
      </div>
    </div>
  );
}
