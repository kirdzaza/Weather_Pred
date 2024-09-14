const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define your schema and model
const favoriteSchema = new mongoose.Schema({
  latitude: String,
  longitude: String,
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

// Routes
app.post("/api/favorites/add", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const newFavorite = new Favorite({ latitude, longitude });
    await newFavorite.save();
    res.status(200).json({ message: "Added to favorites!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add to favorites." });
  }
});

app.post("/api/favorites/remove", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    await Favorite.findOneAndDelete({ latitude, longitude });
    res.status(200).json({ message: "Removed from favorites!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove from favorites." });
  }
});

app.post("/api/favorites/check", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const favorite = await Favorite.findOne({ latitude, longitude });
    res.status(200).json({ isFavorite: !!favorite });
  } catch (err) {
    res.status(500).json({ message: "Failed to check favorites." });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
