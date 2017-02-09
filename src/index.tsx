import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "./index.css";
import App from "./App"
import * as firebase from 'firebase';

firebase.initializeApp({
  apiKey: "AIzaSyCvK-h0vpW8cP92RSzOnxmk2B6PMUT0nNs",
  authDomain: "lulu-38151.firebaseapp.com",
  databaseURL: "https://lulu-38151.firebaseio.com",
  storageBucket: "lulu-38151.appspot.com",
  messagingSenderId: "393438054532"
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

