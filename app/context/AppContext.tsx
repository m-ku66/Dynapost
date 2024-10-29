"use client";
import React, { createContext, useState, ReactNode } from "react";

type appStateObject = {
  physicsState: string;
  objectShape: "orb" | "cross" | "box";
};

// define types for the constext
interface AppContextType {
  state: appStateObject;
  setState: React.Dispatch<React.SetStateAction<appStateObject>>;
}

// create the context
export const AppContext = createContext<AppContextType | undefined>(undefined);

// define props for the provider
interface AppContextProviderProps {
  children: ReactNode;
}

// create the provider
export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [appstate, setAppState] = useState<appStateObject>({
    physicsState: "float",
    objectShape: "orb",
  });

  return (
    <AppContext.Provider value={{ state: appstate, setState: setAppState }}>
      {children}
    </AppContext.Provider>
  );
};
