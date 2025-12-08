import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// 1. Interfaz definida afuera
interface GenreData {
  name: string;
  count: number;
  percent: number;
}

const COLORS = [
  "#1DB954", // Spotify Green
  "#191414", // Black
  "#535353", // Grey
  "#B3B3B3", // Light Grey
  "#FF0055", // Accent Red
  "#0077FF", // Accent Blue
  "#FFAA00", // Accent Orange
  "#8800CC", // Accent Purple
  "#00CCCC", // Cyan
  "#FF5500", // Dark Orange
];

export default function GenreChart({
  accessToken,
  timeRange,
}: {
  accessToken: string;
  timeRange: "short_term" | "medium_term" | "long_term";
}) {
  const [genres, setGenres] = useState<GenreData[]>([]);

  useEffect(() => {
    if (!accessToken) return;

    // 2. URL CORREGIDA (Esta es la real de Spotify)
    const ENDPOINT = "https://api.spotify.com/v1/me/top/artists";

    axios
      .get(`${ENDPOINT}?time_range=${timeRange}&limit=50`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        const allGenres: string[] = [];
        res.data.items.forEach((artist: any) => {
          allGenres.push(...artist.genres);
        });

        const counts: Record<string, number> = {};
        let totalCount = 0;
        allGenres.forEach((g) => {
          counts[g] = (counts[g] || 0) + 1;
          totalCount++;
        });

        if (totalCount === 0) return;

        const sorted = Object.entries(counts)
          .map(([name, count]) => ({
            name,
            count,
            percent: parseFloat(((count / totalCount) * 100).toFixed(1)),
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8);

        setGenres(sorted);
      })
      .catch((err) => console.error("Error genres:", err));
  }, [accessToken, timeRange]);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    name,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const textAnchor = x > cx ? "start" : "end";

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={textAnchor}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white/5 p-6 rounded-2xl shadow-lg w-full h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-white text-center">
        Distribución de Géneros
      </h2>

      {genres.length > 0 ? (
        <div className="flex-grow min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                // 3. AQUÍ ESTÁ EL TRUCO PARA QUITAR EL ERROR ROJO
                data={genres as any} 
                cx="50%"
                cy="50%"
                labelLine={true}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="name"
                paddingAngle={2}
              >
                {genres.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="rgba(0,0,0,0.2)"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string, props: any) => [
                  `${value} artistas (${props.payload.percent}%)`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center text-gray-400">
          Cargando datos...
        </div>
      )}
    </div>
  );
}