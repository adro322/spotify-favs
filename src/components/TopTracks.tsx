import { useEffect, useState } from "react";
import axios from "axios";

interface Track {
  id: string;
  name: string;
  album: { images: { url: string }[] };
  artists: { name: string }[];
}

export default function TopTracks({ accessToken }: { accessToken: string }) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [range, setRange] = useState<"short_term" | "medium_term" | "long_term">(
    "short_term"
  );

  useEffect(() => {
    if (!accessToken) return;

    axios
      .get(
        `https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${range}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((res) => setTracks(res.data.items))
      .catch((err) => console.error(err));
  }, [accessToken, range]);

return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Top Canciones</h2>

      {/* BOTONES DE TIEMPO */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setRange("short_term")}
          className={`px-4 py-2 rounded ${
            range === "short_term" ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          Últimas 4 semanas
        </button>

        <button
          onClick={() => setRange("medium_term")}
          className={`px-4 py-2 rounded ${
            range === "medium_term" ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          Últimos 6 meses
        </button>

        <button
          onClick={() => setRange("long_term")}
          className={`px-4 py-2 rounded ${
            range === "long_term" ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          Último año
        </button>
      </div>

      {/* GRID DE TRACKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="bg-gray-800 p-4 rounded-lg flex items-center gap-4"
          >
            <img
              src={track.album.images[0]?.url}
              alt={track.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <p className="font-semibold">{track.name}</p>
              <p className="text-gray-400">
                {track.artists.map((a) => a.name).join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}