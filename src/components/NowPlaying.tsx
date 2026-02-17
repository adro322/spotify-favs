import { useEffect, useState } from 'react';
import { Music2, Pause } from 'lucide-react';
import axios from 'axios';

interface CurrentTrack {
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  progress: number;
  duration: number;
  isPlaying: boolean;
}

export default function NowPlaying({ accessToken }: { accessToken: string }) {
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);

  // EFECTO 1: Consultar a Spotify
  useEffect(() => {
    if (!accessToken) return;

    const fetchNowPlaying = async () => {
      try {
        // AQUÍ ESTÁ LA URL OFICIAL Y CORRECTA DE SPOTIFY
        const res = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        // Si Spotify devuelve 200 y hay una canción
        if (res.status === 200 && res.data?.item) {
          setCurrentTrack({
            name: res.data.item.name,
            artist: res.data.item.artists.map((a: any) => a.name).join(', '),
            album: res.data.item.album.name,
            albumArt: res.data.item.album.images[0]?.url || '',
            progress: res.data.progress_ms || 0,
            duration: res.data.item.duration_ms,
            isPlaying: res.data.is_playing,
          });
        } else {
          setCurrentTrack(null);
        }
      } catch (error) {
        console.error('Error fetching currently playing:', error);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 10000); // Consulta real cada 10s
    return () => clearInterval(interval);
  }, [accessToken]);

  // EFECTO 2: La "Magia" local -> Sumar 1 segundo a la barra fluidamente
  useEffect(() => {
    // CORRECCIÓN PARA TYPESCRIPT AQUÍ:
    let localTimer: ReturnType<typeof setInterval>;

    if (currentTrack?.isPlaying) {
      localTimer = setInterval(() => {
        setCurrentTrack((prev) => {
          if (!prev) return prev;
          const newProgress = Math.min(prev.progress + 1000, prev.duration);
          return { ...prev, progress: newProgress };
        });
      }, 1000);
    }

    return () => clearInterval(localTimer);
  }, [currentTrack?.isPlaying]);

  if (!currentTrack) {
    return null;
  }

  const progressPercent = (currentTrack.progress / currentTrack.duration) * 100;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          {currentTrack.isPlaying ? (
            <div className="flex items-center gap-1">
              <Music2 className="w-5 h-5 text-green-500" />
              <div className="flex gap-[2px] items-end h-4">
                <div className="w-[3px] bg-green-500 rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" style={{ height: '40%' }} />
                <div className="w-[3px] bg-green-500 rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.1s]" style={{ height: '80%' }} />
                <div className="w-[3px] bg-green-500 rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.2s]" style={{ height: '60%' }} />
              </div>
            </div>
          ) : (
            <Pause className="w-5 h-5 text-zinc-400" />
          )}
        </div>
        <h2 className="text-xl font-semibold text-white">
          {currentTrack.isPlaying ? 'Now Playing' : 'Paused'}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 flex-shrink-0">
          <img
            src={currentTrack.albumArt}
            alt={currentTrack.album}
            className="w-full h-full object-cover rounded-md shadow-lg"
          />
          {currentTrack.isPlaying && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-md" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate mb-1">
            {currentTrack.name}
          </h3>
          <p className="text-sm text-zinc-400 truncate mb-3">
            {currentTrack.artist}
          </p>

          <div className="space-y-1">
            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-green-500 h-full rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-500 font-medium tracking-wide">
              <span>{formatTime(currentTrack.progress)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}