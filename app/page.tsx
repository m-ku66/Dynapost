import React from "react";
import { AppContextProvider } from "./context/AppContext";

export default function Home() {
  return (
    <AppContextProvider>
      <div></div>
    </AppContextProvider>
  );
}
