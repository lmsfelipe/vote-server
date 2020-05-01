const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const voteShema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    shirtId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vote", voteShema);
