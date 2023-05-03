import { createContext, useContext } from "react";
import { LngLat } from "../../models/LngLat.model";

interface DecosContextType {
  location: LngLat | null;
}

const DecosContext = createContext<DecosContextType>({
  location: null,
});

export const DecosProvider = DecosContext.Provider;
export const useDecosContext = () => useContext(DecosContext);
