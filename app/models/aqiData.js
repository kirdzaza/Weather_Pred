const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true,
    min: -90,
    max: 90,
  },
  lon: {
    type: Number,
    required: true,
    min: -180,
    max: 180,
  },
});
const aqiData = mongoose.models.aqiDatas || mongoose.model("aqiDatas", schema);
module.exports = aqiData;
