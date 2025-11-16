import { useEffect, useState } from "react";
import axios from "axios";

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
}

export default function TopArtists({
  accessToken,
  timeRange,
}: {
  accessToken: string;
  timeRange: "short_term" | "medium_term" | "long_term";
}) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    if (!accessToken) return;

    axios
      .get(
        `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${timeRange}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then((res) => setArtists(res.data.items))
      .catch((err) => console.error("Error top artists:", err));
  }, [accessToken, timeRange]);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">Top Artistas</h2>

      <div className="flex flex-col gap-4">
        {artists.slice(0, limit).map((artist) => (
          <div
            key={artist.id}
            className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
          >
            <img
              src={artist.images[2]?.url || artist.images[0]?.url}
              alt={artist.name}
              className="w-14 h-14 rounded-full shadow-md"
            />

            <p className="font-medium">{artist.name}</p>
          </div>
        ))}
      </div>

      {limit < artists.length && (
        <button
          onClick={() => setLimit(limit + 10)}
          className="mt-4 px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
        >
          Mostrar más
        </button>
      )}
    </div>
  );
}
