import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";

import { setColorScheme } from "@/src/theme";
import { storage } from "@/src/utils/storage";

export type WeightUnit = "kg" | "lb";
export type VolumeUnit = "L" | "USG";
export type ThemeMode = "system" | "light" | "dark";

type Settings = {
  weightUnit: WeightUnit;
  volumeUnit: VolumeUnit;
  themeMode: ThemeMode;
  setWeightUnit: (u: WeightUnit) => void;
  setVolumeUnit: (u: VolumeUnit) => void;
  setThemeMode: (m: ThemeMode) => void;
};

const applyTheme = (m: ThemeMode) => setColorScheme(m === "system" ? null : m);

const SettingsContext = createContext<Settings | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [weightUnit, setW] = useState<WeightUnit>("kg");
  const [volumeUnit, setV] = useState<VolumeUnit>("L");
  const [themeMode, setT] = useState<ThemeMode>("system");
  const themeTouched = useRef(false);

  useEffect(() => {
    (async () => {
      const w = await storage.getItem("weight_unit", "kg");
      const v = await storage.getItem("volume_unit", "L");
      const t = await storage.getItem("theme_mode", "system");
      if (w === "kg" || w === "lb") setW(w);
      if (v === "L" || v === "USG") setV(v);
      if (!themeTouched.current && (t === "system" || t === "light" || t === "dark")) {
        setT(t);
        applyTheme(t);
      }
    })();
  }, []);

  const setThemeMode = (m: ThemeMode) => {
    themeTouched.current = true;
    setT(m);
    applyTheme(m);
    storage.setItem("theme_mode", m);
  };

  const setWeightUnit = (u: WeightUnit) => {
    setW(u);
    storage.setItem("weight_unit", u);
  };
  const setVolumeUnit = (u: VolumeUnit) => {
    setV(u);
    storage.setItem("volume_unit", u);
  };

  return (
    <SettingsContext.Provider value={{ weightUnit, volumeUnit, themeMode, setWeightUnit, setVolumeUnit, setThemeMode }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
