import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface Track {
  id: string;
  name: string;
  preview_url: string | null;
  album: { images: { url: string }[] };
  artists: { name: string }[];
}

export default function TopTracks({ accessToken, timeRange }: { accessToken: string; timeRange: string }) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [showAll, setShowAll] = useState(false);
  const audioPlayer = useRef(new Audio());

  useEffect(() => {
    if (!accessToken) return;

    axios
      .get(`https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${timeRange}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setTracks(res.data.items))
      .catch((err) => console.error(err));
  }, [accessToken, timeRange]);

  const togglePlay = (url: string | null) => {
    if (!url) {
      alert("¡Esta canción no tiene preview disponible!");
      return;
    }

    if (audioPlayer.current.src !== url) {
      audioPlayer.current.src = url;
      audioPlayer.current.play();
    } else {
      audioPlayer.current.paused ? audioPlayer.current.play() : audioPlayer.current.pause();
    }
  };

  const visibleTracks = showAll ? tracks : tracks.slice(0, 10);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">🎵 Top Tracks</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <AnimatePresence>
          {visibleTracks.map((track) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative group p-2 rounded-xl bg-gray-800/40 shadow-md hover:bg-gray-800 transition"
            >
              {/* Imagen + Play */}
              <div className="relative">
                <img
                  src={track.album.images[0]?.url}
                  alt={track.name}
                  className="rounded-lg w-full"
                />

                {/* Hover Play Button */}
                <button
                  onClick={() => togglePlay(track.preview_url)}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/50 rounded-lg"
                >
                  ▶️
                </button>
              </div>

              <p className="mt-2 font-semibold truncate">{track.name}</p>
              <p className="text-sm text-gray-400 truncate">
                {track.artists.map(a => a.name).join(", ")}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Botón Mostrar más / menos */}
      <div className="text-center mt-6">
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-6 py-2 bg-green-600 rounded-xl hover:bg-green-700 transition"
        >
          {showAll ? "Mostrar menos" : "Mostrar más"}
        </button>
      </div>
    </div>
  );
}
