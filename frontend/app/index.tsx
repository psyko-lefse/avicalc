import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

// Branded intro: shows the AviCalc splash artwork briefly, then opens the calculators.
export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.replace("/fuel"), 1600);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View style={styles.root} testID="intro-splash">
      <Animated.View entering={FadeIn.duration(400)} style={StyleSheet.absoluteFill}>
        <Image
          source={require("../assets/images/avicalc-splash.png")}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
      </Animated.View>
    </View>
  );
}

// Splash artwork navy; fixed so the intro matches the artwork in both themes.
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#01244D" },
});
