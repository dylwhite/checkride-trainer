// The owner's personal minimums (set by the owner, not FAA rules).
// Used by Flight Story go/no-go decisions and shown in Settings and the Study Guide.
export const MINIMUMS = {
  ceiling: 3000, // ft
  visibility: 5, // SM
  vfrOnly: true,
  crosswind: 12, // kt, the C152 maximum demonstrated crosswind (POH 4-3, 5-11)
  sleepHours: 7,
  foodHours: 8 // ate within the last N hours
};

export function minimumsText() {
  const m = MINIMUMS;
  return `${m.ceiling.toLocaleString()} ft ceiling, ${m.visibility} SM visibility, ${m.crosswind} kt crosswind, VFR only, ${m.sleepHours} h sleep, food within ${m.foodHours} h`;
}
