import { describe, it, expect } from "vitest";
import { findPath } from "@/utils/stadium-data";

describe("Routing", () => {
  it("should avoid blocked zones", () => {
    const path = findPath("A", "D", {
      blocked: ["B"],
    });

    expect(path.includes("B")).toBe(false);
  });
});
