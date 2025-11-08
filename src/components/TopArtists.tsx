import  { useEffect, useState } from "react";
import axios from "axios";

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
}

export default function TopArtists({ accessToken }: { accessToken: string }) {
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    if (!accessToken) return;

    axios.get("https://api.spotify.com/v1/me/top/artists?limit=10", {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then(res => setArtists(res.data.items))
    .catch(err => console.error(err));
  }, [accessToken]);

  return (
    <div>
      <h2>Top Artistas</h2>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {artists.map(artist => (
          <div key={artist.id} style={{ textAlign: "center" }}>
            <img src={artist.images[0]?.url} alt={artist.name} width={150} />
            <p>{artist.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
