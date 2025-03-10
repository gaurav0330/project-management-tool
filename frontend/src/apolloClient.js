import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const SOCKET_URL = `${import.meta.env.VITE_SOCKET_URL}/graphql`; // Append /graphql
// GraphQL API Endpoint
const httpLink = createHttpLink({
  uri: SOCKET_URL, // Replace with your backend URL
});

// Middleware to Attach JWT Token to Headers
const authLink = setContext(() => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
