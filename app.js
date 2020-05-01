const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const app = express();

app.use(bodyParser.json());

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

mongoose
  .connect("mongodb://vote-mongo:27017/vote", { useNewUrlParser: true })
  .then(() => {
    console.log("=== Mongodb connected ===");
    app.listen(8080, () => {
      console.log("Running on port 8000");
    });
  })
  .catch((err) => console.log("Error =====>", err));
