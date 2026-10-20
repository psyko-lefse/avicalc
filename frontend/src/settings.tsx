import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { storage } from "@/src/utils/storage";

export type WeightUnit = "kg" | "lb";
export type VolumeUnit = "L" | "USG";

type Settings = {
  weightUnit: WeightUnit;
  volumeUnit: VolumeUnit;
  setWeightUnit: (u: WeightUnit) => void;
  setVolumeUnit: (u: VolumeUnit) => void;
};

const SettingsContext = createContext<Settings | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [weightUnit, setW] = useState<WeightUnit>("kg");
  const [volumeUnit, setV] = useState<VolumeUnit>("L");

  useEffect(() => {
    (async () => {
      const w = await storage.getItem("weight_unit", "kg");
      const v = await storage.getItem("volume_unit", "L");
      if (w === "kg" || w === "lb") setW(w);
      if (v === "L" || v === "USG") setV(v);
    })();
  }, []);

  const setWeightUnit = (u: WeightUnit) => {
    setW(u);
    storage.setItem("weight_unit", u);
  };
  const setVolumeUnit = (u: VolumeUnit) => {
    setV(u);
    storage.setItem("volume_unit", u);
  };

  return (
    <SettingsContext.Provider value={{ weightUnit, volumeUnit, setWeightUnit, setVolumeUnit }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
