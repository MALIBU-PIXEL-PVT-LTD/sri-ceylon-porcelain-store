const { schema } = require("./schema");
const { createResolvers } = require("./resolvers");
const { readBearerToken } = require("./auth");

const createGraphQLConfig = (pool) => ({
  schema,
  rootValue: createResolvers(pool),
  context: (request) => ({
    token: readBearerToken(request.headers),
  }),
});

module.exports = { createGraphQLConfig };
