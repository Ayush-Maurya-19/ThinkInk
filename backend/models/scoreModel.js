const { model, Schema } = require("../connection");

const mySchema = new Schema({
  name: String,
  id: String,
  score: Number,
  date: { type: Date, default: Date.now },
  avatar: String,
  rank: Number,
});

module.exports = model("score", mySchema);
