// server.js – OAuth2 Authorization Code Flow mit Trackimo

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(session({
  secret: 'kuh-bingo-trackimo-session',
  resave: false,
  saveUninitialized: true
}));

const config = {
  client_id: "bf6677e6-d489-4932-aa98-b01890b2793f",
  client_secret: "b95f862a26ed9d2e26f82530c9c747e8",
  redirect_uri: "https://tracki-proxy.onrender.com/callback",
  auth_url: "https://plus.trackimo.com/api/v2/oauth/authorize",
  token_url: "https://plus.trackimo.com/api/v2/oauth/token",
};

// ✅ Root-Route: Statusanzeige
app.get("/", (req, res) => {
  res.send("✅ Tracki-Proxy läuft. Bitte zuerst <a href='/auth'>/auth</a> aufrufen.");
});

// ✅ Schritt 1: Auth starten
app.get("/auth", (req, res) => {
  const authUrl = `${config.auth_url}?client_id=${config.client_id}&response_type=code&redirect_uri=${encodeURIComponent(config.redirect_uri)}`;
  res.redirect(authUrl);
});

// ✅ Schritt 2: Token erhalten
app.get("/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const response = await axios.post(config.token_url, {
      grant_type: "authorization_code",
      client_id: config.client_id,
      client_secret: config.client_secret,
      redirect_uri: config.redirect_uri,
      code,
    });

    const token = response.data.access_token;
    req.session.token = token;
    console.log("✅ Access Token gespeichert:", token);
    res.send("✅ Authentifizierung erfolgreich. Du kannst nun <a href='/api/trackers'>/api/trackers</a> aufrufen.");
  } catch (error) {
    console.error("❌ Fehler beim Token-Austausch:", error.response?.data || error.message);
    res.status(500).send("❌ Token-Austausch fehlgeschlagen.");
  }
});

// ✅ Live-Tracker abrufen
app.get("/api/trackers", async (req, res) => {
  const token = req.session.token;
  if (!token) {
    return res.status(401).send("❌ Nicht authentifiziert. Bitte zuerst <a href='/auth'>/auth</a> aufrufen.");
  }

  try {
    const response = await axios.get("https://plus.trackimo.com/api/v2/devices", {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Tracker:", error.response?.data || error.message);
    res.status(500).send("❌ Fehler bei der Tracker-Abfrage.");
  }
});

app.listen(port, () => {
  console.log(`🚀 Tracki-Proxy läuft auf Port ${port}`);
});
