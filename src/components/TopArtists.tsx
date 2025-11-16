import  { useEffect, useState } from "react";
import axios from "axios";

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
}

export default function TopArtists({ accessToken }: { accessToken: string }) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [range, setRange] = useState<"short_term" | "medium_term" | "long_term">(
    "short_term"
  );
useEffect(() => {
    if (!accessToken) return;

    axios
      .get(
        `https://api.spotify.com/v1/me/top/artists?limit=10&time_range=${range}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((res) => setArtists(res.data.items))
      .catch((err) => console.error(err));
  }, [accessToken, range]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Top Artistas</h2>

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

      {/* GRID DE ARTISTAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {artists.map((artist) => (
          <div key={artist.id} className="bg-gray-800 p-4 rounded-lg text-center">
            <img
              src={artist.images[0]?.url}
              alt={artist.name}
              className="w-full h-40 object-cover rounded-lg"
            />
            <p className="mt-3 font-medium">{artist.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}