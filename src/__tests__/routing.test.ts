import { describe, it, expect } from "vitest";
import { findPath } from "../lib/stadium-data";

describe("Routing System", () => {
  it("should return a path", () => {
    const mockZones = [
      { id: "A", connections: ["B"] },
      { id: "B", connections: ["A"] }
    ];

    const path = findPath(mockZones, "A", "B", false);
    expect(path).toBeDefined();
  });
});
