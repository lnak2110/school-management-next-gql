import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  concat,
} from "@apollo/client";
import Cookies from "js-cookie";

const httpLink = new HttpLink({
  uri: process.env.API_URL,
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = Cookies.get("role") || "teacher";

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  }));

  return forward(operation);
});

const clientInstance = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: { fetchPolicy: "no-cache" },
    mutate: { fetchPolicy: "no-cache" },
  },
});

export default clientInstance;
