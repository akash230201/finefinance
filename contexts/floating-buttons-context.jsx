"use client";

import { createContext, useContext, useState } from "react";

const FloatingButtonsContext = createContext();

export function FloatingButtonsProvider({ children }) {
  const [isChatbotVisible, setIsChatbotVisible] = useState(true);

  return (
    <FloatingButtonsContext.Provider
      value={{
        isChatbotVisible,
        setIsChatbotVisible,
      }}
    >
      {children}
    </FloatingButtonsContext.Provider>
  );
}

export function useFloatingButtons() {
  const context = useContext(FloatingButtonsContext);
  if (!context) {
    throw new Error(
      "useFloatingButtons must be used within a FloatingButtonsProvider"
    );
  }
  return context;
}
