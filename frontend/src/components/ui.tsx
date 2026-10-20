import Feather from "@react-native-vector-icons/feather";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ReactNode } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tap, select } from "@/src/haptics";
import { usesNativeTabs } from "@/src/navigation";
import { makeStyles, useTheme } from "@/src/theme";
import { fonts } from "@/src/fonts";

export const parseNum = (s: string) => {
  const n = parseFloat(s.replace(",", "."));
  return isNaN(n) ? 0 : n;
};

export const fmt = (n: number, d = 0) =>
  n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

export function Screen({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const bottomChrome = usesNativeTabs ? insets.bottom : 0;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Image source={require("../../assets/images/icon.png")} style={styles.logo} testID="header-logo" />
        <View style={{ flex: 1 }}>
          <Text style={styles.title} testID="screen-title">{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <Pressable
          testID="open-settings-button"
          accessibilityLabel="Settings"
          onPress={() => {
            tap();
            router.push("/settings");
          }}
          style={({ pressed }) => [styles.gear, pressed && { opacity: 0.6 }]}
        >
          <Feather name="settings" size={22} color={colors.onSurface} />
        </Pressable>
      </View>
      <KeyboardAwareScrollView
        bottomOffset={24}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: bottomChrome + 24 }]}
      >
        {children}
      </KeyboardAwareScrollView>
    </View>
  );
}

export function Card({ children, accent, testID }: { children: ReactNode; accent?: boolean; testID?: string }) {
  const styles = useStyles();
  return <View testID={testID} style={[styles.card, accent && styles.cardAccent]}>{children}</View>;
}

export function Label({ children }: { children: ReactNode }) {
  const styles = useStyles();
  return <Text style={styles.label}>{children}</Text>;
}

export function NumberField({
  label,
  value,
  onChange,
  unit,
  testID,
  placeholder = "0",
}: {
  label?: string;
  value: string;
  onChange: (s: string) => void;
  unit?: string;
  testID: string;
  placeholder?: string;
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      {label ? <Label>{label}</Label> : null}
      <View style={styles.inputWrap}>
        <TextInput
          testID={testID}
          value={value}
          onChangeText={(t) => onChange(t.replace(/[^0-9.,]/g, ""))}
          keyboardType="decimal-pad"
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          style={styles.input}
          returnKeyType="done"
        />
        {unit ? <Text style={styles.inputUnit}>{unit}</Text> : null}
      </View>
    </View>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  testID,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  testID: string;
}) {
  const styles = useStyles();
  return (
    <View style={styles.seg} testID={testID}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            testID={`${testID}-${o.value}`}
            onPress={() => {
              select();
              onChange(o.value);
            }}
            style={[styles.segItem, active && styles.segItemActive]}
          >
            <Text style={[styles.segText, active && styles.segTextActive]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Button({
  label,
  icon,
  onPress,
  testID,
  variant = "secondary",
}: {
  label: string;
  icon?: string;
  onPress: () => void;
  testID: string;
  variant?: "primary" | "secondary";
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  const primary = variant === "primary";
  return (
    <Pressable
      testID={testID}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [styles.btn, primary && styles.btnPrimary, pressed && { opacity: 0.7 }]}
    >
      {icon ? (
        <Feather name={icon as any} size={18} color={primary ? colors.onBrandPrimary : colors.onSurfaceTertiary} />
      ) : null}
      <Text style={[styles.btnText, primary && styles.btnTextPrimary]}>{label}</Text>
    </Pressable>
  );
}

const useStyles = makeStyles((c) => ({
  root: { flex: 1, backgroundColor: c.surface },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: c.surface,
    borderBottomWidth: 1,
    borderBottomColor: c.divider,
  },
  logo: { width: 40, height: 40, borderRadius: 10, marginRight: 12 },
  title: { fontSize: 24, fontFamily: fonts.display, color: c.onSurface, letterSpacing: -0.3 },
  subtitle: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: c.muted,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  gear: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: c.surfaceTertiary,
  },
  content: { padding: 16, gap: 16 },
  card: {
    backgroundColor: c.surfaceSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
    padding: 16,
    gap: 16,
  },
  cardAccent: { backgroundColor: c.brandTertiary, borderColor: c.brandTertiary },
  label: { fontSize: 13, fontFamily: fonts.semibold, color: c.muted, textTransform: "uppercase", letterSpacing: 1.4 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: c.surfaceTertiary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 24,
    fontFamily: fonts.semibold,
    color: c.onSurface,
    paddingVertical: 12,
    fontVariant: ["tabular-nums"],
  },
  inputUnit: { fontSize: 16, fontFamily: fonts.semibold, color: c.muted, marginLeft: 8 },
  seg: {
    flexDirection: "row",
    backgroundColor: c.surfaceTertiary,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  segItem: { flex: 1, minHeight: 44, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  segItemActive: { backgroundColor: c.brandPrimary },
  segText: { fontSize: 15, fontFamily: fonts.semibold, color: c.onSurfaceTertiary },
  segTextActive: { color: c.onBrandPrimary },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: c.surfaceTertiary,
  },
  btnPrimary: { backgroundColor: c.brandPrimary },
  btnText: { fontSize: 15, fontFamily: fonts.semibold, color: c.onSurfaceTertiary },
  btnTextPrimary: { color: c.onBrandPrimary },
}));
