import { describe, expect, it, vi } from "vitest";
import { ApiError, toQueryString } from "./api";
import { CONDITIONS, SPECIALIZATIONS } from "./constants";
import { applyServerErrors } from "./formErrors";
import { formatDate, initials } from "./format";
import { CONDITION_ICONS, SPECIALIZATION_ICONS } from "./medicalIcons";
import { getPageItems } from "./pagination";
import { safeRedirect } from "./redirect";
import { percentChange } from "./stats";

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

describe("getPageItems", () => {
  it("lists every page when there are few", () => {
    expect(getPageItems(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("collapses distant pages into ellipses", () => {
    expect(getPageItems(10, 20)).toEqual([1, "ellipsis", 9, 10, 11, "ellipsis", 20]);
  });

  it("keeps the first pages visible near the start and the last near the end", () => {
    expect(getPageItems(1, 45)).toEqual([1, 2, 3, 4, "ellipsis", 45]);
    expect(getPageItems(45, 45)).toEqual([1, "ellipsis", 42, 43, 44, 45]);
  });
});

describe("percentChange", () => {
  it("uses one decimal below 10% and whole numbers above", () => {
    expect(percentChange(121, 114)).toEqual({ text: "6.1% vs last month", direction: "up" });
    expect(percentChange(450, 329)).toEqual({ text: "37% vs last month", direction: "up" });
  });

  it("marks decreases with a minus sign", () => {
    expect(percentChange(90, 100)).toEqual({ text: "−10% vs last month", direction: "down" });
  });

  it("handles a zero baseline and no change", () => {
    expect(percentChange(5, 0).direction).toBe("flat");
    expect(percentChange(10, 10)).toEqual({ text: "0.0% vs last month", direction: "flat" });
  });
});

describe("safeRedirect", () => {
  it("allows same-site paths", () => {
    expect(safeRedirect("/patients?condition=Fever")).toBe("/patients?condition=Fever");
    expect(safeRedirect(["/doctors", "/x"])).toBe("/doctors");
  });

  it("blocks external and protocol-relative targets", () => {
    for (const bad of ["https://evil.com", "//evil.com", "/\\evil.com", "javascript:alert(1)", "", undefined]) {
      expect(safeRedirect(bad)).toBe("/dashboard");
    }
  });
});

describe("toQueryString", () => {
  it("drops empty values and encodes the rest", () => {
    expect(toQueryString({ page: 2, search: "sarah ahmed", condition: "", doctor: undefined })).toBe(
      "?page=2&search=sarah+ahmed",
    );
    expect(toQueryString({})).toBe("");
  });
});

describe("format helpers", () => {
  it("builds initials without titles or numbers", () => {
    expect(initials("Dr. Sarah Ahmed")).toBe("SA");
    expect(initials("Fatema Tuz Zohra")).toBe("FZ");
    expect(initials("Dr. Zara Testwell 109726")).toBe("ZT");
    expect(initials("Admin")).toBe("A");
  });

  it("formats dates for display", () => {
    expect(formatDate("2026-10-30T10:00:00.000Z")).toBe("30 Oct 2026");
  });
});

describe("icon maps", () => {
  it("cover every condition and specialization", () => {
    for (const c of CONDITIONS) expect(CONDITION_ICONS[c]).toBeDefined();
    for (const s of SPECIALIZATIONS) expect(SPECIALIZATION_ICONS[s]).toBeDefined();
  });
});

describe("applyServerErrors", () => {
  it("puts field errors under their inputs", () => {
    const setError = vi.fn();
    const error = new ApiError("Validation failed", 400, [{ field: "email", message: "Invalid email" }]);
    applyServerErrors(error, setError, ["name", "email"]);
    expect(setError).toHaveBeenCalledWith("email", { type: "server", message: "Invalid email" }, { shouldFocus: true });
  });

  it("maps a duplicate (409) onto the matching field", () => {
    const setError = vi.fn();
    applyServerErrors(new ApiError("email already exists", 409), setError, ["name", "email"]);
    expect(setError).toHaveBeenCalledWith(
      "email",
      { type: "server", message: "This email is already in use" },
      { shouldFocus: true },
    );
  });
});
