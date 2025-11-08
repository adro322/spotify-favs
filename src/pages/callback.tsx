import { useEffect, useState } from "react";
import { getAccessToken } from "../utils/SpotifyAuth";

export default function CallbackPage() {
  const [tokenData, setTokenData] = useState<any>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code"); // captura el ?code= de la URL

    if (code) {
      getAccessToken(code).then(data => {
        if (data) {
          setTokenData(data);
          console.log("Access token:", data.access_token);
        }
      });
    }
  }, []);

  return (
    <div>
      <h1>Spotify Callback</h1>
      {tokenData ? (
        <pre>{JSON.stringify(tokenData, null, 2)}</pre>
      ) : (
        <p>Obteniendo token...</p>
      )}
    </div>
  );
}
