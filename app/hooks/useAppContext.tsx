import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export const useAppContext = () => {
  const context = useContext(AppContext); // get the context and store it in a variable
  if (!context) {
    throw new Error("useAppContext must be used within a AppContextProvider"); // if the context is not found, throw an error
  }
  return context; // return the context value
};
