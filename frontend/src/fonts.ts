// Font families loaded in app/_layout.tsx (match the AviCalc splash: geometric bold + DIN-style labels).
export const fonts = {
  display: "Montserrat-Bold",
  displayHeavy: "Montserrat-ExtraBold",
  semibold: "Barlow-SemiBold",
  medium: "Barlow-Medium",
};

export const fontAssets = {
  [fonts.display]: require("../assets/fonts/Montserrat-700.ttf"),
  [fonts.displayHeavy]: require("../assets/fonts/Montserrat-800.ttf"),
  [fonts.semibold]: require("../assets/fonts/Barlow-SemiBold.ttf"),
  [fonts.medium]: require("../assets/fonts/Barlow-Medium.ttf"),
};
