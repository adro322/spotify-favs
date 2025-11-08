import { useEffect, useState } from "react";
import axios from "axios";

interface Track {
  id: string;
  name: string;
  album: { images: { url: string }[] };
  artists: { name: string }[];
}

export default function TopTracks({ accessToken }: { accessToken: string }) {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    if (!accessToken) return;

    axios.get("https://api.spotify.com/v1/me/top/tracks?limit=10", {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then(res => setTracks(res.data.items))
    .catch(err => console.error(err));
  }, [accessToken]);

  return (
    <div>
      <h2>Top Canciones</h2>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {tracks.map(track => (
          <div key={track.id} style={{ textAlign: "center" }}>
            <img src={track.album.images[0]?.url} alt={track.name} width={150} />
            <p>{track.name}</p>
            <p>{track.artists.map(a => a.name).join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
