// pages/api/spotify.js

var tokenData = { token: null, expires: 0 };

async function spotifyFetch(url, options) {
  var res = await fetch(url, options);
  if (!res.ok) {
    var errText = await res.text();
    throw new Error("Spotify HTTP " + res.status + ": " + errText);
  }
  return res.json();
}

async function getToken(clientId, clientSecret) {
  if (tokenData.token && Date.now() < tokenData.expires) {
    return tokenData.token;
  }

  var authString = Buffer.from(clientId + ":" + clientSecret).toString("base64");

  var data = await spotifyFetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + authString,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!data.access_token) {
    throw new Error("No access_token in response: " + JSON.stringify(data));
  }

  tokenData.token = data.access_token;
  tokenData.expires = Date.now() + 3500000;
  return data.access_token;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  var clientId = process.env.SPOTIFY_CLIENT_ID;
  var clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in environment variables" });
  }

  var query = req.query.q || "";
  var artistId = req.query.id || "";

  try {
    var token = await getToken(clientId, clientSecret);
    var headers = { "Authorization": "Bearer " + token };

    // Get full artist details
    if (artistId) {
      var artist = await spotifyFetch("https://api.spotify.com/v1/artists/" + artistId, { headers: headers });

      var topData = await spotifyFetch("https://api.spotify.com/v1/artists/" + artistId + "/top-tracks?market=AR", { headers: headers });

      var relData = await spotifyFetch("https://api.spotify.com/v1/artists/" + artistId + "/related-artists", { headers: headers });

      var topTracks = [];
      if (topData.tracks) {
        for (var i = 0; i < Math.min(topData.tracks.length, 5); i++) {
          topTracks.push(topData.tracks[i]);
        }
      }

      var relArtists = [];
      if (relData.artists) {
        for (var j = 0; j < Math.min(relData.artists.length, 5); j++) {
          relArtists.push(relData.artists[j]);
        }
      }

      return res.status(200).json({
        artist: artist,
        topTracks: topTracks,
        relatedArtists: relArtists,
      });
    }

    // Search artists
    if (!query) {
      return res.status(400).json({ error: "Missing query parameter 'q'" });
    }

    var searchData = await spotifyFetch(
      "https://api.spotify.com/v1/search?q=" + encodeURIComponent(query) + "&type=artist&limit=6&market=AR",
      { headers: headers }
    );

    var artists = [];
    if (searchData.artists && searchData.artists.items) {
      for (var k = 0; k < searchData.artists.items.length; k++) {
        var a = searchData.artists.items[k];
        var img = null;
        if (a.images && a.images.length > 0) img = a.images[0].url;
        artists.push({
          id: a.id,
          name: a.name,
          genres: a.genres || [],
          popularity: a.popularity,
          followers: a.followers ? a.followers.total : 0,
          image: img,
        });
      }
    }

    return res.status(200).json({ artists: artists });

  } catch (err) {
    console.error("Spotify error:", err.message || err);
    return res.status(500).json({ error: "Spotify error: " + (err.message || "unknown") });
  }
}
