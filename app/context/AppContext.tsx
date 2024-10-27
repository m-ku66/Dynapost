"use client";
import React, { createContext, useState, ReactNode } from "react";
// define types for the constext
interface AppContextType {
  state: object;
  setState: React.Dispatch<React.SetStateAction<object>>;
}

// create the context
export const AppContext = createContext<AppContextType | undefined>(undefined);

// define props for the provider
interface AppContextProviderProps {
  children: ReactNode;
}

// create the provider
export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [appstate, setAppState] = useState<object>({
    physicsState: "float",
    objectShape: "orb",
  });

  return (
    <AppContext.Provider value={{ state: appstate, setState: setAppState }}>
      {children}
    </AppContext.Provider>
  );
};
