import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface GenreData {
  name: string;
  count: number;
}

// Colores fijos para tus categorías grandes
const COLORS_MAP: Record<string, string> = {
  "Pop": "#FF0055",      // Rosa
  "Rock & Metal": "#e11d48", // Rojo oscuro
  "Latino / Urbano": "#FFAA00", // Naranja/Amarillo
  "Hip Hop / Rap": "#0077FF", // Azul
  "Electrónica": "#8800CC",   // Morado
  "Indie / Alt": "#1DB954",   // Verde Spotify
  "R&B / Soul": "#00CCCC",    // Cyan
  "Otros": "#535353"          // Gris
};

const DEFAULT_COLORS = ["#1DB954", "#191414", "#535353", "#B3B3B3"];

export default function GenreChart({
  accessToken,
  timeRange,
}: {
  accessToken: string;
  timeRange: "short_term" | "medium_term" | "long_term";
}) {
  const [genres, setGenres] = useState<GenreData[]>([]);

  // --- FUNCIÓN MÁGICA DE AGRUPACIÓN ---
  const normalizeGenre = (genre: string): string => {
    const g = genre.toLowerCase();

    // Reglas de agrupación (puedes agregar más aquí)
    if (g.includes("pop") || g.includes("boy group")) return "Pop";
    if (g.includes("rock") || g.includes("metal") || g.includes("punk")) return "Rock & Metal";
    if (g.includes("hip hop") || g.includes("rap") || g.includes("trap")) return "Hip Hop / Rap";
    if (g.includes("latino") || g.includes("urbano") || g.includes("reggaeton") || g.includes("argentino")) return "Latino / Urbano";
    if (g.includes("house") || g.includes("techno") || g.includes("edm") || g.includes("dance")) return "Electrónica";
    if (g.includes("indie") || g.includes("alternative")) return "Indie / Alt";
    if (g.includes("r&b") || g.includes("soul")) return "R&B / Soul";
    
    return "Otros"; // Si no encaja en nada, va a Otros
  };

  useEffect(() => {
    if (!accessToken) return;

    const ENDPOINT = "https://api.spotify.com/v1/me/top/artists"; // Endpoint de Artistas

    axios
      .get(`${ENDPOINT}?time_range=${timeRange}&limit=50`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        const counts: Record<string, number> = {};
        
        // Recorremos cada artista
        res.data.items.forEach((artist: any) => {
          // Tomamos SOLO el género principal del artista (el primero suele ser el más importante)
          // O podemos iterar todos, pero agruparlos puede duplicar cuentas.
          // Para simplificar, tomemos todos los géneros del artista y agrupémoslos.
          const uniqueCategoriesForArtist = new Set<string>();

          artist.genres.forEach((g: string) => {
            const broadGenre = normalizeGenre(g);
            uniqueCategoriesForArtist.add(broadGenre);
          });

          // Sumamos 1 a la categoría grande (ej: Si Bad Bunny es Trap y Reggaeton, cuenta 1 vez como Latino)
          uniqueCategoriesForArtist.forEach((category) => {
             counts[category] = (counts[category] || 0) + 1;
          });
        });

        const sorted = Object.entries(counts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          // Filtramos "Otros" si quieres que no salga, o lo dejas
          .filter(g => g.name !== "Otros" || g.count > 1);

        setGenres(sorted);
      })
      .catch((err) => console.error("Error genres:", err));
  }, [accessToken, timeRange]);

  return (
    <div className="bg-white/5 p-6 rounded-2xl shadow-lg w-full h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-white text-center">
        Tus Géneros Principales
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
                dataKey="count"
                // Etiqueta simple con porcentaje
                label={({ name, percent }: any) => 
                   `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {genres.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    // Usamos el mapa de colores fijo para que Pop siempre sea rosa, etc.
                    fill={COLORS_MAP[entry.name] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                    stroke="rgba(0,0,0,0.2)"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                // AQUÍ CAMBIAMOS EL TEXTO PARA QUE SE ENTIENDA EL NÚMERO
                formatter={(value: number, name: string) => [
                  `${value} artistas`, // Ahora dirá: "10 artistas"
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