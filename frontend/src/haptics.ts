import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export function tap() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function select() {
  if (Platform.OS !== "web") Haptics.selectionAsync();
}
