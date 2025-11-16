import { useEffect, useState, useRef } from "react";
import axios from "axios";

interface Track {
  id: string;
  name: string;
  preview_url: string | null;
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
  const [limit, setLimit] = useState(10);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    axios
      .get(
        `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${timeRange}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then((res) => setTracks(res.data.items))
      .catch((err) => console.error("Error top tracks:", err));
  }, [accessToken, timeRange]);

  const playPreview = (url: string | null) => {
    if (!url) return;

    if (audioRef.current) audioRef.current.pause();

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play();
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">Top Canciones</h2>

      <div className="flex flex-col gap-4">
        {tracks.slice(0, limit).map((track) => (
          <div
            key={track.id}
            className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition relative group"
          >
            {/* Imagen álbum */}
            <img
              src={track.album.images[2]?.url || track.album.images[0]?.url}
              alt={track.name}
              className="w-14 h-14 rounded shadow-md"
            />

            {/* Info */}
            <div>
              <p className="font-medium">{track.name}</p>
              <p className="text-gray-400 text-sm">
                {track.artists.map((a) => a.name).join(", ")}
              </p>
            </div>

            {/* BOTÓN PLAY SOLO SI TIENE PREVIEW */}
            {track.preview_url && (
              <button
                onClick={() => playPreview(track.preview_url)}
                className="absolute right-4 opacity-0 group-hover:opacity-100 transition bg-green-500 px-3 py-1 rounded-md text-sm hover:bg-green-600"
              >
                ▶ Play
              </button>
            )}
          </div>
        ))}
      </div>

      {/* BOTÓN MOSTRAR MÁS */}
      {limit < tracks.length && (
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
