import { describe, expect, it } from "vitest";

import config from "./main";

describe("storybook vite config", () => {
  it("keeps the static CSS pipeline on the PostCSS/esbuild path", async () => {
    const resolved = await config.viteFinal?.({
      css: {
        transformer: "lightningcss",
      },
      build: {
        cssMinify: "lightningcss",
      },
    });

    expect(resolved?.css?.transformer).toBe("postcss");
    expect(resolved?.build?.cssMinify).toBe("esbuild");
    expect(resolved?.build?.target).toBe("es2022");
    expect(resolved?.build?.cssTarget).toEqual([
      "chrome123",
      "edge123",
      "firefox128",
      "safari17.5",
    ]);
  });
});
