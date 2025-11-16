import { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="mt-10">
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
              <svg width="24" height="24" viewBox="0 0 168 168" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M84 0C37.58 0 0 37.58 0 84C0 130.42 37.58 168 84 168C130.42 168 168 130.42 168 84C168 37.58 130.42 0 84 0ZM121.6 121.14C119.66 123.06 116.9 123.66 114.97 121.72C98.35 106.32 69.76 102.4 46.76 110.38C44.17 111.13 41.53 109.54 40.78 106.95C40.03 104.37 41.62 101.73 44.21 100.98C70.95 92.21 102.88 96.41 123.1 113.42C125.03 115.36 125.63 118.12 123.6 120.05V120.05ZM130.56 98.83C128.44 100.78 125.58 101.16 123.63 99.05C104.35 82.58 70.67 78.88 46.9 88.33C44.08 89.23 41.01 87.71 40.1 84.89C39.19 82.08 40.71 79.01 43.53 78.1C70.89 68.07 108.1 71.06 130.78 90.38C132.73 92.29 133.12 95.14 131.21 97.09V97.09ZM132.3 75.18C128.85 77.13 124.7 76.52 122.76 73.05C98.25 42.87 50.18 39.28 25.86 51.5C22.6 52.9 19.11 51.48 17.71 48.22C16.31 44.97 17.73 41.48 20.99 40.08C47.82 27.91 99.36 31.78 126.33 65.68C128.27 68.11 128.01 72.22 125.58 74.16V74.16Z"/>
              </svg>
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
