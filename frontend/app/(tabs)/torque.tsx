import { useState } from "react";
import { Text, View } from "react-native";

import { Button, Card, fmt, Label, NumberField, Screen, Segmented, parseNum } from "@/src/components/ui";
import { makeStyles } from "@/src/theme";
import { fonts } from "@/src/fonts";

type Unit = "nm" | "inlb" | "ftlb";
// Value of 1 unit expressed in Nm
const TO_NM: Record<Unit, number> = { nm: 1, inlb: 0.112984829, ftlb: 1.3558179483 };
const LABEL: Record<Unit, string> = { nm: "Nm", inlb: "in.lbs", ftlb: "ft.lbs" };
const UNITS: Unit[] = ["nm", "inlb", "ftlb"];

export default function TorqueScreen() {
  const styles = useStyles();
  const [from, setFrom] = useState<Unit>("nm");
  const [value, setValue] = useState("");

  const nm = parseNum(value) * TO_NM[from];

  return (
    <Screen title="Torque" subtitle="Nm · in.lbs · ft.lbs">
      <Card>
        <View style={{ gap: 6 }}>
          <Label>Convert from</Label>
          <Segmented
            testID="torque-from-unit"
            value={from}
            onChange={setFrom}
            options={UNITS.map((u) => ({ value: u, label: LABEL[u] }))}
          />
        </View>
        <NumberField label="Value" value={value} onChange={setValue} unit={LABEL[from]} testID="torque-input" />
      </Card>

      <Card accent testID="torque-result-card">
        {UNITS.filter((u) => u !== from).map((u, i) => (
          <View key={u} style={[styles.row, i > 0 && styles.rowDivider]}>
            <Text style={styles.big} testID={`torque-result-${u}`}>
              {value ? fmt(nm / TO_NM[u], 2) : "—"}
            </Text>
            <Text style={styles.unit}>{LABEL[u]}</Text>
          </View>
        ))}
      </Card>

      <Button label="Clear" icon="rotate-ccw" testID="torque-clear-button" onPress={() => setValue("")} />
    </Screen>
  );
}

const useStyles = makeStyles((c) => ({
  row: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: 8 },
  rowDivider: { borderTopWidth: 1, borderTopColor: c.onBrandTertiary + "33", paddingTop: 16 },
  big: { fontSize: 40, fontFamily: fonts.display, color: c.onBrandTertiary, fontVariant: ["tabular-nums"], flexShrink: 1 },
  unit: { fontSize: 18, fontFamily: fonts.semibold, color: c.onBrandTertiary },
}));
