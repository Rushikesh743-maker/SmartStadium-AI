import { Zone } from "./stadium-data";

// Store last N crowd readings per zone for trend calculation
const history: Map<string, number[]> = new Map();
const MAX_HISTORY = 10;

export function recordCrowdSnapshot(zones: Zone[]) {
  zones.forEach(z => {
    const arr = history.get(z.id) || [];
    arr.push(z.crowd);
    if (arr.length > MAX_HISTORY) arr.shift();
    history.set(z.id, arr);
  });
}

export function predictCrowd(zones: Zone[]): Zone[] {
  return zones.map(z => {
    const arr = history.get(z.id);
    if (!arr || arr.length < 3) return { ...z };
    // Simple linear trend: average of last 3 deltas
    const deltas: number[] = [];
    for (let i = arr.length - 3; i < arr.length - 1; i++) {
      deltas.push(arr[i + 1] - arr[i]);
    }
    const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    // Project 2 ticks into the future (~14s)
    const predicted = Math.max(0, Math.min(100, z.crowd + avgDelta * 2));
    return { ...z, crowd: Math.round(predicted) };
  });
}
