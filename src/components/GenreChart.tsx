import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface GenreData {
  name: string;
  count: number;
}

const COLORS = [
  "#1DB954", "#191414", "#535353", "#B3B3B3", "#FF0055",
  "#0077FF", "#FFAA00", "#8800CC", "#00CCCC", "#FF5500",
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

    // URL oficial correcta para obtener tus artistas top
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
        allGenres.forEach((g) => {
          counts[g] = (counts[g] || 0) + 1;
        });

        // Convertimos y ordenamos (ya no necesitamos calcular el porcentaje manual aquí)
        const sorted = Object.entries(counts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8); // Top 8

        setGenres(sorted);
      })
      .catch((err) => console.error("Error genres:", err));
  }, [accessToken, timeRange]);

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
                data={genres as any}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                // AQUÍ ESTÁ LA CORRECCIÓN CLAVE (: any)
                label={({ name, percent }: any) => 
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
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
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value: number, name: string) => [
                  `${value} artistas`, 
                  name
                ]}
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