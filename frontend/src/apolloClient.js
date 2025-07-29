import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// GraphQL API Endpoint
const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? process.env.VITE_BACKEND_URL + "/graphql" 
      : "https://project-management-tool-af4j.onrender.com/graphql",
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
