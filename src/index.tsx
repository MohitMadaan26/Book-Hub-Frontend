import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import { Provider } from "urql";
import client from "./services/urqlClient";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider value={client}>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </Provider>
);
