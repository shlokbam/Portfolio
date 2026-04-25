"use client";

import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

type Mode = "browse" | "investigation";

interface ThemeContextType {
  mode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
  investigationStep: number;
  setInvestigationStep: Dispatch<SetStateAction<number>>;
  isIntroComplete: boolean;
  setIsIntroComplete: Dispatch<SetStateAction<boolean>>;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("browse");
  const [investigationStep, setInvestigationStep] = useState(0);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
        investigationStep,
        setInvestigationStep,
        isIntroComplete,
        setIsIntroComplete,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
