// Design tokens (light + dark). Keys match the "color" block of /app/design_guidelines.json.
// Build styles with makeStyles; for non-style color props use useTheme().colors.

import { useMemo } from "react";
import { Appearance, StyleSheet, useColorScheme } from "react-native";

export type ColorScheme = "light" | "dark";

const light = {
  surface: "#F2F6FB",
  onSurface: "#00244F",
  surfaceSecondary: "#FFFFFF",
  onSurfaceSecondary: "#00244F",
  surfaceTertiary: "#E6EDF6",
  onSurfaceTertiary: "#0B2E5C",
  surfaceInverse: "#00244F",
  onSurfaceInverse: "#FFFFFF",
  muted: "#5B6E8A",

  brand: "#00C8FE",
  onBrand: "#00244F",
  brandPrimary: "#00244F",
  onBrandPrimary: "#FFFFFF",
  brandSecondary: "#0090C8",
  onBrandSecondary: "#FFFFFF",
  brandTertiary: "#E0F5FF",
  onBrandTertiary: "#00244F",

  success: "#15803D",
  onSuccess: "#FFFFFF",
  warning: "#B45309",
  onWarning: "#FFFFFF",
  error: "#B91C1C",
  onError: "#FFFFFF",
  info: "#0090C8",
  onInfo: "#FFFFFF",

  border: "#D5E0EE",
  borderStrong: "#AFC2DA",
  divider: "#DCE5F0",
};

export type ThemeColors = typeof light;

const dark: ThemeColors = {
  surface: "#001A3D",
  onSurface: "#FFFFFF",
  surfaceSecondary: "#00244F",
  onSurfaceSecondary: "#FFFFFF",
  surfaceTertiary: "#0A3466",
  onSurfaceTertiary: "#DCEBFA",
  surfaceInverse: "#FFFFFF",
  onSurfaceInverse: "#00244F",
  muted: "#8EA6C6",

  brand: "#00C8FE",
  onBrand: "#001A3D",
  brandPrimary: "#00C8FE",
  onBrandPrimary: "#001A3D",
  brandSecondary: "#5ADBFF",
  onBrandSecondary: "#001A3D",
  brandTertiary: "#04336A",
  onBrandTertiary: "#00C8FE",

  success: "#22C55E",
  onSuccess: "#001A3D",
  warning: "#FBBF24",
  onWarning: "#001A3D",
  error: "#F87171",
  onError: "#001A3D",
  info: "#5ADBFF",
  onInfo: "#001A3D",

  border: "#0E3B70",
  borderStrong: "#1D5290",
  divider: "#0E3B70",
};

export const defaultScheme = "light" satisfies ColorScheme;

export const themes: { light: ThemeColors; dark?: ThemeColors } = { light, dark };

export function setColorScheme(scheme: ColorScheme | null) {
  Appearance.setColorScheme?.(scheme ?? "unspecified");
}

setColorScheme?.(themes.dark ? null : defaultScheme);

export function useTheme(): { scheme: ColorScheme; colors: ThemeColors } {
  const system = useColorScheme();
  const scheme: ColorScheme = (system === "light" || system === "dark") && themes[system] ? system : defaultScheme;
  return { scheme, colors: themes[scheme] ?? themes.light };
}

export function makeStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  factory: (colors: ThemeColors) => T & StyleSheet.NamedStyles<any>,
): () => T {
  return function useStyles(): T {
    const { colors } = useTheme();
    return useMemo(() => StyleSheet.create(factory(colors)), [colors]);
  };
}
