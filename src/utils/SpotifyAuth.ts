import axios from "axios";


const clientId = "28f681099dd4476ab876de8f335a4645";
const clientSecret = "0ca20e3c7d704b69b5978f48bd382e83";
const redirectUri = "https://spotify-favs-iota.vercel.app/";

export const getAccessToken = async (code: string) => {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri);
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data; // Aquí vienen access_token y refresh_token
  } catch (error) {
    console.error("Error obteniendo access token:", error);
    return null;
  }
};
