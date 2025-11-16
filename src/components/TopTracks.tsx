import { useEffect, useRef, useState } from "react";
import axios from "axios";

interface Track {
  id: string;
  name: string;
  preview_url: string | null;
  album: { images: { url: string }[] };
  artists: { name: string }[];
  duration_ms: number;
}

export default function TopTracks({
  accessToken,
  timeRange,
}: {
  accessToken: string;
  timeRange: "short_term" | "medium_term" | "long_term";
}) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [showAll, setShowAll] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // segundos

  useEffect(() => {
    if (!accessToken) return;

    axios
      .get(
        `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${timeRange}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then((res) => setTracks(res.data.items))
      .catch((err) => console.error("Error top tracks:", err));
  }, [accessToken, timeRange]);

  // Crear elemento audio una sola vez
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (!audioRef.current) return;
      setProgress(Math.floor(audioRef.current.currentTime));
    };

    const onEnded = () => {
      setIsPlaying(false);
      setPlayingId(null);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const togglePlay = (track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;

    // Si click en la misma pista
    if (playingId === track.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch((e) => console.error("play error", e));
        setIsPlaying(true);
      }
      return;
    }

    // Si venía otra pista sonando, parar
    if (playingId && audio) {
      audio.pause();
    }

    // Si la pista no tiene preview, no hacer nada (o podrías abrir Spotify)
    if (!track.preview_url) {
      // Puedes abrir en spotify si quieres: window.open(`https://open.spotify.com/track/${track.id}`, "_blank");
      console.warn("No preview available for this track:", track.name);
      return;
    }

    // Cargar nueva pista y reproducir
    audio.src = track.preview_url;
    audio.currentTime = 0;
    audio.play().catch((e) => console.error("play error", e));
    setPlayingId(track.id);
    setIsPlaying(true);
    setProgress(0);
  };

  const stopPlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
    setPlayingId(null);
    setProgress(0);
  };

  const visibleTracks = showAll ? tracks : tracks.slice(0, 10);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">Top Canciones</h2>

      <div className="flex flex-col gap-3">
        {visibleTracks.map((track) => {
          const isThisPlaying = playingId === track.id && isPlaying;
          const previewExists = !!track.preview_url;
          const durationSec = Math.floor((track.duration_ms ?? 30000) / 1000);

          return (
            <div
              key={track.id}
              className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition relative"
            >
              <img
                src={track.album.images[2]?.url || track.album.images[0]?.url}
                alt={track.name}
                className="w-12 h-12 rounded shadow-md object-cover"
              />

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{track.name}</p>
                <p className="text-gray-400 text-sm truncate">
                  {track.artists.map((a) => a.name).join(", ")}
                </p>

                {/* Barra de progreso solo si es la pista actual */}
                {playingId === track.id && (
                  <div className="mt-2">
                    <div className="w-full h-2 bg-gray-700 rounded overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${Math.min((progress / durationSec) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {progress}s / {durationSec}s
                    </div>
                  </div>
                )}
              </div>

              {/* Play / Pause */}
              <div className="flex items-center gap-2">
                {previewExists ? (
                  <button
                    onClick={() => togglePlay(track)}
                    className="px-3 py-1 bg-green-500 rounded-md hover:bg-green-600 transition text-sm"
                  >
                    {isThisPlaying ? "⏸" : "▶"}
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      window.open(`https://open.spotify.com/track/${track.id}`, "_blank")
                    }
                    className="px-3 py-1 bg-gray-600 rounded-md text-sm"
                    title="Abrir en Spotify (sin preview)"
                  >
                    Abrir
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-3">
        {showAll ? (
          <button
            onClick={() => {
              setShowAll(false);
              stopPlayback();
            }}
            className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            Mostrar menos
          </button>
        ) : (
          tracks.length > 10 && (
            <button
              onClick={() => setShowAll(true)}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
            >
              Mostrar más
            </button>
          )
        )}

        {/* Un botón para parar reproducción rápida */}
        {playingId && (
          <button
            onClick={() => stopPlayback()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
          >
            Parar
          </button>
        )}
      </div>
    </div>
  );
}
