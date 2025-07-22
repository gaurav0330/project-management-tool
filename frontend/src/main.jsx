import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import { AuthProvider } from "./components/authContext";
import { ThemeProvider } from "./contexts/ThemeContext.jsx"; // ✅ Import ThemeProvider

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <ThemeProvider> {/* ✅ Wrap with ThemeProvider as outermost */}
        <AuthProvider> {/* ✅ AuthProvider stays inside */}
          <ApolloProvider client={client}>
            <App />
          </ApolloProvider>
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
} else {
  console.error("Refresh the page.");
}
