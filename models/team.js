const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teamSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    slug: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    region: {
      country: {
        type: String,
        require: true,
      },
      state: {
        type: String,
        require: true,
      },
      city: {
        type: String,
        require: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
