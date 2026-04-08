import { Zone } from "./stadium-data";

export interface SimUser {
  id: number;
  x: number;
  y: number;
  targetZoneId: string;
  speed: number;
}

export function createSimUsers(zones: Zone[], count: number): SimUser[] {
  const navigable = zones.filter(z => z.id !== "field");
  const users: SimUser[] = [];
  for (let i = 0; i < count; i++) {
    const zone = navigable[Math.floor(Math.random() * navigable.length)];
    users.push({
      id: i,
      x: zone.x + Math.random() * zone.width,
      y: zone.y + Math.random() * zone.height,
      targetZoneId: navigable[Math.floor(Math.random() * navigable.length)].id,
      speed: 1 + Math.random() * 2,
    });
  }
  return users;
}

export function moveUsers(users: SimUser[], zones: Zone[]): SimUser[] {
  const zoneMap = new Map(zones.map(z => [z.id, z]));
  const navigable = zones.filter(z => z.id !== "field");

  return users.map(u => {
    const target = zoneMap.get(u.targetZoneId);
    if (!target) return u;
    const cx = target.x + target.width / 2;
    const cy = target.y + target.height / 2;
    const dx = cx - u.x;
    const dy = cy - u.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 10) {
      // Pick new random target
      const newTarget = navigable[Math.floor(Math.random() * navigable.length)];
      return { ...u, targetZoneId: newTarget.id };
    }

    const step = Math.min(u.speed, dist);
    return {
      ...u,
      x: u.x + (dx / dist) * step,
      y: u.y + (dy / dist) * step,
    };
  });
}

export function computeUserDensity(users: SimUser[], zones: Zone[]): Map<string, number> {
  const counts = new Map<string, number>();
  zones.forEach(z => counts.set(z.id, 0));

  users.forEach(u => {
    for (const z of zones) {
      if (u.x >= z.x && u.x <= z.x + z.width && u.y >= z.y && u.y <= z.y + z.height) {
        counts.set(z.id, (counts.get(z.id) || 0) + 1);
        break;
      }
    }
  });

  return counts;
}
