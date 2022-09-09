import React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
//import * as serviceWorker from "./serviceWorker";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    900: "#a062a5",
    800: "#153e75",
    700: "#3182CE",
  },
};

const theme = extendTheme({ colors });

ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );