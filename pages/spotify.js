// pages/api/spotify.js
// Searches Spotify for artists using Client Credentials flow (no user login needed)

var tokenCache = { token: null, expires: 0 };

async function getToken() {
  if (tokenCache.token && Date.now() < tokenCache.expires) {
    return tokenCache.token;
  }
  var clientId = process.env.SPOTIFY_CLIENT_ID;
  var clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  var basic = Buffer.from(clientId + ":" + clientSecret).toString("base64");

  var res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + basic,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  var data = await res.json();
  tokenCache.token = data.access_token;
  tokenCache.expires = Date.now() + (data.expires_in - 60) * 1000;
  return data.access_token;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  var query = req.query.q;
  var artistId = req.query.id;

  try {
    var token = await getToken();

    // If artist ID provided, get full artist details + top tracks
    if (artistId) {
      var artistRes = await fetch("https://api.spotify.com/v1/artists/" + artistId, {
        headers: { "Authorization": "Bearer " + token },
      });
      var artist = await artistRes.json();

      var topRes = await fetch("https://api.spotify.com/v1/artists/" + artistId + "/top-tracks?market=AR", {
        headers: { "Authorization": "Bearer " + token },
      });
      var topData = await topRes.json();

      var relatedRes = await fetch("https://api.spotify.com/v1/artists/" + artistId + "/related-artists", {
        headers: { "Authorization": "Bearer " + token },
      });
      var relatedData = await relatedRes.json();

      return res.status(200).json({
        artist: artist,
        topTracks: topData.tracks ? topData.tracks.slice(0, 5) : [],
        relatedArtists: relatedData.artists ? relatedData.artists.slice(0, 5) : [],
      });
    }

    // Otherwise search by name
    if (!query) return res.status(400).json({ error: "Missing query" });

    var searchRes = await fetch(
      "https://api.spotify.com/v1/search?q=" + encodeURIComponent(query) + "&type=artist&limit=6&market=AR",
      { headers: { "Authorization": "Bearer " + token } }
    );
    var searchData = await searchRes.json();
    var artists = searchData.artists && searchData.artists.items ? searchData.artists.items : [];

    return res.status(200).json({
      artists: artists.map(function(a) {
        return {
          id: a.id,
          name: a.name,
          genres: a.genres || [],
          popularity: a.popularity,
          followers: a.followers ? a.followers.total : 0,
          image: a.images && a.images.length > 0 ? a.images[0].url : null,
          imageSmall: a.images && a.images.length > 1 ? a.images[a.images.length - 1].url : null,
        };
      }),
    });
  } catch (err) {
    console.error("Spotify API error:", err);
    return res.status(500).json({ error: "Spotify API error" });
  }
}
