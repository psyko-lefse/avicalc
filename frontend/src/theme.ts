// Design tokens (light + dark). Keys match the "color" block of /app/design_guidelines.json.
// Build styles with makeStyles; for non-style color props use useTheme().colors.

import { useMemo } from "react";
import { Appearance, StyleSheet, useColorScheme } from "react-native";

export type ColorScheme = "light" | "dark";

const light = {
  surface: "#FAFAFA",
  onSurface: "#171717",
  surfaceSecondary: "#FFFFFF",
  onSurfaceSecondary: "#171717",
  surfaceTertiary: "#F5F5F5",
  onSurfaceTertiary: "#262626",
  surfaceInverse: "#171717",
  onSurfaceInverse: "#FFFFFF",
  muted: "#737373",

  brand: "#EA580C",
  onBrand: "#FFFFFF",
  brandPrimary: "#EA580C",
  onBrandPrimary: "#FFFFFF",
  brandSecondary: "#C2410C",
  onBrandSecondary: "#FFFFFF",
  brandTertiary: "#FFEDD5",
  onBrandTertiary: "#9A3412",

  success: "#166534",
  onSuccess: "#FFFFFF",
  warning: "#854D0E",
  onWarning: "#FFFFFF",
  error: "#991B1B",
  onError: "#FFFFFF",
  info: "#374151",
  onInfo: "#FFFFFF",

  border: "#E5E5E5",
  borderStrong: "#D4D4D4",
  divider: "#E5E5E5",
};

export type ThemeColors = typeof light;

const dark: ThemeColors = {
  surface: "#0A0A0A",
  onSurface: "#F5F5F5",
  surfaceSecondary: "#171717",
  onSurfaceSecondary: "#F5F5F5",
  surfaceTertiary: "#262626",
  onSurfaceTertiary: "#D4D4D4",
  surfaceInverse: "#FFFFFF",
  onSurfaceInverse: "#171717",
  muted: "#A3A3A3",

  brand: "#F97316",
  onBrand: "#0A0A0A",
  brandPrimary: "#F97316",
  onBrandPrimary: "#0A0A0A",
  brandSecondary: "#FB923C",
  onBrandSecondary: "#0A0A0A",
  brandTertiary: "#431407",
  onBrandTertiary: "#FFEDD5",

  success: "#22C55E",
  onSuccess: "#0A0A0A",
  warning: "#EAB308",
  onWarning: "#0A0A0A",
  error: "#EF4444",
  onError: "#0A0A0A",
  info: "#9CA3AF",
  onInfo: "#0A0A0A",

  border: "#262626",
  borderStrong: "#404040",
  divider: "#262626",
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
