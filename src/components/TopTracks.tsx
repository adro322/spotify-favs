import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";


interface Track {
  id: string;
  name: string;
  album: { images: { url: string }[] };
  artists: { name: string }[];
}

export default function TopTracks({ accessToken, timeRange }: { accessToken: string; timeRange: string }) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    axios
      .get(`https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${timeRange}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setTracks(res.data.items))
      .catch((err) => console.error(err));
  }, [accessToken, timeRange]);

  const visibleTracks = showAll ? tracks : tracks.slice(0, 10);

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">🎵 Top Tracks</h2>
      <div className="flex flex-col gap-4">
        {visibleTracks.map((t, i) => (
          <div key={t.id} className="flex items-center gap-4 p-3 bg-gray-800/40 rounded-xl hover:bg-gray-800 transition">
            {/* ranking */}
            <span className="w-8 font-bold text-gray-300">{i + 1}.</span>

            {/* imagen */}
            <img src={t.album.images[0]?.url} alt={t.name} className="w-16 h-16 rounded-lg object-cover" />

            {/* info */}
            <div className="flex-1 flex flex-col">
              <span className="font-semibold">{t.name}</span>
              <span className="text-gray-400 text-sm">{t.artists.map(a => a.name).join(", ")}</span>
            </div>

            {/* abrir en Spotify */}
            <a
              href={`https://open.spotify.com/track/${t.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-400 transition"
              title="Abrir en Spotify"
            >         
              <FontAwesomeIcon icon={faSpotify} size="lg" />
            </a>
          </div>
        ))}
      </div>

      {tracks.length > 10 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 bg-green-600 rounded-xl hover:bg-green-700 transition"
          >
            {showAll ? "Mostrar menos" : "Mostrar más"}
          </button>
        </div>
      )}
    </div>
  );
}
