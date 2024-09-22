const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  lat: Number,
  lon: Number,
});
const currentData =
  mongoose.currentDatas || mongoose.model("currentDatas", schema);
module.exports = currentData;
