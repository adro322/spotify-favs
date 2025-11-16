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

  useEffect(() => {
    if (!accessToken) return;

    axios
      .get(
        `https://api.spotify.com/v1/me/top/artists?limit=10&time_range=${timeRange}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((res) => setArtists(res.data.items))
      .catch((err) => console.error("Error top artists:", err));
  }, [accessToken, timeRange]);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">Top Artistas</h2>

      <div className="flex flex-wrap gap-6">
        {artists.map((artist) => (
          <div key={artist.id} className="text-center w-40">
            <img
              src={artist.images[0]?.url}
              alt={artist.name}
              className="rounded-lg shadow-lg"
            />
            <p className="mt-2 font-medium">{artist.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
