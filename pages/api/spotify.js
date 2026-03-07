// pages/api/spotify.js

var tokenData = { token: null, expires: 0 };

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  var clientId = process.env.SPOTIFY_CLIENT_ID;
  var clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "Spotify credentials not configured" });
  }

  // Get or refresh token
  var token = tokenData.token;
  if (!token || Date.now() >= tokenData.expires) {
    try {
      var authString = Buffer.from(clientId + ":" + clientSecret).toString("base64");
      var tokenRes = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Authorization": "Basic " + authString,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      });
      var tokenJson = await tokenRes.json();
      if (!tokenJson.access_token) {
        return res.status(500).json({ error: "Failed to get Spotify token" });
      }
      token = tokenJson.access_token;
      tokenData.token = token;
      tokenData.expires = Date.now() + 3500000;
    } catch (e) {
      return res.status(500).json({ error: "Spotify auth error" });
    }
  }

  var query = req.query.q || "";
  var artistId = req.query.id || "";

  try {
    // Get full artist details
    if (artistId) {
      var aRes = await fetch("https://api.spotify.com/v1/artists/" + artistId, {
        headers: { "Authorization": "Bearer " + token },
      });
      var aData = await aRes.json();

      var tRes = await fetch("https://api.spotify.com/v1/artists/" + artistId + "/top-tracks?market=AR", {
        headers: { "Authorization": "Bearer " + token },
      });
      var tData = await tRes.json();

      var rRes = await fetch("https://api.spotify.com/v1/artists/" + artistId + "/related-artists", {
        headers: { "Authorization": "Bearer " + token },
      });
      var rData = await rRes.json();

      var topTracks = [];
      if (tData.tracks) {
        for (var i = 0; i < Math.min(tData.tracks.length, 5); i++) {
          topTracks.push(tData.tracks[i]);
        }
      }

      var relArtists = [];
      if (rData.artists) {
        for (var j = 0; j < Math.min(rData.artists.length, 5); j++) {
          relArtists.push(rData.artists[j]);
        }
      }

      return res.status(200).json({
        artist: aData,
        topTracks: topTracks,
        relatedArtists: relArtists,
      });
    }

    // Search artists
    if (!query) {
      return res.status(400).json({ error: "Missing query" });
    }

    var sRes = await fetch(
      "https://api.spotify.com/v1/search?q=" + encodeURIComponent(query) + "&type=artist&limit=6&market=AR",
      { headers: { "Authorization": "Bearer " + token } }
    );
    var sData = await sRes.json();

    var artists = [];
    if (sData.artists && sData.artists.items) {
      for (var k = 0; k < sData.artists.items.length; k++) {
        var a = sData.artists.items[k];
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
    return res.status(500).json({ error: "Spotify API error" });
  }
}
