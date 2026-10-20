import Feather from "@react-native-vector-icons/feather";
import { addDays, format, isValid, parse, startOfDay } from "date-fns";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { Button, Card, Label, NumberField, Screen } from "@/src/components/ui";
import { tap } from "@/src/haptics";
import { makeStyles, useTheme } from "@/src/theme";

const CATS = [
  { cat: "B", days: 3 },
  { cat: "C", days: 10 },
  { cat: "D", days: 120 },
];
const INPUT_FMT = "dd.MM.yyyy";

export default function MelScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const [date, setDate] = useState(() => startOfDay(new Date()));
  const [text, setText] = useState(() => format(new Date(), INPUT_FMT));
  const [custom, setCustom] = useState("");

  const setBoth = (d: Date) => {
    setDate(d);
    setText(format(d, INPUT_FMT));
  };

  const onText = (t: string) => {
    setText(t);
    const d = parse(t, INPUT_FMT, new Date());
    if (isValid(d) && t.length === 10) setDate(startOfDay(d));
  };

  const parsed = parse(text, INPUT_FMT, new Date());
  const invalid = !(isValid(parsed) && text.length === 10);
  const customDays = parseInt(custom, 10);

  const shift = (n: number) => {
    tap();
    setBoth(addDays(date, n));
  };

  return (
    <Screen title="MEL Due Date" subtitle="Discovery day excluded">
      <Card>
        <Label>Date of discovery</Label>
        <View style={styles.dateRow}>
          <Pressable testID="mel-date-prev" onPress={() => shift(-1)} style={styles.step} accessibilityLabel="Previous day">
            <Feather name="chevron-left" size={24} color={colors.onSurfaceTertiary} />
          </Pressable>
          <TextInput
            testID="mel-date-input"
            value={text}
            onChangeText={onText}
            placeholder="DD.MM.YYYY"
            placeholderTextColor={colors.muted}
            keyboardType="numbers-and-punctuation"
            maxLength={10}
            style={[styles.dateInput, invalid && { borderColor: colors.error }]}
          />
          <Pressable testID="mel-date-next" onPress={() => shift(1)} style={styles.step} accessibilityLabel="Next day">
            <Feather name="chevron-right" size={24} color={colors.onSurfaceTertiary} />
          </Pressable>
        </View>
        {invalid ? (
          <Text style={styles.error} testID="mel-date-error">Enter date as DD.MM.YYYY</Text>
        ) : (
          <Text style={styles.weekday} testID="mel-date-weekday">{format(date, "EEEE, d MMMM yyyy")}</Text>
        )}
        <Button label="Today" icon="calendar" testID="mel-today-button" onPress={() => setBoth(startOfDay(new Date()))} />
      </Card>

      {CATS.map(({ cat, days }) => (
        <ResultRow key={cat} title={`Cat ${cat}`} days={days} due={addDays(date, days)} testID={`mel-result-${cat.toLowerCase()}`} />
      ))}

      <Card>
        <NumberField label="Custom +days" value={custom} onChange={(t) => setCustom(t.replace(/\D/g, ""))} unit="days" testID="mel-custom-input" />
        <View style={styles.customOut}>
          <Text style={styles.customLabel}>Expires end of</Text>
          <Text style={styles.customDate} testID="mel-result-custom">
            {customDays > 0 ? format(addDays(date, customDays), "EEE dd MMM yyyy") : "—"}
          </Text>
        </View>
      </Card>
    </Screen>
  );
}

function ResultRow({ title, days, due, testID }: { title: string; days: number; due: Date; testID: string }) {
  const styles = useStyles();
  return (
    <View style={styles.result} testID={testID}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{title}</Text>
        <Text style={styles.badgeDays}>+{days} days</Text>
      </View>
      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <Text style={styles.resultLabel}>Expires end of</Text>
        <Text style={styles.resultDate} testID={`${testID}-date`}>{format(due, "EEE dd MMM yyyy")}</Text>
      </View>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  dateRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: -8 },
  step: {
    width: 48,
    height: 56,
    borderRadius: 12,
    backgroundColor: c.surfaceTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  dateInput: {
    flex: 1,
    minWidth: 0,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.surfaceTertiary,
    fontSize: 22,
    fontWeight: "600",
    color: c.onSurface,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  weekday: { fontSize: 15, color: c.muted, textAlign: "center", marginTop: -8 },
  error: { fontSize: 14, color: c.error, textAlign: "center", marginTop: -8 },
  result: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: c.brandTertiary,
    borderRadius: 12,
    padding: 16,
  },
  badge: { gap: 2 },
  badgeText: { fontSize: 20, fontWeight: "700", color: c.onBrandTertiary },
  badgeDays: { fontSize: 13, fontWeight: "600", color: c.onBrandTertiary, opacity: 0.8 },
  resultLabel: { fontSize: 12, fontWeight: "600", color: c.onBrandTertiary, opacity: 0.8, textTransform: "uppercase" },
  resultDate: { fontSize: 22, fontWeight: "700", color: c.onBrandTertiary, fontVariant: ["tabular-nums"] },
  customOut: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: 8 },
  customLabel: { fontSize: 13, fontWeight: "600", color: c.muted, textTransform: "uppercase" },
  customDate: { fontSize: 22, fontWeight: "700", color: c.brandPrimary, fontVariant: ["tabular-nums"] },
}));
