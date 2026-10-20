import Feather from "@react-native-vector-icons/feather";
import { useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { Button, Card, Label, Screen } from "@/src/components/ui";
import { select, tap } from "@/src/haptics";
import { makeStyles, useTheme } from "@/src/theme";

type Entry = { id: number; sign: 1 | -1; h: string; m: string };

const toMin = (e: Entry) => e.sign * ((parseInt(e.h, 10) || 0) * 60 + (parseInt(e.m, 10) || 0));

const formatHM = (total: number) => {
  const sign = total < 0 ? "−" : "";
  const abs = Math.abs(total);
  return `${sign}${Math.floor(abs / 60)}:${String(abs % 60).padStart(2, "0")}`;
};

export default function TimeScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const nextId = useRef(3);
  const [entries, setEntries] = useState<Entry[]>([
    { id: 1, sign: 1, h: "", m: "" },
    { id: 2, sign: 1, h: "", m: "" },
  ]);

  const update = (id: number, patch: Partial<Entry>) =>
    setEntries((list) => list.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const add = (sign: 1 | -1) =>
    setEntries((list) => [...list, { id: nextId.current++, sign, h: "", m: "" }]);

  const total = entries.reduce((s, e) => s + toMin(e), 0);

  return (
    <Screen title="Time" subtitle="Add and subtract hours : minutes">
      <Card accent testID="time-total-card">
        <Label>Total</Label>
        <View style={styles.totalRow}>
          <Text style={styles.total} testID="time-total">{formatHM(total)}</Text>
          <Text style={styles.decimal} testID="time-total-decimal">
            {(total / 60).toFixed(2)} h
          </Text>
        </View>
      </Card>

      <Card>
        {entries.map((e, i) => (
          <View key={e.id} style={styles.entry} testID={`time-entry-${i}`}>
            <Pressable
              testID={`time-entry-sign-${i}`}
              onPress={() => {
                select();
                update(e.id, { sign: e.sign === 1 ? -1 : 1 });
              }}
              style={[styles.sign, e.sign === -1 && styles.signMinus]}
            >
              <Feather
                name={e.sign === 1 ? "plus" : "minus"}
                size={20}
                color={e.sign === 1 ? colors.onBrandPrimary : colors.onSurfaceInverse}
              />
            </Pressable>
            <TextInput
              testID={`time-entry-hours-${i}`}
              value={e.h}
              onChangeText={(t) => update(e.id, { h: t.replace(/\D/g, "") })}
              keyboardType="number-pad"
              placeholder="hh"
              placeholderTextColor={colors.muted}
              style={[styles.field, { flex: 1 }]}
              maxLength={5}
            />
            <Text style={styles.colon}>:</Text>
            <TextInput
              testID={`time-entry-minutes-${i}`}
              value={e.m}
              onChangeText={(t) => update(e.id, { m: t.replace(/\D/g, "") })}
              keyboardType="number-pad"
              placeholder="mm"
              placeholderTextColor={colors.muted}
              style={[styles.field, { width: 76 }]}
              maxLength={4}
            />
            <Pressable
              testID={`time-entry-remove-${i}`}
              onPress={() => {
                tap();
                setEntries((list) => list.filter((x) => x.id !== e.id));
              }}
              style={styles.remove}
              accessibilityLabel="Remove entry"
            >
              <Feather name="x" size={20} color={colors.muted} />
            </Pressable>
          </View>
        ))}
        {entries.length === 0 ? (
          <Text style={styles.empty} testID="time-empty">Add your first time entry</Text>
        ) : null}
      </Card>

      <View style={styles.actions}>
        <View style={{ flex: 1 }}>
          <Button label="Add" icon="plus" variant="primary" testID="time-add-button" onPress={() => add(1)} />
        </View>
        <View style={{ flex: 1 }}>
          <Button label="Subtract" icon="minus" testID="time-subtract-button" onPress={() => add(-1)} />
        </View>
      </View>
      <Button
        label="Reset"
        icon="rotate-ccw"
        testID="time-reset-button"
        onPress={() => setEntries([{ id: nextId.current++, sign: 1, h: "", m: "" }])}
      />
    </Screen>
  );
}

const useStyles = makeStyles((c) => ({
  totalRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginTop: -8 },
  total: { fontSize: 48, fontWeight: "700", color: c.onBrandTertiary, fontVariant: ["tabular-nums"], letterSpacing: -1 },
  decimal: { fontSize: 18, fontWeight: "600", color: c.onBrandTertiary, fontVariant: ["tabular-nums"] },
  entry: { flexDirection: "row", alignItems: "center", gap: 8 },
  sign: {
    width: 44,
    height: 48,
    borderRadius: 12,
    backgroundColor: c.brandPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  signMinus: { backgroundColor: c.surfaceInverse },
  field: {
    minWidth: 0,
    height: 48,
    borderRadius: 12,
    backgroundColor: c.surfaceTertiary,
    borderWidth: 1,
    borderColor: c.border,
    paddingHorizontal: 12,
    fontSize: 22,
    fontWeight: "600",
    color: c.onSurface,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  colon: { fontSize: 22, fontWeight: "700", color: c.muted },
  remove: { width: 40, height: 48, alignItems: "center", justifyContent: "center" },
  empty: { fontSize: 15, color: c.muted, textAlign: "center", paddingVertical: 8 },
  actions: { flexDirection: "row", gap: 12 },
}));
