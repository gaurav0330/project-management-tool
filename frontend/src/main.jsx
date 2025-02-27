import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
    </React.StrictMode>
  );
} else {
  console.error("⚠️ Root element not found. Make sure your HTML file has a `<div id='root'></div>`.");
}
