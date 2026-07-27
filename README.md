# 🎵 Spotify Favs - Music Analytics Dashboard
Dashboard interactivo de análisis musical que consume la API de Spotify para procesar y visualizar estadísticas de reproducción, incluyendo canciones principales, artistas favoritos y géneros musicales por períodos de tiempo.

🌐 **Enlace del proyecto:** [spotify-favs-iota.vercel.app](https://spotify-favs-iota.vercel.app/)

## ⚠️ Nota Importante sobre la API de Spotify (Modo Desarrollo)
Debido a las políticas actuales y restricciones de cuota de la Spotify Developer API, esta aplicación se encuentra operando bajo el Modo de Desarrollo (Development Mode). Esto implica dos condiciones técnicas importantes impuestas por Spotify:
* **Requisito de Cuenta Premium:** Debido a los endpoints utilizados para consultar el historial de reproducción y las preferencias del usuario en tiempo real, es estrictamente necesario contar con una cuenta de Spotify Premium para iniciar sesión y visualizar las estadísticas.
* **Límite de Colaboradores / Usuarios:** Por restricciones de la plataforma de desarrolladores de Spotify, solo se permite un máximo de 5 usuarios registrados en la lista de acceso (WhiteList) de la aplicación para poder autenticarse. Si deseas probarlo y el acceso está restringido, puedes contactarme directamente para añadir tu correo al panel de desarrolladores.

## ✨ Características Principales
📊 Visualización de Datos: Gráficos interactivos construidos con Recharts para desglosar géneros musicales y tendencias de escucha.

🎧 Top Tracks & Artists: Consulta tus canciones y artistas más escuchados en diferentes rangos de tiempo.

🔐 Autenticación Segura: Conexión mediante OAuth 2.0 directamente con el servicio de cuentas de Spotify.

🎨 Interfaz Moderna: Diseño responsive con modo oscuro optimizado utilizando Tailwind CSS.

## 🛠️ Stack Tecnológico
* **Frontend:** React.js, Vite, Tailwind CSS.
* **Librerías de Gráficos:** Recharts, Lucide React.
* **APIs & Consumo:** Spotify Web API, Axios.
* **Despliegue:** Vercel.
