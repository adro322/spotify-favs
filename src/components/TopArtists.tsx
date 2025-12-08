import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

interface Artist {
  id: string;
  name: string;
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

  const visibleArtists = showAll ? artists : artists.slice(0, 10);

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">🌟 Top Artists</h2>

      <div className="flex flex-col gap-4">
        {visibleArtists.map((a, i) => (
          <div
            key={a.id}
            className="flex items-center gap-4 p-3 bg-gray-800/40 rounded-xl hover:bg-gray-800 transition"
          >
            {/* ranking */}
            <span className="w-8 font-bold text-gray-300">{i + 1}.</span>

            {/* imagen */}
            <img
              src={a.images[0]?.url}
              alt={a.name}
              className="w-16 h-16 rounded-full object-cover"
            />

            {/* nombre del artista */}
            <span className="flex-1 font-semibold text-white">{a.name}</span>

            {/* icono Spotify */}
            <a
              href={`https://open.spotify.com/artist/${a.id}`}
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

      {artists.length > 10 && (
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
