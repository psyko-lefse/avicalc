import Feather from "@react-native-vector-icons/feather";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Label, Segmented } from "@/src/components/ui";
import { useSettings } from "@/src/settings";
import { makeStyles, useTheme } from "@/src/theme";
import { fonts } from "@/src/fonts";

export default function SettingsScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { weightUnit, volumeUnit, setWeightUnit, setVolumeUnit } = useSettings();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>Settings</Text>
        <Pressable
          testID="settings-close-button"
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/fuel"))}
          style={styles.close}
          accessibilityLabel="Close settings"
        >
          <Feather name="x" size={22} color={colors.onSurface} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.group}>
          <Label>Weight unit</Label>
          <Segmented
            testID="settings-weight-unit"
            value={weightUnit}
            onChange={setWeightUnit}
            options={[
              { value: "kg", label: "Kilograms (kg)" },
              { value: "lb", label: "Pounds (lb)" },
            ]}
          />
        </View>
        <View style={styles.group}>
          <Label>Volume unit</Label>
          <Segmented
            testID="settings-volume-unit"
            value={volumeUnit}
            onChange={setVolumeUnit}
            options={[
              { value: "L", label: "Liters (L)" },
              { value: "USG", label: "US gallons" },
            ]}
          />
        </View>
        <View style={styles.info}>
          <Feather name="info" size={16} color={colors.muted} />
          <Text style={styles.infoText}>
            AviCalc · Maintenance calculations. Fuel uplift uses Jet A1 density 0.8 kg/L. 1 US gal = 3.785 L, 1 lb = 0.4536 kg. Settings are saved on this device.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  root: { flex: 1, backgroundColor: c.surface },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: c.divider,
  },
  title: { fontSize: 28, fontFamily: fonts.display, color: c.onSurface },
  close: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: c.surfaceTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { padding: 16, gap: 24 },
  group: {
    gap: 12,
    backgroundColor: c.surfaceSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
    padding: 16,
  },
  info: { flexDirection: "row", gap: 8, paddingHorizontal: 4 },
  infoText: { flex: 1, fontSize: 13, color: c.muted, lineHeight: 18 },
}));
