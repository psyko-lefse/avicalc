import Feather from "@react-native-vector-icons/feather";
import {
  addDays,
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { Button } from "@/src/components/ui";
import { select, tap } from "@/src/haptics";
import { makeStyles, useTheme } from "@/src/theme";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function CalendarModal({
  visible,
  value,
  onSelect,
  onClose,
}: {
  visible: boolean;
  value: Date;
  onSelect: (d: Date) => void;
  onClose: () => void;
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  const [month, setMonth] = useState(() => startOfMonth(value));

  const gridStart = startOfWeek(month, { weekStartsOn: 1 });
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const today = new Date();

  const pick = (d: Date) => {
    select();
    onSelect(startOfDay(d));
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} testID="calendar-backdrop">
        <Pressable style={styles.sheet} onPress={() => {}} testID="calendar-modal">
          <View style={styles.head}>
            <Pressable
              testID="calendar-prev-month"
              onPress={() => {
                tap();
                setMonth(addMonths(month, -1));
              }}
              style={styles.nav}
              accessibilityLabel="Previous month"
            >
              <Feather name="chevron-left" size={22} color={colors.onSurfaceTertiary} />
            </Pressable>
            <Text style={styles.month} testID="calendar-month-label">{format(month, "MMMM yyyy")}</Text>
            <Pressable
              testID="calendar-next-month"
              onPress={() => {
                tap();
                setMonth(addMonths(month, 1));
              }}
              style={styles.nav}
              accessibilityLabel="Next month"
            >
              <Feather name="chevron-right" size={22} color={colors.onSurfaceTertiary} />
            </Pressable>
          </View>
          <View style={styles.grid}>
            {WEEKDAYS.map((w) => (
              <Text key={w} style={styles.weekday}>{w}</Text>
            ))}
            {days.map((d) => {
              const selected = isSameDay(d, value);
              const isToday = isSameDay(d, today);
              const inMonth = isSameMonth(d, month);
              return (
                <Pressable
                  key={d.toISOString()}
                  testID={`calendar-day-${format(d, "yyyy-MM-dd")}`}
                  onPress={() => pick(d)}
                  style={styles.cell}
                >
                  <View style={[styles.day, isToday && styles.today, selected && styles.selected]}>
                    <Text
                      style={[styles.dayText, !inMonth && styles.outText, selected && styles.selectedText]}
                    >
                      {format(d, "d")}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.footer}>
            <View style={{ flex: 1 }}>
              <Button label="Cancel" testID="calendar-cancel-button" onPress={onClose} />
            </View>
            <View style={{ flex: 1 }}>
              <Button label="Today" variant="primary" testID="calendar-today-button" onPress={() => pick(today)} />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const useStyles = makeStyles((c) => ({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", padding: 16 },
  sheet: {
    backgroundColor: c.surfaceSecondary,
    borderRadius: 20,
    padding: 16,
    gap: 12,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  nav: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: c.surfaceTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  month: { fontSize: 18, fontWeight: "700", color: c.onSurfaceSecondary },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  weekday: {
    width: `${100 / 7}%`,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: c.muted,
    paddingVertical: 6,
  },
  cell: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: "center", justifyContent: "center" },
  day: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  today: { borderWidth: 1.5, borderColor: c.brandPrimary },
  selected: { backgroundColor: c.brandPrimary, borderColor: c.brandPrimary },
  dayText: { fontSize: 16, fontWeight: "500", color: c.onSurfaceSecondary, fontVariant: ["tabular-nums"] },
  outText: { color: c.muted, opacity: 0.5 },
  selectedText: { color: c.onBrandPrimary, fontWeight: "700" },
  footer: { flexDirection: "row", gap: 12 },
}));
