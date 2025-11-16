import { useEffect, useState } from "react";
import axios from "axios";

export default function GenreChart({
  accessToken,
  timeRange,
}: {
  accessToken: string;
  timeRange: "short_term" | "medium_term" | "long_term";
}) {
  const [genres, setGenres] = useState<{ name: string; count: number }[]>([]);

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
          .slice(0, 10);

        setGenres(sorted);
      })
      .catch((err) => console.error("Error genres:", err));
  }, [accessToken, timeRange]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Tus Géneros Más Escuchados</h2>

      <div className="flex flex-col gap-3">
        {genres.map((g) => (
          <div key={g.name} className="flex items-center gap-4">
            <p className="w-40">{g.name}</p>
            <div
              className="h-4 bg-green-500 rounded"
              style={{ width: `${g.count * 40}px` }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
