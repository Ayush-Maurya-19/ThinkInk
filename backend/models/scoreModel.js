const { model, Schema } = require("../connection");

const mySchema = new Schema({
  user_id: String,
  name: String,
  points: Number,
  rank: Number,
});

module.exports = model("score", mySchema);
