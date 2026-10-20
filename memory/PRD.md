# AeroCalc — PRD

## Original problem statement
Aviation calculator for work with 4 functions: 1) Jet A1 fuel uplift (density 0.8 kg/L) — required uplift volume from requested fuel and shutdown fuel weight; volume L/gal, weight kg/lb, selectable in a separate settings menu. 2) Torque conversion Nm, in.lbs, ft.lbs. 3) Time calculator adding hours and minutes. 4) MEL date calculator (Cat B +3, C +10, D +120, excluding discovery date; discovery defaults to today, customizable) plus configurable +days field. Lightweight, easy to read/navigate.

## User choices
Density fixed 0.8 kg/L · US gallons · Time add & subtract with multiple entries · Light + Dark follow device · Local/offline settings.

## Architecture
Expo Router frontend only (no backend). Tabs: Fuel, Torque, Time, MEL (NativeTabs on iOS 26+, JS Tabs elsewhere). Settings modal via header gear; units persisted with `@/src/utils/storage`. Theme in src/theme.ts (orange/graphite).

## Implemented (2026-06)
- Fuel uplift (weight + volume, alt unit, no-uplift warning, clear)
- Torque converter (any from-unit, live results)
- Time ledger (+/- entries, total HH:MM + decimal, reset)
- MEL due dates (B/C/D + custom, date input DD.MM.YYYY, prev/next/today)
- Settings (kg/lb, L/US gal), haptics, light/dark
- E2E tested: all passing (iteration_1)

## Update 2 (2026-06)
- Fuel: result shows only once both fields filled; single volume unit per settings
- Time: single hours/minutes input with Add/Subtract, sum, reset and running history
- MEL: tapping date opens custom calendar picker (works in Expo Go/web)
- E2E tested: all passing (iteration_2)

## Update 3 (2026-06)
- Rebranded to AviCalc: user logo as app icon/adaptive icon/native splash (navy #01244D), full splash artwork as in-app intro
- Restyled theme navy/cyan (light + dark), fonts Montserrat Bold (display) + Barlow (labels), logo in header
- E2E tested: all passing (iteration_3)

## Update 4 (2026-06)
- Settings: removed info text; added Appearance toggle (System/Light/Dark), persisted locally, works on web + native

## Update 5 (2026-06)
- Time: decimal sum centered below HH:MM; Undo (left) removes last entry, Reset (right)

## Update 6 (2026-06)
- Removed header subtitles on all tabs; added "Jet A1 · density 0.8 kg/L" note at bottom of Fuel screen

## Update 7 (2026-06)
- Number inputs accept only one decimal separator ("." or ","), pasted comma decimals work
- Torque display rounding (half up): in.lbs whole number, Nm and ft.lbs 1 decimal

## Update 8 (2026-06)
- Play Store assets in /app/frontend/assets/store-screenshots: 12 phone screenshots 1080x1920 (dark + light: splash, fuel, torque, time, MEL, calendar) + feature graphic 1024x500
- Font fix: MEL weekday line and Time empty-history text now use Barlow

## Update 9 (2026-06)
- App identifiers changed to com.butterhill.avicalc (android.package + ios.bundleIdentifier)

## Backlog
- P1: Copy/share result, calculation history
- P2: Custom fonts (Space Grotesk), extra unit conversions (temperature, pressure)
