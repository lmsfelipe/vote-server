require('dotenv/config');

const http = require('http');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const auth = require('./utils/auth');
const teamsLoader = require('./graphql/Team/loader');
const shirtsLoader = require('./graphql/Shirt/loader');
const models = require('./models');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: ({ req, connection }) => {
    if (connection) {
      return {
        ...connection.context,
        models,
        loaders: {
          teamsLoader: teamsLoader(),
          shirtsLoader: shirtsLoader(),
        },
      };
    }

    return {
      models,
      authScope: auth(req),
      loaders: {
        teamsLoader: teamsLoader(),
        shirtsLoader: shirtsLoader(),
      },
    };
  },
});
server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

mongoose
  .connect('mongodb://vote-mongo:27017/vote', { useNewUrlParser: true })
  .then(() => {
    console.log('=== Mongodb connected ===');
    httpServer.listen(8080, () => {
      console.log('Running on port 8000');
    });
  })
  .catch((err) => console.log('Error =====>', err));
