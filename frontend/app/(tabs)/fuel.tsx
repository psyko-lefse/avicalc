import { useState } from "react";
import { Text, View } from "react-native";

import { Button, Card, fmt, Label, NumberField, Screen, parseNum } from "@/src/components/ui";
import { useSettings } from "@/src/settings";
import { makeStyles } from "@/src/theme";

const DENSITY = 0.8; // kg per liter, Jet A1
const LB_TO_KG = 0.45359237;
const L_PER_USG = 3.785411784;

export default function FuelScreen() {
  const styles = useStyles();
  const { weightUnit, volumeUnit } = useSettings();
  const [requested, setRequested] = useState("");
  const [shutdown, setShutdown] = useState("");

  const upliftWeight = parseNum(requested) - parseNum(shutdown);
  const upliftKg = weightUnit === "kg" ? upliftWeight : upliftWeight * LB_TO_KG;
  const liters = upliftKg / DENSITY;
  const volume = volumeUnit === "L" ? liters : liters / L_PER_USG;
  const hasInput = requested !== "";
  const negative = hasInput && upliftWeight < 0;

  return (
    <Screen title="Fuel Uplift" subtitle={`Jet A1 · density ${DENSITY} kg/L`}>
      <Card>
        <NumberField
          label="Requested fuel"
          value={requested}
          onChange={setRequested}
          unit={weightUnit}
          testID="fuel-requested-input"
        />
        <NumberField
          label="Shutdown fuel (on board)"
          value={shutdown}
          onChange={setShutdown}
          unit={weightUnit}
          testID="fuel-shutdown-input"
        />
      </Card>

      <Card accent testID="fuel-result-card">
        <View style={{ gap: 4 }}>
          <Label>Required uplift</Label>
          {negative ? (
            <Text style={styles.warn} testID="fuel-no-uplift">
              No uplift required — shutdown fuel exceeds request by {fmt(-upliftWeight)} {weightUnit}
            </Text>
          ) : (
            <View style={styles.row}>
              <Text style={styles.big} testID="fuel-uplift-volume">
                {hasInput ? fmt(volume) : "—"}
              </Text>
              <Text style={styles.bigUnit}>{volumeUnit === "L" ? "L" : "US gal"}</Text>
            </View>
          )}
        </View>
        {!negative && hasInput ? (
          <View style={styles.meta}>
            <Text style={styles.metaText} testID="fuel-uplift-weight">
              Weight: {fmt(upliftWeight)} {weightUnit}
            </Text>
            <Text style={styles.metaText} testID="fuel-uplift-alt">
              {volumeUnit === "L" ? `${fmt(liters / L_PER_USG)} US gal` : `${fmt(liters)} L`}
            </Text>
          </View>
        ) : null}
      </Card>

      <Button
        label="Clear"
        icon="rotate-ccw"
        testID="fuel-clear-button"
        onPress={() => {
          setRequested("");
          setShutdown("");
        }}
      />
    </Screen>
  );
}

const useStyles = makeStyles((c) => ({
  row: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  big: { fontSize: 48, fontWeight: "700", color: c.onBrandTertiary, fontVariant: ["tabular-nums"], letterSpacing: -1 },
  bigUnit: { fontSize: 20, fontWeight: "600", color: c.onBrandTertiary },
  warn: { fontSize: 16, fontWeight: "600", color: c.onBrandTertiary, marginTop: 4 },
  meta: { flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", gap: 8 },
  metaText: { fontSize: 15, fontWeight: "500", color: c.onBrandTertiary, fontVariant: ["tabular-nums"] },
}));
