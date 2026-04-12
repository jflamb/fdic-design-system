import { afterEach, describe, expect, it, vi } from "vitest";
import {
  resetDesignSystemRuntimeWarningForTests,
  warnIfDesignSystemRuntimeMissing,
} from "../runtime.js";

describe("component runtime warning", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    resetDesignSystemRuntimeWarningForTests();
  });

  it("warns once when the token runtime stylesheet has not been loaded", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    warnIfDesignSystemRuntimeMissing();
    warnIfDesignSystemRuntimeMissing();

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0]?.[0]).toContain("@jflamb/fdic-ds-components/styles.css");
  });

  it("stays silent when the required runtime tokens are present", () => {
    document.documentElement.style.setProperty("--ds-color-text-primary", "black");
    document.documentElement.style.setProperty("--ds-spacing-md", "1rem");
    document.documentElement.style.setProperty("--fdic-font-size-body", "1rem");

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    warnIfDesignSystemRuntimeMissing();

    expect(warnSpy).not.toHaveBeenCalled();
  });
});
