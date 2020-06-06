const mongoose = require('mongoose');

module.exports = {
  async connect() {
    await mongoose.connect(
      global.__MONGO_URI__,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      },
    );
  },

  async disconnect() {
    await mongoose.disconnect();
  },
};
