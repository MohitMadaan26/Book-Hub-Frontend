import { Client, cacheExchange, fetchExchange } from "urql";

// get the token from localStorage
const getToken = () => localStorage.getItem("token");

const client = new Client({
  // url: "http://localhost:4000/",
  url: process.env.REACT_APP_API_URL!,
  exchanges: [
    // cacheExchange, // Caching layer
    fetchExchange, // Fetching layer
  ],
  fetchOptions: {
    headers: {
      // Add Authorization header with the JWT token
      Authorization: `${getToken()}`,
    },
  },
});

export default client;
