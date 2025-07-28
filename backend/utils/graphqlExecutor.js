// utils/graphqlExecutor.js (new file)
const { execute, toPromise } = require('apollo-link');
const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');
const { ApolloServer } = require('apollo-server-express');  // If needed for schema

const executeGraphQL = async (query, variables) => {
  const link = new HttpLink({
    uri: 'http://localhost:5000/graphql',  // Your GraphQL endpoint
    fetch,
  });

  const operation = {
    query,
    variables,
  };

  const result = await toPromise(execute(link, operation));
  if (result.errors) throw new Error(result.errors[0].message);
  return result.data;
};

module.exports = { executeGraphQL };
