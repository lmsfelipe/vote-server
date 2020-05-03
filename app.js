const http = require("http");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const schema = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const app = express();

app.use(bodyParser.json());

const server = new ApolloServer({ typeDefs: schema, resolvers });
server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

mongoose
  .connect("mongodb://vote-mongo:27017/vote", { useNewUrlParser: true })
  .then(() => {
    console.log("=== Mongodb connected ===");
    httpServer.listen(8080, () => {
      console.log("Running on port 8000");
    });
  })
  .catch((err) => console.log("Error =====>", err));
