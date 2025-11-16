import { useEffect, useState, useRef } from "react";
import axios from "axios";

interface Track {
  id: string;
  name: string;
  preview_url: string | null;
  album: { images: { url: string }[] };
  artists: { name: string }[];
}

export default function TopTracks({ accessToken, timeRange }: { accessToken: string; timeRange: string }) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [expanded, setExpanded] = useState(false);
  const audio = useRef(new Audio());

  useEffect(() => {
    if (!accessToken) return;

    axios
      .get(`https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${timeRange}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setTracks(res.data.items))
      .catch((err) => console.error(err));
  }, [accessToken, timeRange]);

  const togglePlay = (preview: string | null) => {
    if (!preview) {
      alert("Esta canción no tiene preview 😢");
      return;
    }

    if (audio.current.src !== preview) {
      audio.current.src = preview;
      audio.current.play();
    } else {
      audio.current.paused ? audio.current.play() : audio.current.pause();
    }
  };

  const visible = expanded ? tracks : tracks.slice(0, 10);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">🎧 Tus Top Tracks</h2>

      <div className="flex flex-col gap-4">
        {visible.map((t, i) => (
          <div
            key={t.id}
            className="flex items-center gap-4 p-3 bg-gray-800/40 rounded-xl hover:bg-gray-800 transition relative"
          >
            {/* número */}
            <p className="w-8 text-xl font-bold text-gray-300">{i + 1}.</p>

            {/* imagen */}
            <div className="relative group">
              <img
                src={t.album.images[0]?.url}
                className="w-16 h-16 rounded-lg object-cover"
              />

              {/* PLAY ON HOVER */}
              <button
                onClick={() => togglePlay(t.preview_url)}
                className="absolute inset-0 flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition bg-black/50 rounded-lg"
              >
                ▶️
              </button>
            </div>

            {/* info */}
            <div className="flex flex-col">
              <p className="font-bold text-lg">{t.name}</p>
              <p className="text-gray-400 text-sm">
                {t.artists.map((a) => a.name).join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* BOTÓN */}
      <div className="text-center mt-6">
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-6 py-2 bg-green-600 rounded-xl hover:bg-green-700 transition"
        >
          {expanded ? "Mostrar menos" : "Mostrar más"}
        </button>
      </div>
    </div>
  );
}
