const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const apiKey = process.env.googleCloudConsoleApiKey;
const cx = process.env.customSearchEngineIdcx;

const loadFile = (filename) => {
  const filePath = path.join(__dirname, '../DB', filename);
  return fs.readFileSync(filePath, 'utf-8').split('\n').map(line => line.trim()).filter(line => line.length > 0);
};

const loadAdLists = (filename) => {
  const filePath = path.join(__dirname, '../DB', filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  const adLists = {};
  const sections = content.split(/adList\d:/).filter(section => section.trim().length > 0);
  sections.forEach((section, index) => {
    adLists[`adList${index + 1}`] = section.split(';').map(ad => ad.trim()).filter(ad => ad.length > 0);
  });
  return adLists;
};

router.get("/", (req, res) => {
  // Load data from files
  const adLists = loadAdLists('adLists.txt');
  const sites = loadFile('sites.txt');
  const searchPresets = loadFile('searchPresets.txt');
  res.render("index", { adLists, sites, searchPresets });
});

router.post("/api/search", async (req, res) => {
  const { site, preset } = req.body;
  const query = `site:${site} ${preset}`;

  try {
    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1`,
      {
        params: {
          key: apiKey,
          cx: cx,
          q: query,
        },
      }
    );

    req.session.lastSearch = Date.now();
    res.json(response.data.items.slice(0, 10));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch search results" });
  }
});

router.get("/api/check-session", (req, res) => {
  if (req.session.lastSearch) {
    const timeElapsed = Date.now() - req.session.lastSearch;
    const timeLeft = (30000 - timeElapsed);
    res.json({ timeLeft: timeLeft > 0 ? timeLeft : 0 });
  } else {
    res.json({ timeLeft: 0 });
  }
});

module.exports = router;
