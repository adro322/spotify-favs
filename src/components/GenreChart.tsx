import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function GenreChart({
  accessToken,
  timeRange,
}: {
  accessToken: string;
  timeRange: "short_term" | "medium_term" | "long_term";
}) {
  const [genres, setGenres] = useState<{ name: string; count: number }[]>([]);

  
  // Paleta de colores para el gráfico (puedes cambiarlos a tu gusto)
  const COLORS = [
    "#1DB954", // Spotify Green
    "#191414", // Black
    "#535353", // Grey
    "#B3B3B3", // Light Grey
    "#FF0055", // Accent Red (contrast)
    "#0077FF", // Accent Blue
    "#FFAA00", // Accent Orange
    "#8800CC", // Accent Purple
    "#00CCCC", // Cyan
    "#FF5500", // Dark Orange
  ];

  useEffect(() => {
    if (!accessToken) return;

    axios
      .get(
        `https://api.spotify.com/v1/me/top/artists?limit=20&time_range=${timeRange}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((res) => {
        const allGenres: string[] = [];

        res.data.items.forEach((artist: any) => {
          allGenres.push(...artist.genres);
        });

        const counts: Record<string, number> = {};
        allGenres.forEach((g) => {
          counts[g] = (counts[g] || 0) + 1;
        });
        const entries = Object.entries(counts).map(([name, count]) => ({ name, count }));
        const total = entries.reduce((sum, item) => sum + item.count, 0);

        const sorted = entries
          .map((item) => ({
            ...item,
            percentage: ((item.count / total) * 100).toFixed(1),
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setGenres(sorted);


      })
      .catch((err) => console.error("Error genres:", err));
  }, [accessToken, timeRange]);

  return (
    <div className="bg-white/5 p-6 rounded-xl shadow-lg w-full max-w-[1200px] mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">
        Géneros Favoritos
      </h2>

      {genres.length > 0 ? (
        <div className="h-[400px] w-full flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genres}
                cx="50%"
                cy="50%"
                label={(props) => `${props.name}: ${props.payload.percentage}%`}
                labelLine={false}
                outerRadius={100}
                innerRadius={0}
                dataKey="count"
                nameKey="name"
              >
                {genres.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="none" 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "#333", border: "none", borderRadius: "8px", color: "#fff" }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-center text-gray-400">Cargando datos...</p>
      )}
    </div>
  );
}