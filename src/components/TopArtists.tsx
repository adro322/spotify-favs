import { useEffect, useState } from "react";
import axios from "axios";

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  genres?: string[];
  followers?: { total: number };
}

export default function TopArtists({
  accessToken,
  timeRange,
}: {
  accessToken: string;
  timeRange: "short_term" | "medium_term" | "long_term";
}) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [showAll, setShowAll] = useState(false);

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

  const visible = showAll ? artists : artists.slice(0, 10);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">Top Artistas</h2>

      <div className="flex flex-col gap-3">
        {visible.map((artist) => (
          <div
            key={artist.id}
            className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
          >
            <img
              src={artist.images[2]?.url || artist.images[0]?.url}
              alt={artist.name}
              className="w-12 h-12 rounded-full shadow-md object-cover"
            />

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{artist.name}</p>
              <p className="text-gray-400 text-sm truncate">
                {artist.genres?.slice(0, 2).join(", ")}
              </p>
            </div>

            <div className="text-right text-sm text-gray-400">
              {artist.followers ? (
                <div>{artist.followers.total.toLocaleString()} followers</div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        {showAll ? (
          <button
            onClick={() => setShowAll(false)}
            className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            Mostrar menos
          </button>
        ) : (
          artists.length > 10 && (
            <button
              onClick={() => setShowAll(true)}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
            >
              Mostrar más
            </button>
          )
        )}
      </div>
    </div>
  );
}
