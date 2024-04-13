const { model, Schema, Types } = require("../connection");

const mySchema = new Schema({
  user: {type: Types.ObjectId, ref: "user"},
  points: Number,
  rank: Number,
  createdAt: {type: Date, default: Date.now},
});

module.exports = model("score", mySchema);
