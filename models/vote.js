const mongoose = require('mongoose');

const { Schema } = mongoose;

const voteShema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    shirtId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Shirt',
    },
    votes: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Vote', voteShema);
