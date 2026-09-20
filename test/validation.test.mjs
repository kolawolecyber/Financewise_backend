import { describe, expect, it } from "vitest";
import validation from "../utils/validation.js";

const { parseMonthDayYear, parsePositiveAmount, parsePositiveInt } = validation;

describe("request validation", () => {
  it("accepts positive numeric IDs and rejects unsafe or non-positive values", () => {
    expect(parsePositiveInt("7")).toBe(7);
    expect(parsePositiveInt(0)).toBeNull();
    expect(parsePositiveInt("1.5")).toBeNull();
    expect(parsePositiveInt("invalid")).toBeNull();
  });

  it("only accepts finite positive amounts", () => {
    expect(parsePositiveAmount("125.50")).toBe(125.5);
    expect(parsePositiveAmount(0)).toBeNull();
    expect(parsePositiveAmount("Infinity")).toBeNull();
  });

  it("accepts browser and display date formats", () => {
    expect(parseMonthDayYear("09/20/2026").value).toBeInstanceOf(Date);
    expect(parseMonthDayYear("2026-09-20").value).toBeInstanceOf(Date);
    expect(parseMonthDayYear("09-20-2026").error).toBeDefined();
  });
});
