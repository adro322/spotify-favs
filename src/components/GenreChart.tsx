import { useEffect, useState } from "react";
import axios from "axios";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip,} from 'recharts';

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
    "#FF0055", // Accent Red (contrast)
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

        // 1. Contar ocurrencias y calcular el TOTAL
        const counts: Record<string, number> = {};
        let totalCount = 0;
        allGenres.forEach((g) => {
          counts[g] = (counts[g] || 0) + 1;
          totalCount++;
        });

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
      cx, cy, midAngle,  outerRadius, percent, name
    }: any) => {
      const RADIAN = Math.PI / 180;
      const radius = outerRadius + 25; 
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      const textAnchor = x > cx ? 'start' : 'end';
      return (
        <text 
          x={x} 
          y={y} 
          fill="white" 
          textAnchor={textAnchor} 
          dominantBaseline="central" 
          className="text-sm font-medium"
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
                data={genres as any} // Aseguramos el tipo correcto
                cx="50%"
                cy="50%"
                labelLine={true} // Línea conectora
                label={renderCustomizedLabel} // Usamos nuestra función de etiqueta
                outerRadius={100} // Tamaño del círculo
                fill="#8884d8"
                dataKey="count"
                nameKey="name"
                paddingAngle={2} // Pequeño espacio entre rebanadas
              >
                {}
                {genres.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="rgba(0,0,0,0.2)" // Borde sutil para separar
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string, props: any) => [
                  `${value} artistas (${props.payload.percent}%)`, 
                  name
                ]}
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: 'white' }}
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
