import { describe, it, expect } from "vitest";
import { generateAlerts } from "@/utils/stadium-data";

describe("Alerts", () => {
  it("should trigger alert for high crowd", () => {
    expect(generateAlerts(95).length).toBeGreaterThan(0);
  });
});
