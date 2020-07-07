# Shirt Vote Server

A NodeJs, mongoDB and GraphQL server for a football vote application.

## Command

#### Docker and docker-compose

```bash
docker-compose build && docker-compose up
```

### Testing GraphQL playground

It's possible to run queries on http://localhost:8000/graphql.

You can check examples of possible [Queries](https://github.com/lmsfelipe/vote-server/blob/master/queries-example.graphql) on the server.

### Test

```bash
npm test
```

Or watch

```bash
npm test --watch
```
