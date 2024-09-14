import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

export default mongoose.models.Favorite ||
  mongoose.model("Favorite", FavoriteSchema);
