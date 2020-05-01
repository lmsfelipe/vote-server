const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const shirtSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    mainImage: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    votes: {
      type: Number,
      required: false,
      default: 0,
    },
    brand: {
      type: String,
      required: true,
    },
    titles: {
      type: Array,
      required: false,
      default: [],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
    team: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Team",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shirt", shirtSchema);
