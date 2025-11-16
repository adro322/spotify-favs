import { useEffect, useState } from "react";
import axios from "axios";

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  topTracksCount: number; // veces escuchadas aproximadas
}

export default function TopArtists({ accessToken, timeRange }: { accessToken: string; timeRange: string }) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    // Primero traemos tus top artists (hasta 50)
    axios
      .get(`https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${timeRange}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(async (res) => {
        const artistsData = res.data.items;

        // Para cada artista, traemos sus top tracks para contar aproximado de escuchas
        const artistsWithCounts: Artist[] = await Promise.all(
          artistsData.map(async (a: any) => {
            const topTracks = await axios.get(`https://api.spotify.com/v1/artists/${a.id}/top-tracks?market=from_token`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            return {
              id: a.id,
              name: a.name,
              images: a.images,
              topTracksCount: topTracks.data.tracks.length, // simple contador aproximado
            };
          })
        );

        setArtists(artistsWithCounts);
      })
      .catch((err) => console.error(err));
  }, [accessToken, timeRange]);

  const visibleArtists = showAll ? artists : artists.slice(0, 10);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">🌟 Top Artists</h2>

      <div className="flex flex-col gap-4">
        {visibleArtists.map((a, i) => (
          <div key={a.id} className="flex items-center gap-4 p-3 bg-gray-800/40 rounded-xl hover:bg-gray-800 transition">
            <span className="w-8 font-bold text-gray-300">{i + 1}</span>
            <img src={a.images[0]?.url} alt={a.name} className="w-16 h-16 rounded-full object-cover" />
            <div className="flex-1 flex flex-col">
              <span className="font-semibold">{a.name}</span>
              <span className="text-gray-400 text-sm">Escuchado aprox. {a.topTracksCount} veces</span>
            </div>
            <a
              href={`https://open.spotify.com/artist/${a.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-400 transition"
              title="Abrir en Spotify"
            >
              <i className="fa-brands fa-spotify text-lg"></i>
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
