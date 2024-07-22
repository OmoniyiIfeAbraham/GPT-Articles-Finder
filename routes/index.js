const express = require("express");
const router = express.Router();
const axios = require("axios");

const apiKey = process.env.googleCloudConsoleApiKey;
const cx = process.env.customSearchEngineIdcx;

// Mock data
const adLists = {
  adList1: [
    "Enhance your digital footprint with our expert marketing solutions. From SEO to social media, we tailor strategies to elevate your brand. Contact us today to maximize your reach and visibility. Transform your online presence and outshine the competition!",
    "Discover unbeatable deals on the latest trends. From fashion to tech, save big on top brands. Sign up for our newsletter for early access to sales and personalized offers. Shop now and enjoy limited-time discounts. Don't miss out!",
    "Elevate your home with our stylish decor collection. From modern to rustic, find high-quality pieces that reflect your taste. Shop our curated selection and get inspired. Make every corner of your home a statement. Visit us today!",
    "Stay ahead with the latest gadgets at unbeatable prices. From smartphones to smart home devices, find top tech from trusted brands. Enjoy special offers and expert advice. Shop now and upgrade your digital life. Explore our collection today!",
    "Join our fitness program for personalized training plans. Whether you want to lose weight or build muscle, our experts guide you. Enjoy a variety of classes and state-of-the-art equipment. Start your journey today and transform your health!",
  ],
  adList2: [
    "Refresh your style with our latest clothing collection. From casual wear to evening outfits, find fashionable and affordable pieces. Shop now for exclusive discounts and free shipping. Express your unique style with our trendy selection!",
    "Indulge in our luxurious spa treatments and escape the daily grind. From massages to facials, enjoy top-notch care in a serene setting. Book your appointment today and rejuvenate your mind and body. Treat yourself to ultimate relaxation!",
    "Savor premium gourmet foods from around the world. From cheeses to chocolates, indulge in top-quality ingredients. Shop online and enjoy convenient home delivery. Elevate your culinary experience with our exquisite selection. Order now!",
    "Enhance your career with our online courses. From tech to arts, gain new skills at your own pace. Join a community of learners and access expert instructors. Sign up today and invest in your future. Explore our course catalog now!",
    "Let us create your perfect getaway with tailor-made travel packages. From beaches to mountains, find your ideal destination. Enjoy personalized service and great deals. Contact us now to start planning your unforgettable vacation!",
  ],
  adList3: ["Ad 3.1", "Ad 3.2"],
};

const sites = ["facebook.com", "instagram.com", "twitter.com"];

const searchPresets = [
  "intitle:'In today's fast-paced world' intext:revolutionize intext:innovative",
  "intitle:'Discover the best' intext:solutions intext:technology",
];

router.get("/", (req, res) => {
  res.render("index", { adLists, sites, searchPresets });
});

// Route to handle search
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

    res.json(response.data.items.slice(0, 10));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch search results" });
  }
});

module.exports = router;
