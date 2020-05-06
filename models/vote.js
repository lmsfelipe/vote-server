const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const voteShema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    shirtId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Shirt",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vote", voteShema);
