import Feather from "@react-native-vector-icons/feather";
import { useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { Button, Card, Label, Screen } from "@/src/components/ui";
import { makeStyles, useTheme } from "@/src/theme";

type Entry = { id: number; delta: number; sum: number };

const formatHM = (total: number, signed = false) => {
  const sign = total < 0 ? "−" : signed ? "+" : "";
  const abs = Math.abs(total);
  return `${sign}${Math.floor(abs / 60)}:${String(abs % 60).padStart(2, "0")}`;
};

export default function TimeScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const hoursRef = useRef<TextInput>(null);
  const nextId = useRef(1);
  const [h, setH] = useState("");
  const [m, setM] = useState("");
  const [history, setHistory] = useState<Entry[]>([]);

  const total = history.length ? history[0].sum : 0;

  const apply = (sign: 1 | -1) => {
    if (h === "" && m === "") return;
    const delta = sign * ((parseInt(h, 10) || 0) * 60 + (parseInt(m, 10) || 0));
    setHistory((list) => [{ id: nextId.current++, delta, sum: total + delta }, ...list]);
    setH("");
    setM("");
    hoursRef.current?.focus();
  };

  return (
    <Screen title="Time" subtitle="Add and subtract hours : minutes">
      <Card accent testID="time-total-card">
        <Label>Sum</Label>
        <View style={styles.totalRow}>
          <Text style={styles.total} testID="time-total">{formatHM(total)}</Text>
          <Text style={styles.decimal} testID="time-total-decimal">{(total / 60).toFixed(2)} h</Text>
        </View>
      </Card>

      <Card>
        <View style={styles.inputRow}>
          <View style={styles.fieldWrap}>
            <Label>Hours</Label>
            <TextInput
              ref={hoursRef}
              testID="time-hours-input"
              value={h}
              onChangeText={(t) => setH(t.replace(/\D/g, ""))}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.muted}
              style={styles.field}
              maxLength={5}
            />
          </View>
          <Text style={styles.colon}>:</Text>
          <View style={styles.fieldWrap}>
            <Label>Minutes</Label>
            <TextInput
              testID="time-minutes-input"
              value={m}
              onChangeText={(t) => setM(t.replace(/\D/g, ""))}
              keyboardType="number-pad"
              placeholder="00"
              placeholderTextColor={colors.muted}
              style={styles.field}
              maxLength={4}
            />
          </View>
        </View>
        <View style={styles.actions}>
          <View style={{ flex: 1 }}>
            <Button label="Add" icon="plus" variant="primary" testID="time-add-button" onPress={() => apply(1)} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Subtract" icon="minus" testID="time-subtract-button" onPress={() => apply(-1)} />
          </View>
        </View>
        <Button
          label="Reset"
          icon="rotate-ccw"
          testID="time-reset-button"
          onPress={() => {
            setHistory([]);
            setH("");
            setM("");
          }}
        />
      </Card>

      <Card testID="time-history">
        <Label>History</Label>
        {history.length === 0 ? (
          <Text style={styles.empty} testID="time-history-empty">No entries yet</Text>
        ) : (
          history.map((e, i) => (
            <View key={e.id} style={[styles.histRow, i > 0 && styles.histDivider]} testID={`time-history-row-${i}`}>
              <Feather
                name={e.delta < 0 ? "minus-circle" : "plus-circle"}
                size={16}
                color={e.delta < 0 ? colors.muted : colors.brandPrimary}
              />
              <Text style={styles.histDelta}>{formatHM(e.delta, true)}</Text>
              <Text style={styles.histSum}>= {formatHM(e.sum)}</Text>
            </View>
          ))
        )}
      </Card>
    </Screen>
  );
}

const useStyles = makeStyles((c) => ({
  totalRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginTop: -8 },
  total: { fontSize: 48, fontWeight: "700", color: c.onBrandTertiary, fontVariant: ["tabular-nums"], letterSpacing: -1 },
  decimal: { fontSize: 18, fontWeight: "600", color: c.onBrandTertiary, fontVariant: ["tabular-nums"] },
  inputRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  fieldWrap: { flex: 1, gap: 6 },
  field: {
    minWidth: 0,
    height: 64,
    borderRadius: 12,
    backgroundColor: c.surfaceTertiary,
    borderWidth: 1,
    borderColor: c.border,
    paddingHorizontal: 12,
    fontSize: 28,
    fontWeight: "600",
    color: c.onSurface,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  colon: { fontSize: 28, fontWeight: "700", color: c.muted, paddingBottom: 14 },
  actions: { flexDirection: "row", gap: 12 },
  empty: { fontSize: 15, color: c.muted, marginTop: -8 },
  histRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 2 },
  histDivider: { borderTopWidth: 1, borderTopColor: c.divider, paddingTop: 10 },
  histDelta: { flex: 1, fontSize: 16, fontWeight: "600", color: c.onSurfaceSecondary, fontVariant: ["tabular-nums"] },
  histSum: { fontSize: 16, fontWeight: "600", color: c.muted, fontVariant: ["tabular-nums"] },
}));
