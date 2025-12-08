import { useEffect, useState } from "react";
import axios from "axios";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend} from 'recharts';

export default function GenreChart({
  accessToken,
  timeRange,
}: {
  accessToken: string;
  timeRange: "short_term" | "medium_term" | "long_term";
}) {
  const [genres, setGenres] = useState<{ name: string; count: number }[]>([]);
  
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

        // Contar
        const counts: Record<string, number> = {};
        allGenres.forEach((g) => {
          counts[g] = (counts[g] || 0) + 1;
        });

        const sorted = Object.entries(counts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6); // Top 10

        setGenres(sorted);
      })
      .catch((err) => console.error("Error genres:", err));
  }, [accessToken, timeRange]);

  return (
    <div className="bg-white/5 p-6 rounded-xl shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">
        Generos mas escuchados
      </h2>

      {genres.length > 0 ? (
        <div className="h-[300px] w-full flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genres}
                cx="50%" // Centro X
                cy="50%" // Centro Y
                labelLine={false} // Quitamos las líneas para que sea más limpio
                outerRadius={100} // Tamaño del círculo
                innerRadius={40} // Si pones esto > 0 se vuelve una "Dona" (Donut Chart)
                fill="#8884d8"
                dataKey="count"
                nameKey="name"
                paddingAngle={5} // Espacio entre rebanadas
              >
                {genres.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="none" // Quita el borde blanco feo
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
