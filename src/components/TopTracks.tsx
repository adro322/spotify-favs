import { useEffect, useState } from "react";
import axios from "axios";

interface Track {
  id: string;
  name: string;
  album: { images: { url: string }[] };
  artists: { name: string }[];
}

export default function TopTracks({
  accessToken,
  timeRange,
}: {
  accessToken: string;
  timeRange: "short_term" | "medium_term" | "long_term";
}) {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    if (!accessToken) return;

    axios
      .get(
        `https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${timeRange}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((res) => setTracks(res.data.items))
      .catch((err) => console.error("Error top tracks:", err));
  }, [accessToken, timeRange]);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">Top Canciones</h2>

      <div className="flex flex-wrap gap-6">
        {tracks.map((track) => (
          <div key={track.id} className="text-center w-40">
            <img
              src={track.album.images[0]?.url}
              alt={track.name}
              className="rounded-lg shadow-lg"
            />
            <p className="mt-2 font-medium">{track.name}</p>
            <p className="text-gray-400 text-sm">
              {track.artists.map((a) => a.name).join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
