const mongoose = require('mongoose');

const { Schema } = mongoose;

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
        default: 'Brasil',
      },
      state: {
        type: String,
        default: 'São Paulo',
      },
      city: {
        type: String,
        default: 'São Paulo',
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Team', teamSchema);
