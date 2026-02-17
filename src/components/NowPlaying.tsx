import { useEffect, useState } from "react";
import axios from "axios";

export default function NowPlaying({ accessToken }: { accessToken: string }) {
  const [nowPlaying, setNowPlaying] = useState<any>(null);

  useEffect(() => {
    if (!accessToken) return;

    const fetchNowPlaying = () => {
      // Endpoint oficial para lo que estás escuchando
      axios
        .get("https://api.spotify.com/v1/me/player/currently-playing", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => {
          // Spotify devuelve 200 si hay música, 204 si no hay nada sonando
          if (res.status === 200 && res.data && res.data.item) {
            setNowPlaying(res.data);
          } else {
            setNowPlaying(null);
          }
        })
        .catch((err) => console.error("Error Now Playing:", err));
    };

    // Buscamos inmediatamente al cargar
    fetchNowPlaying();
    
    // Y luego buscamos cada 10 segundos para actualizar la barra de progreso
    const interval = setInterval(fetchNowPlaying, 10000);
    return () => clearInterval(interval);
  }, [accessToken]);

  // Si no está escuchando nada, mostramos un diseño "apagado"
  if (!nowPlaying) {
    return (
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-gray-400 h-[120px] w-full">
        <span className="text-sm font-medium">No estás escuchando nada ahora mismo</span>
      </div>
    );
  }

  const { item, progress_ms, is_playing } = nowPlaying;
  
  // Calculamos el porcentaje para la barra verde
  const progressPercent = (progress_ms / item.duration_ms) * 100;

  // Función para formatear milisegundos a "Minutos:Segundos" (ej: 3:20)
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="bg-[#121212] p-5 rounded-2xl border border-white/10 w-full shadow-xl">
      {/* Título y estado */}
      <div className="flex items-center gap-2 mb-4">
        {/* Ícono animado verde (solo visible si está en Play) */}
        <div className={`flex items-end gap-[2px] h-4 ${!is_playing && 'opacity-50'}`}>
          <div className="w-1 bg-green-500 animate-[bounce_1s_infinite] h-2"></div>
          <div className="w-1 bg-green-500 animate-[bounce_1.2s_infinite] h-4"></div>
          <div className="w-1 bg-green-500 animate-[bounce_0.8s_infinite] h-3"></div>
        </div>
        <h3 className="text-green-500 font-bold text-sm tracking-wider uppercase">
          {is_playing ? "Now Playing" : "Paused"}
        </h3>
      </div>

      <div className="flex items-center gap-4">
        {/* Portada del Álbum */}
        <img
          src={item.album.images[0]?.url}
          alt={item.name}
          className="w-16 h-16 rounded-md shadow-lg object-cover"
        />

        {/* Info de la Canción y Barra de progreso */}
        <div className="flex-1">
          <h4 className="text-white font-bold text-lg truncate">{item.name}</h4>
          <p className="text-gray-400 text-sm truncate">
            {item.artists.map((a: any) => a.name).join(", ")}
          </p>

          {/* Contenedor de la barra de progreso */}
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xs text-gray-400 w-8 text-right">
              {formatTime(progress_ms)}
            </span>
            
            {/* La barra de fondo gris */}
            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              {/* La barra verde que avanza */}
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <span className="text-xs text-gray-400 w-8">
              {formatTime(item.duration_ms)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}