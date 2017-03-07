import * as firebase from 'firebase';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {App} from './components/App';
import './index.css';

firebase.initializeApp({
  apiKey: 'AIzaSyCvK-h0vpW8cP92RSzOnxmk2B6PMUT0nNs',
  authDomain: 'lulu-38151.firebaseapp.com',
  databaseURL: 'https://lulu-38151.firebaseio.com',
  messagingSenderId: '393438054532',
  storageBucket: 'lulu-38151.appspot.com',
});

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);

// window['firebase'] = firebase;
