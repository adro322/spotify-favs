import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface Artist {
  id: string;
  name: string;
  popularity: number;
  images: { url: string }[];
}

export default function TopArtists({ accessToken, timeRange }: { accessToken: string; timeRange: string }) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    axios
      .get(`https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${timeRange}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setArtists(res.data.items))
      .catch((err) => console.error(err));
  }, [accessToken, timeRange]);

  // Ranking global estimado basado en "popularity"
  const popularityToRank = (popularity: number) => {
    return Math.round((100 - popularity) * 10) + 1;
  };

  const visibleArtists = showAll ? artists : artists.slice(0, 10);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">🌟 Top Artists</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <AnimatePresence>
          {visibleArtists.map((artist) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center p-2 bg-gray-800/40 rounded-xl hover:bg-gray-800 shadow-md"
            >
              <div className="relative group">
                <img
                  src={artist.images[0]?.url}
                  className="rounded-full w-32 h-32 mx-auto object-cover"
                />

                {/* Ranking */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-600 px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                  #{popularityToRank(artist.popularity)}
                </div>
              </div>

              <p className="mt-4 font-semibold">{artist.name}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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
