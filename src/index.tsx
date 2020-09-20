import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./containers/App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";
import rootReducer from "./reducers";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import * as r from "./misc/reference";
import { getCurrentUser } from "./actions";

const store = createStore(rootReducer, applyMiddleware(thunk));
store.subscribe(() => {
  const state = store.getState();
  console.log(
    `%c<STORE> ${r.ACT[state.lastAction.type]}`,
    "color: red; font-size: 20px;"
  );
  console.log(state.data);
  console.log("%c</STORE>", "color: red; font-size: 20px;");
});
store.dispatch<any>(getCurrentUser()); //start the current user listener
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        {/*global objects go here*/}

        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
