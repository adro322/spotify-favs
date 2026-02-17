export default function TimeRangeSelector({
  timeRange,
  setTimeRange,
}: {
  timeRange: "short_term" | "medium_term" | "long_term";
  setTimeRange: (t: "short_term" | "medium_term" | "long_term") => void;
}) {
  return (
    <div className="flex gap-4 mb-8">
      <button
        onClick={() => setTimeRange("short_term")}
        className={`px-4 py-2 rounded-lg ${
          timeRange === "short_term" ? "bg-green-500" : "bg-gray-700"
        }`}
      >
        Últimas 4 semanas
      </button>

      <button
        onClick={() => setTimeRange("medium_term")}
        className={`px-4 py-2 rounded-lg ${
          timeRange === "medium_term" ? "bg-green-500" : "bg-gray-700"
        }`}
      >
        Últimos 6 meses
      </button>

      <button
        onClick={() => setTimeRange("long_term")}
        className={`px-4 py-2 rounded-lg  ${
          timeRange === "long_term" ? "bg-green-500" : "bg-gray-700"
        }`}
      >
        Último año
      </button>
    </div>
  );
}
