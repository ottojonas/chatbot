import React from "react";
import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Analytics />
    </AuthProvider>
  );
}
