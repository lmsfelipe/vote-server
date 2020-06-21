require('dotenv/config');

const http = require('http');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const auth = require('./utils/auth');
const { dbLogger, consoleLogger } = require('./utils/logger');
const loaders = require('./dataloaders');
const models = require('./models');

const { MONGODB_URL } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

// Creates a plugin to send all graphQL requests to logger
const plugin = {
  requestDidStart() {
    return {
      executionDidStart(requestContext) {
        dbLogger.info(requestContext.request.query);
      },
    };
  },
};

// This function catch all errors and send to looger
const formatError = (error) => {
  dbLogger.error(error);
  return error;
};

/**
 * The function that sets up the global context for each resolver
 * Validates 'connection' to check if it is a subscription
 */
const context = ({ req, connection }) => {
  if (connection) {
    return {
      ...connection.context,
      models,
      loaders,
    };
  }

  return {
    models,
    authScope: auth(req),
    loaders,
  };
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  // Engine is enable to monitor app in Apollo Manager
  engine: { experimental_schemaReporting: true },
  tracing: true,
  formatError,
  plugins: [plugin],
  context,
});

// Create server is necessary to subscriptions work properly
server.applyMiddleware({ app });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    httpServer.listen(8080, () => {
      consoleLogger.info('=== App is running ===');
    });
  })
  .catch((err) => {
    consoleLogger.error(err);
  });
