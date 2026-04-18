import { describe, it, expect } from "vitest";
import { findPath } from "../utils/stadium-data";

describe("Routing System", () => {
  it("should return a path", () => {
    const path = findPath("A", "B");
    expect(path).toBeDefined();
  });
});
