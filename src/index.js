import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
  navigator.serviceWorker.register('serviceWorker.js').then(function(registration) {
  // Registration was successful
  console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }, function(err) {
  // registration failed :(
  console.log('ServiceWorker registration failed: ', err);
  });
  });
  }
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
