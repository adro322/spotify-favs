export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, redirect_uri: clientRedirect } = await req.json();

  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirect_uri = process.env.REDIRECT_URI;

  if (!client_id || !client_secret || !redirect_uri) {
    return res.status(500).json({ error: "Missing server environment variables" });
  }

  // log para depuración
  console.log("Server REDIRECT_URI env:", redirect_uri);
  if (clientRedirect) console.log("Client sent redirect_uri:", clientRedirect);

  const creds = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${creds}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri, // usar el valor del servidor (debe ser idéntico al del cliente)
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // devolver la respuesta de Spotify para depuración
      return res.status(response.status).json({ spotify_error: data, sent_redirect_uri: redirect_uri });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Error fetching token", details: String(err) });
  }
}