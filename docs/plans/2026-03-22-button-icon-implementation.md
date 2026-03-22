# Button & Icon Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement `<fd-icon>` and `<fd-button>` Web Components, with tests, Storybook stories, docs pages, and a GitHub Discussion.

**Architecture:** Two Lit-based Web Components in `packages/components`. `<fd-icon>` owns an icon registry and renders inline SVG in Shadow DOM. `<fd-button>` renders a native `<button>` or `<a>` with variant styling and icon slots. They compose via slotting but have no code dependency on each other.

**Tech Stack:** Lit 3, TypeScript, Vitest + happy-dom (new), Storybook 10.3 (web-components-vite), VitePress 1.6

**Design doc:** `docs/plans/2026-03-22-button-icon-design.md`

---

### Task 1: Set Up Test Infrastructure

No test runner exists yet. Add Vitest with happy-dom for Web Component testing.

**Files:**
- Modify: `packages/components/package.json`
- Create: `packages/components/vitest.config.ts`
- Modify: `package.json` (root — add `test:components` script)

**Step 1: Install test dependencies**

Run:
```bash
cd /Users/jlamb/Projects/fdic-design-system
npm install --save-dev --workspace @fdic-ds/components vitest happy-dom
```

**Step 2: Create vitest config**

Create `packages/components/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.ts"],
  },
});
```

**Step 3: Add test script to components package.json**

Add to `packages/components/package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 4: Add root-level test script**

Add to root `package.json` scripts:

```json
"test:components": "npm run test --workspace @fdic-ds/components"
```

**Step 5: Verify test runner works**

Run:
```bash
npm run test:components
```
Expected: exits cleanly with "no test files found" (not an error).

**Step 6: Commit**

```bash
git add packages/components/package.json packages/components/vitest.config.ts package.json package-lock.json
git commit -m "chore: add vitest test infrastructure for components package"
```

---

### Task 2: Icon Registry Module

Separate module that both `fd-icon` and the built-in icon set depend on.

**Files:**
- Create: `packages/components/src/icons/registry.ts`
- Create: `packages/components/src/icons/registry.test.ts`

**Step 1: Write the failing tests**

Create `packages/components/src/icons/registry.test.ts`:

```ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { iconRegistry } from "./registry.js";

describe("iconRegistry", () => {
  beforeEach(() => {
    iconRegistry.clear();
  });

  it("registers and retrieves a single icon", () => {
    iconRegistry.register("star", "<svg>star</svg>");
    expect(iconRegistry.get("star")).toBe("<svg>star</svg>");
  });

  it("batch registers multiple icons", () => {
    iconRegistry.register({
      star: "<svg>star</svg>",
      check: "<svg>check</svg>",
    });
    expect(iconRegistry.get("star")).toBe("<svg>star</svg>");
    expect(iconRegistry.get("check")).toBe("<svg>check</svg>");
  });

  it("returns undefined for unknown icon", () => {
    expect(iconRegistry.get("nonexistent")).toBeUndefined();
  });

  it("overwrites existing icon on re-register", () => {
    iconRegistry.register("star", "<svg>old</svg>");
    iconRegistry.register("star", "<svg>new</svg>");
    expect(iconRegistry.get("star")).toBe("<svg>new</svg>");
  });

  it("strips script tags from registered SVG", () => {
    iconRegistry.register(
      "evil",
      '<svg><script>alert("xss")</script><circle/></svg>'
    );
    const result = iconRegistry.get("evil")!;
    expect(result).not.toContain("<script");
    expect(result).toContain("<circle/>");
  });

  it("strips event handler attributes from registered SVG", () => {
    iconRegistry.register(
      "evil",
      '<svg><circle onclick="alert(1)" onerror="alert(2)" r="5"/></svg>'
    );
    const result = iconRegistry.get("evil")!;
    expect(result).not.toContain("onclick");
    expect(result).not.toContain("onerror");
  });

  it("lists registered icon names", () => {
    iconRegistry.register({ a: "<svg>a</svg>", b: "<svg>b</svg>" });
    expect(iconRegistry.names()).toEqual(["a", "b"]);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npm run test:components`
Expected: FAIL — module not found

**Step 3: Write implementation**

Create `packages/components/src/icons/registry.ts`:

```ts
/**
 * Global icon registry for <fd-icon>.
 *
 * TRUST MODEL: register() accepts raw SVG strings. Only register SVG content
 * you control. Basic sanitization (strip <script>, event handlers) is applied
 * as defense-in-depth, but this is NOT a full untrusted-content pipeline.
 */

const store = new Map<string, string>();

function sanitizeSvg(svg: string): string {
  // Strip <script> tags and their contents
  let clean = svg.replace(/<script[\s\S]*?<\/script>/gi, "");
  // Strip event handler attributes (on*)
  clean = clean.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "");
  return clean;
}

export const iconRegistry = {
  register(nameOrIcons: string | Record<string, string>, svg?: string): void {
    if (typeof nameOrIcons === "string" && svg !== undefined) {
      store.set(nameOrIcons, sanitizeSvg(svg));
    } else if (typeof nameOrIcons === "object") {
      for (const [name, svgStr] of Object.entries(nameOrIcons)) {
        store.set(name, sanitizeSvg(svgStr));
      }
    }
  },

  get(name: string): string | undefined {
    return store.get(name);
  },

  names(): string[] {
    return [...store.keys()].sort();
  },

  clear(): void {
    store.clear();
  },
};
```

**Step 4: Run tests to verify they pass**

Run: `npm run test:components`
Expected: all 7 tests PASS

**Step 5: Commit**

```bash
git add packages/components/src/icons/registry.ts packages/components/src/icons/registry.test.ts
git commit -m "feat(icon): add icon registry with sanitization"
```

---

### Task 3: Built-in Phosphor Icons

Ship a curated Phosphor Regular icon set that auto-registers on import.

**Files:**
- Create: `packages/components/src/icons/phosphor-regular.ts`
- Create: `packages/components/src/icons/phosphor-regular.test.ts`

**Step 1: Write the failing test**

Create `packages/components/src/icons/phosphor-regular.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { iconRegistry } from "./registry.js";

describe("phosphor-regular built-in icons", () => {
  beforeEach(() => {
    iconRegistry.clear();
  });

  it("registers all expected icons on import", async () => {
    await import("./phosphor-regular.js");

    const expected = [
      "arrow-square-out",
      "caret-down",
      "caret-left",
      "caret-right",
      "caret-up",
      "check",
      "download",
      "eye",
      "eye-slash",
      "info",
      "magnifying-glass",
      "minus",
      "pencil",
      "plus",
      "star",
      "trash",
      "upload",
      "warning",
      "warning-octagon",
      "x",
    ];

    for (const name of expected) {
      const svg = iconRegistry.get(name);
      expect(svg, `icon "${name}" should be registered`).toBeDefined();
      expect(svg).toContain("<svg");
      expect(svg).toContain("viewBox");
    }
  });

  it("each icon SVG uses currentColor fill", async () => {
    await import("./phosphor-regular.js");
    for (const name of iconRegistry.names()) {
      const svg = iconRegistry.get(name)!;
      expect(svg, `icon "${name}" should use currentColor`).toContain(
        'fill="currentColor"'
      );
    }
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npm run test:components`
Expected: FAIL — module not found

**Step 3: Write implementation**

Create `packages/components/src/icons/phosphor-regular.ts`.

Each icon is a Phosphor Regular SVG string with `viewBox="0 0 256 256"` and `fill="currentColor"`. Source the SVG paths from [Phosphor Icons](https://github.com/phosphor-icons/core/tree/main/assets/regular).

```ts
/**
 * Built-in Phosphor Regular icon set for the FDIC Design System.
 * Auto-registers on import. Source: Phosphor Icons (MIT license).
 */
import { iconRegistry } from "./registry.js";

const icons: Record<string, string> = {
  star: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,95l59.45-4.72,22-55.68a16.36,16.36,0,0,1,31,0l22,55.68L224.92,95a16.46,16.46,0,0,1,9.37,19.86Z"/></svg>',
  "caret-down":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/></svg>',
  "caret-up":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M213.66,165.66a8,8,0,0,1-11.32,0L128,91.31,53.66,165.66a8,8,0,0,1-11.32-11.32l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,213.66,165.66Z"/></svg>',
  "caret-right":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/></svg>',
  "caret-left":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"/></svg>',
  plus: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/></svg>',
  minus:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"/></svg>',
  x: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg>',
  check:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></svg>',
  info: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,96a12,12,0,1,1,12,12A12,12,0,0,1,112,96Z"/></svg>',
  warning:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"/></svg>',
  "warning-octagon":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M227.31,80.23,175.77,28.69A16.13,16.13,0,0,0,164.45,24H91.55a16.13,16.13,0,0,0-11.32,4.69L28.69,80.23A16.13,16.13,0,0,0,24,91.55v72.9a16.13,16.13,0,0,0,4.69,11.32l51.54,51.54A16.13,16.13,0,0,0,91.55,232h72.9a16.13,16.13,0,0,0,11.32-4.69l51.54-51.54A16.13,16.13,0,0,0,232,164.45V91.55A16.13,16.13,0,0,0,227.31,80.23ZM216,164.45,164.45,216H91.55L40,164.45V91.55L91.55,40h72.9L216,91.55ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"/></svg>',
  "arrow-square-out":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M224,104a8,8,0,0,1-16,0V59.31l-66.34,66.35a8,8,0,0,1-11.32-11.32L196.69,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z"/></svg>',
  download:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M224,152v56a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V152a8,8,0,0,1,16,0v56H208V152a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,132.69V40a8,8,0,0,0-16,0v92.69L93.66,106.34a8,8,0,0,0-11.32,11.32Z"/></svg>',
  upload:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M224,152v56a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V152a8,8,0,0,1,16,0v56H208V152a8,8,0,0,1,16,0ZM93.66,85.66,120,59.31V152a8,8,0,0,0,16,0V59.31l26.34,26.35a8,8,0,0,0,11.32-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40A8,8,0,0,0,93.66,85.66Z"/></svg>',
  trash:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/></svg>',
  pencil:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M227.31,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.31,64l24-24L216,84.69Z"/></svg>',
  eye: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,123.97,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.29A169.47,169.47,0,0,1,24.57,128,169.47,169.47,0,0,1,48.07,97.29C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.29A169.47,169.47,0,0,1,231.43,128C223.72,141.71,184.34,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"/></svg>',
  "eye-slash":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a128.18,128.18,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.29A169.47,169.47,0,0,1,24.57,128c4.29-8.2,20.1-35.18,50-51.91l20.2,22.21a48,48,0,0,0,61.59,67.61l17.81,19.6A113.47,113.47,0,0,1,128,192Zm120-64.38a8,8,0,0,1-1.36,3.5c-.35.79-8.82,19.57-27.65,38.4-5.52,5.52-11.43,10.53-17.67,15A8,8,0,1,1,192,172.89c5.37-3.8,10.46-8.09,15.23-12.86A169.47,169.47,0,0,0,231.43,128a169.47,169.47,0,0,0-23.5-30.71C185.67,75.19,158.78,64,128,64a116.64,116.64,0,0,0-15.07,1,8,8,0,0,1-2.06-15.87A130.48,130.48,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,248,127.62Z"/></svg>',
  "magnifying-glass":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/></svg>',
};

iconRegistry.register(icons);
```

**Step 4: Run tests to verify they pass**

Run: `npm run test:components`
Expected: all tests PASS (registry + phosphor)

**Step 5: Commit**

```bash
git add packages/components/src/icons/phosphor-regular.ts packages/components/src/icons/phosphor-regular.test.ts
git commit -m "feat(icon): add built-in Phosphor Regular icon set"
```

---

### Task 4: `<fd-icon>` Web Component

**Files:**
- Create: `packages/components/src/components/fd-icon.ts`
- Create: `packages/components/src/components/fd-icon.test.ts`
- Modify: `packages/components/src/index.ts`

**Step 1: Write the failing tests**

Create `packages/components/src/components/fd-icon.test.ts`:

```ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { iconRegistry } from "../icons/registry.js";

// Register a test icon before importing the component
iconRegistry.register(
  "test-icon",
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><circle cx="128" cy="128" r="96"/></svg>'
);

// Dynamic import to ensure registry is populated first
let FdIcon: typeof import("./fd-icon.js").FdIcon;

describe("fd-icon", () => {
  beforeEach(async () => {
    const mod = await import("./fd-icon.js");
    FdIcon = mod.FdIcon;
  });

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-icon")).toBeDefined();
  });

  it("renders SVG for a registered icon", async () => {
    const el = document.createElement("fd-icon");
    el.setAttribute("name", "test-icon");
    document.body.appendChild(el);
    await el.updateComplete;

    const svg = el.shadowRoot!.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg!.getAttribute("fill")).toBe("currentColor");
    document.body.removeChild(el);
  });

  it("renders nothing for unknown icon and warns", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const el = document.createElement("fd-icon");
    el.setAttribute("name", "nonexistent");
    document.body.appendChild(el);
    await el.updateComplete;

    const svg = el.shadowRoot!.querySelector("svg");
    expect(svg).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("nonexistent")
    );
    warnSpy.mockRestore();
    document.body.removeChild(el);
  });

  it("is aria-hidden when no label is set", async () => {
    const el = document.createElement("fd-icon");
    el.setAttribute("name", "test-icon");
    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.getAttribute("aria-hidden")).toBe("true");
    document.body.removeChild(el);
  });

  it("has role=img and aria-label when label is set", async () => {
    const el = document.createElement("fd-icon");
    el.setAttribute("name", "test-icon");
    el.setAttribute("label", "Test icon");
    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.getAttribute("role")).toBe("img");
    expect(el.getAttribute("aria-label")).toBe("Test icon");
    expect(el.hasAttribute("aria-hidden")).toBe(false);
    document.body.removeChild(el);
  });

  it("exposes a static register method", () => {
    expect(typeof FdIcon.register).toBe("function");
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npm run test:components`
Expected: FAIL — module not found

**Step 3: Write implementation**

Create `packages/components/src/components/fd-icon.ts`:

```ts
import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { iconRegistry } from "../icons/registry.js";

export class FdIcon extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: var(--fd-icon-size, 18px);
      block-size: var(--fd-icon-size, 18px);
      color: inherit;
      line-height: 0;
    }

    svg {
      inline-size: 100%;
      block-size: 100%;
    }
  `;

  /** Registry key for the icon to render. */
  @property({ type: String, reflect: true })
  name = "";

  /**
   * Accessible label. When set, the host gets role="img" and aria-label.
   * When empty, the host gets aria-hidden="true" (decorative).
   */
  @property({ type: String, reflect: true })
  label = "";

  /** Proxy to iconRegistry.register() for convenience. */
  static register(
    nameOrIcons: string | Record<string, string>,
    svg?: string
  ): void {
    iconRegistry.register(nameOrIcons, svg);
  }

  protected override updated(): void {
    // Manage ARIA attributes on the host based on label
    if (this.label) {
      this.setAttribute("role", "img");
      this.setAttribute("aria-label", this.label);
      this.removeAttribute("aria-hidden");
    } else {
      this.removeAttribute("role");
      this.removeAttribute("aria-label");
      this.setAttribute("aria-hidden", "true");
    }
  }

  protected override render() {
    if (!this.name) return nothing;

    const svg = iconRegistry.get(this.name);
    if (!svg) {
      console.warn(`[fd-icon] Unknown icon name: "${this.name}"`);
      return nothing;
    }

    return html`${unsafeSVG(svg)}`;
  }
}

if (!customElements.get("fd-icon")) {
  customElements.define("fd-icon", FdIcon);
}
```

**Step 4: Update index.ts**

Modify `packages/components/src/index.ts` — add icon exports:

```ts
import "./components/fd-placeholder.js";
import "./components/fd-icon.js";
import "./icons/phosphor-regular.js";

export { FdPlaceholder } from "./components/fd-placeholder.js";
export { FdIcon } from "./components/fd-icon.js";
export { iconRegistry } from "./icons/registry.js";
```

**Step 5: Run tests to verify they pass**

Run: `npm run test:components`
Expected: all tests PASS

**Step 6: Build to verify TypeScript compiles**

Run: `npm run build:components`
Expected: clean build, no errors

**Step 7: Commit**

```bash
git add packages/components/src/components/fd-icon.ts packages/components/src/components/fd-icon.test.ts packages/components/src/index.ts
git commit -m "feat(icon): add fd-icon Web Component with registry and built-in icons"
```

---

### Task 5: `<fd-button>` Web Component

**Files:**
- Create: `packages/components/src/components/fd-button.ts`
- Create: `packages/components/src/components/fd-button.test.ts`
- Modify: `packages/components/src/index.ts`

**Step 1: Write the failing tests**

Create `packages/components/src/components/fd-button.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";

let FdButton: typeof import("./fd-button.js").FdButton;

async function createButton(
  attrs: Record<string, string> = {},
  innerHTML = "Click me"
): Promise<HTMLElement & { updateComplete: Promise<boolean> }> {
  const el = document.createElement("fd-button") as HTMLElement & {
    updateComplete: Promise<boolean>;
  };
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v);
  }
  el.innerHTML = innerHTML;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getInternal(el: HTMLElement): HTMLElement {
  return el.shadowRoot!.querySelector("[part=base]") as HTMLElement;
}

describe("fd-button", () => {
  beforeEach(async () => {
    const mod = await import("./fd-button.js");
    FdButton = mod.FdButton;
    // Clean up any buttons from previous test
    document.body.innerHTML = "";
  });

  // --- Rendering ---

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-button")).toBeDefined();
  });

  it("renders a native <button> by default", async () => {
    const el = await createButton();
    const internal = getInternal(el);
    expect(internal.tagName).toBe("BUTTON");
    expect(internal.getAttribute("type")).toBe("button");
  });

  it("renders an <a> when href is set", async () => {
    const el = await createButton({ href: "/page" });
    const internal = getInternal(el);
    expect(internal.tagName).toBe("A");
    expect(internal.getAttribute("href")).toBe("/page");
  });

  it("does not add role=button to <a>", async () => {
    const el = await createButton({ href: "/page" });
    const internal = getInternal(el);
    expect(internal.hasAttribute("role")).toBe(false);
  });

  it("reflects type attribute on <button>", async () => {
    const el = await createButton({ type: "submit" });
    const internal = getInternal(el);
    expect(internal.getAttribute("type")).toBe("submit");
  });

  it("ignores type when href is set", async () => {
    const el = await createButton({ href: "/page", type: "submit" });
    const internal = getInternal(el);
    expect(internal.tagName).toBe("A");
    expect(internal.hasAttribute("type")).toBe(false);
  });

  // --- Disabled ---

  it("applies native disabled on <button>", async () => {
    const el = await createButton({ disabled: "" });
    const internal = getInternal(el);
    expect(internal.hasAttribute("disabled")).toBe(true);
  });

  it("applies aria-disabled on <a> and removes href", async () => {
    const el = await createButton({ href: "/page", disabled: "" });
    const internal = getInternal(el);
    expect(internal.getAttribute("aria-disabled")).toBe("true");
    expect(internal.getAttribute("tabindex")).toBe("-1");
    expect(internal.hasAttribute("href")).toBe(false);
  });

  it("suppresses click on disabled <a>", async () => {
    const el = await createButton({ href: "/page", disabled: "" });
    const internal = getInternal(el);
    let clicked = false;
    el.addEventListener("click", () => {
      clicked = true;
    });
    internal.click();
    expect(clicked).toBe(false);
  });

  // --- Variants ---

  it("defaults to primary variant", async () => {
    const el = await createButton();
    expect(el.getAttribute("variant")).toBeNull(); // primary is default, no attribute needed
    const internal = getInternal(el);
    expect(internal.classList.contains("primary")).toBe(true);
  });

  it("applies variant class", async () => {
    const el = await createButton({ variant: "destructive" });
    const internal = getInternal(el);
    expect(internal.classList.contains("destructive")).toBe(true);
  });

  // --- Slots ---

  it("renders default slot content", async () => {
    const el = await createButton({}, "Save");
    const slot = el.shadowRoot!.querySelector(
      'slot:not([name])'
    ) as HTMLSlotElement;
    expect(slot).not.toBeNull();
  });

  it("renders icon-start slot", async () => {
    const el = await createButton(
      {},
      '<span slot="icon-start">icon</span>Label'
    );
    const slot = el.shadowRoot!.querySelector(
      'slot[name="icon-start"]'
    ) as HTMLSlotElement;
    expect(slot).not.toBeNull();
  });

  it("renders icon-end slot", async () => {
    const el = await createButton(
      {},
      'Label<span slot="icon-end">icon</span>'
    );
    const slot = el.shadowRoot!.querySelector(
      'slot[name="icon-end"]'
    ) as HTMLSlotElement;
    expect(slot).not.toBeNull();
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npm run test:components`
Expected: FAIL — module not found

**Step 3: Write implementation**

Create `packages/components/src/components/fd-button.ts`:

```ts
import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

export type ButtonVariant =
  | "primary"
  | "neutral"
  | "subtle"
  | "outline"
  | "destructive";

export class FdButton extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      vertical-align: middle;
    }

    :host([disabled]) {
      pointer-events: none;
    }

    /* --- Shared base --- */

    .base {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--fd-button-gap, var(--fdic-spacing-2xs, 4px));
      min-height: var(--fd-button-height, 44px);
      min-width: var(--fd-button-min-width, 44px);
      padding-inline: 7px;
      border: none;
      border-radius: var(--fd-button-radius, var(--fdic-corner-radius-sm, 3px));
      font-family: var(
        --fdic-font-family-sans-serif,
        "Source Sans 3",
        "Source Sans Pro",
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        "Helvetica Neue",
        Arial,
        sans-serif
      );
      font-size: var(--fd-button-font-size, var(--fdic-font-size-body, 18px));
      line-height: 1.375;
      text-decoration: none;
      cursor: pointer;
      position: relative;
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .base:focus {
      outline: none;
    }

    .base:focus-visible {
      outline: none;
      box-shadow:
        0 0 0 2px var(--fd-button-focus-gap, var(--ds-color-bg-input, #ffffff)),
        0 0 0 4px
          var(
            --fd-button-focus-ring,
            var(--ds-color-border-input-focus, #38b6ff)
          );
    }

    /* --- Primary --- */

    .primary {
      background: var(
        --fd-button-bg-primary,
        var(--ds-color-bg-active, #0d6191)
      );
      color: var(
        --fd-button-text-primary,
        var(--ds-color-text-inverted, #ffffff)
      );
      font-weight: 600;
    }

    .primary:hover {
      box-shadow: inset 0 0 0 999px
        var(--fd-button-overlay-hover, var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04)));
    }

    .primary:active {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-button-overlay-active,
          var(--ds-color-overlay-pressed, rgba(0, 0, 0, 0.08))
        );
    }

    /* --- Destructive --- */

    .destructive {
      background: var(
        --fd-button-bg-destructive,
        var(--ds-color-bg-destructive, #d80e3a)
      );
      color: var(
        --fd-button-text-destructive,
        var(--ds-color-text-inverted, #ffffff)
      );
      font-weight: 600;
    }

    .destructive:hover {
      box-shadow: inset 0 0 0 999px
        var(--fd-button-overlay-hover, var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04)));
    }

    .destructive:active {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-button-overlay-active,
          var(--ds-color-overlay-pressed, rgba(0, 0, 0, 0.08))
        );
    }

    /* --- Neutral --- */

    .neutral {
      background: var(
        --fd-button-bg-neutral,
        var(--ds-color-bg-interactive, #f5f5f7)
      );
      color: var(
        --fd-button-text-neutral,
        var(--ds-color-text-primary, #212123)
      );
      font-weight: 400;
    }

    .neutral:hover {
      box-shadow: inset 0 0 0 999px
        var(--fd-button-overlay-hover, var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04)));
    }

    .neutral:active {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-button-overlay-active,
          var(--ds-color-overlay-pressed, rgba(0, 0, 0, 0.08))
        );
    }

    /* --- Subtle --- */

    .subtle {
      background: transparent;
      color: var(
        --fd-button-text-subtle,
        var(--ds-color-text-primary, #212123)
      );
      font-weight: 400;
    }

    .subtle:hover {
      box-shadow: inset 0 0 0 999px
        var(--fd-button-overlay-hover, var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04)));
    }

    .subtle:active {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-button-overlay-active,
          var(--ds-color-overlay-pressed, rgba(0, 0, 0, 0.08))
        );
    }

    /* --- Outline --- */

    .outline {
      background: var(--ds-color-bg-input, #ffffff);
      color: var(
        --fd-button-text-outline,
        var(--ds-color-text-link, #1278b0)
      );
      font-weight: 400;
      border: 2px solid
        var(
          --fd-button-border-outline,
          var(--ds-color-bg-active, #0d6191)
        );
    }

    .outline:hover {
      box-shadow: inset 0 0 0 999px
        var(--fd-button-overlay-hover, var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04)));
    }

    .outline:active {
      box-shadow: inset 0 0 0 999px
        var(
          --fd-button-overlay-active,
          var(--ds-color-overlay-pressed, rgba(0, 0, 0, 0.08))
        );
    }

    /* --- Disabled --- */

    .disabled {
      background: var(
        --fd-button-bg-disabled,
        var(--ds-color-bg-container, #f5f5f7)
      );
      color: var(
        --fd-button-text-disabled,
        var(--ds-color-text-disabled, #9e9ea0)
      );
      cursor: default;
      font-weight: inherit;
    }

    .disabled.outline {
      border-color: var(
        --fd-button-border-outline-disabled,
        var(--ds-color-border-input-disabled, #d6d6d8)
      );
    }

    .disabled:hover,
    .disabled:active {
      box-shadow: none;
    }

    /* --- Slots --- */

    ::slotted([slot="icon-start"]),
    ::slotted([slot="icon-end"]) {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
    }

    .label {
      display: inline-flex;
      align-items: center;
      padding-inline: 6px;
    }

    /* --- Forced colors --- */

    @media (forced-colors: active) {
      .base {
        border: 1px solid ButtonText;
      }

      .base:focus-visible {
        outline: 2px solid Highlight;
        outline-offset: 2px;
        box-shadow: none;
      }

      .disabled {
        border-color: GrayText;
        color: GrayText;
      }
    }
  `;

  @property({ type: String, reflect: true })
  variant: ButtonVariant = "primary";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String, reflect: true })
  type: "button" | "submit" | "reset" = "button";

  @property({ type: String, reflect: true })
  href?: string;

  @property({ type: String, reflect: true })
  target?: string;

  @property({ type: String, reflect: true })
  rel?: string;

  private _handleDisabledClick(e: Event): void {
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  protected override render() {
    const isLink = !!this.href;
    const isDisabled = this.disabled;

    const classes = {
      base: true,
      [this.variant]: !isDisabled,
      disabled: isDisabled,
      outline: this.variant === "outline",
    };

    const content = html`
      <slot name="icon-start"></slot>
      <span part="label" class="label"><slot></slot></span>
      <slot name="icon-end"></slot>
    `;

    if (isLink) {
      return html`
        <a
          part="base"
          class=${classMap(classes)}
          href=${ifDefined(isDisabled ? undefined : this.href)}
          target=${ifDefined(this.target)}
          rel=${ifDefined(this.rel)}
          aria-disabled=${ifDefined(isDisabled ? "true" : undefined)}
          tabindex=${ifDefined(isDisabled ? "-1" : undefined)}
          @click=${isDisabled ? this._handleDisabledClick : undefined}
        >
          ${content}
        </a>
      `;
    }

    return html`
      <button
        part="base"
        class=${classMap(classes)}
        type=${this.type}
        ?disabled=${isDisabled}
      >
        ${content}
      </button>
    `;
  }
}

if (!customElements.get("fd-button")) {
  customElements.define("fd-button", FdButton);
}
```

**Step 4: Update index.ts**

Add to `packages/components/src/index.ts`:

```ts
import "./components/fd-button.js";
export { FdButton } from "./components/fd-button.js";
export type { ButtonVariant } from "./components/fd-button.js";
```

**Step 5: Run tests to verify they pass**

Run: `npm run test:components`
Expected: all tests PASS

**Step 6: Build to verify TypeScript compiles**

Run: `npm run build:components`
Expected: clean build, no errors

**Step 7: Commit**

```bash
git add packages/components/src/components/fd-button.ts packages/components/src/components/fd-button.test.ts packages/components/src/index.ts
git commit -m "feat(button): add fd-button Web Component with 5 variants and link rendering"
```

---

### Task 6: Storybook Stories

**Files:**
- Create: `apps/storybook/src/fd-icon.stories.ts`
- Create: `apps/storybook/src/fd-button.stories.ts`

**Step 1: Create fd-icon stories**

Create `apps/storybook/src/fd-icon.stories.ts`:

```ts
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "@fdic-ds/components";

type IconArgs = {
  name: string;
  label: string;
  size: string;
};

const iconNames = [
  "star",
  "caret-down",
  "caret-up",
  "caret-right",
  "caret-left",
  "plus",
  "minus",
  "x",
  "check",
  "info",
  "warning",
  "warning-octagon",
  "arrow-square-out",
  "download",
  "upload",
  "trash",
  "pencil",
  "eye",
  "eye-slash",
  "magnifying-glass",
];

const meta = {
  title: "Components/Icon",
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "select",
      options: iconNames,
    },
    label: { control: "text" },
    size: { control: "text" },
  },
  args: {
    name: "star",
    label: "",
    size: "18",
  },
  render: (args: IconArgs) => html`
    <fd-icon
      name=${args.name}
      label=${args.label || ""}
      style=${args.size !== "18" ? `--fd-icon-size: ${args.size}px` : ""}
    ></fd-icon>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Semantic: Story = {
  args: { name: "warning", label: "Warning" },
};

export const CustomSize: Story = {
  args: { name: "star", size: "32" },
};

export const AllIcons: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
      ${iconNames.map(
        (name) => html`
          <div
            style="display: flex; flex-direction: column; align-items: center; gap: 4px; width: 80px;"
          >
            <fd-icon name=${name} style="--fd-icon-size: 24px;"></fd-icon>
            <span style="font-size: 11px; color: #595961;">${name}</span>
          </div>
        `
      )}
    </div>
  `,
};
```

**Step 2: Create fd-button stories**

Create `apps/storybook/src/fd-button.stories.ts`:

```ts
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "@fdic-ds/components";

type ButtonArgs = {
  variant: "primary" | "neutral" | "subtle" | "outline" | "destructive";
  label: string;
  disabled: boolean;
  iconStart: string;
  iconEnd: string;
  href: string;
};

const meta = {
  title: "Components/Button",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "neutral", "subtle", "outline", "destructive"],
    },
    label: { control: "text" },
    disabled: { control: "boolean" },
    iconStart: {
      control: "select",
      options: ["", "star", "download", "trash", "pencil", "plus"],
    },
    iconEnd: {
      control: "select",
      options: ["", "caret-down", "arrow-square-out", "caret-right"],
    },
    href: { control: "text" },
  },
  args: {
    variant: "primary",
    label: "Submit application",
    disabled: false,
    iconStart: "",
    iconEnd: "",
    href: "",
  },
  render: (args: ButtonArgs) => html`
    <fd-button
      variant=${args.variant}
      ?disabled=${args.disabled}
      href=${args.href || undefined}
    >
      ${args.iconStart
        ? html`<fd-icon slot="icon-start" name=${args.iconStart}></fd-icon>`
        : ""}
      ${args.label}
      ${args.iconEnd
        ? html`<fd-icon slot="icon-end" name=${args.iconEnd}></fd-icon>`
        : ""}
    </fd-button>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Neutral: Story = {
  args: { variant: "neutral", label: "Save as draft" },
};

export const Subtle: Story = {
  args: { variant: "subtle", label: "Learn more" },
};

export const Outline: Story = {
  args: { variant: "outline", label: "View details" },
};

export const Destructive: Story = {
  args: { variant: "destructive", label: "Delete account" },
};

export const WithIcons: Story = {
  args: {
    variant: "primary",
    label: "Download report",
    iconStart: "download",
    iconEnd: "caret-down",
  },
};

export const IconOnly: Story = {
  render: () => html`
    <fd-button variant="subtle" aria-label="Close dialog">
      <fd-icon slot="icon-start" name="x"></fd-icon>
    </fd-button>
  `,
};

export const AsLink: Story = {
  args: {
    variant: "outline",
    label: "Visit FDIC.gov",
    href: "https://www.fdic.gov",
    iconEnd: "arrow-square-out",
  },
};

export const Disabled: Story = {
  args: { disabled: true, label: "Not available" },
};

export const DisabledLink: Story = {
  args: {
    variant: "outline",
    label: "Unavailable",
    href: "/unavailable",
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
      <fd-button variant="primary">Primary</fd-button>
      <fd-button variant="neutral">Neutral</fd-button>
      <fd-button variant="subtle">Subtle</fd-button>
      <fd-button variant="outline">Outline</fd-button>
      <fd-button variant="destructive">Destructive</fd-button>
    </div>
  `,
};

export const AllVariantsDisabled: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
      <fd-button variant="primary" disabled>Primary</fd-button>
      <fd-button variant="neutral" disabled>Neutral</fd-button>
      <fd-button variant="subtle" disabled>Subtle</fd-button>
      <fd-button variant="outline" disabled>Outline</fd-button>
      <fd-button variant="destructive" disabled>Destructive</fd-button>
    </div>
  `,
};
```

**Step 3: Verify Storybook builds**

Run: `npm run build:storybook`
Expected: clean build

**Step 4: Commit**

```bash
git add apps/storybook/src/fd-icon.stories.ts apps/storybook/src/fd-button.stories.ts
git commit -m "feat(storybook): add icon and button stories"
```

---

### Task 7: Documentation Pages

**Files:**
- Create: `apps/docs/components/icon.md`
- Create: `apps/docs/components/button.md`
- Modify: `apps/docs/.vitepress/config.ts` (add sidebar entries)

**Step 1: Create icon doc page**

Create `apps/docs/components/icon.md`:

```md
# Icon

Icons communicate meaning at a glance. They support labels, actions, and navigation without adding verbal clutter.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>&lt;fd-icon&gt;</code> to render icons from the design system's built-in Phosphor set or your own registered icons. Icons are decorative by default and accessible when labeled.</p>
</div>

## When to use

- **Alongside a text label** — Icons reinforce meaning. A download button with a download icon is faster to scan.
- **As a recognizable shorthand in space-constrained UI** — Toolbar actions, close buttons, and navigation controls where the meaning is universally understood.
- **To distinguish items in a list or navigation** — Icons help users scan categories or action types.

## When not to use

- **Don't use an icon without a label unless the meaning is universally obvious** — "X" for close, a magnifying glass for search. When in doubt, add a text label.
- **Don't use icons purely for decoration** — Every icon should carry meaning or reinforce a label. Decorative flourishes add noise.
- **Don't rely on icon color alone to convey meaning** — Always pair color with shape, label, or context.

## Examples

<StoryEmbed storyId="components-icon--default" caption="Default — a single decorative icon" />
<StoryEmbed storyId="components-icon--all-icons" caption="All built-in icons from the Phosphor Regular set" />

## Accessibility

- Icons are `aria-hidden="true"` by default. They are treated as decorative unless you set a `label`.
- When an icon is the only content communicating meaning (rare — prefer text labels), set `label` to provide an accessible name: `<fd-icon name="warning" label="Warning"></fd-icon>`.
- Icon color is inherited via `currentColor`. Ensure the parent element's text color meets WCAG contrast requirements.
- Icons scale with `--fd-icon-size`. At 200% zoom, they remain proportional to surrounding text.

## Content guidance

- **Choose icons from the built-in set first.** The curated Phosphor Regular set covers most FDIC UI patterns.
- **Register custom icons only when the built-in set lacks a clear match.** Use `FdIcon.register()` with trusted SVG content you control.
- **Keep icon names descriptive and lowercase-kebab-case.** `arrow-square-out`, not `extLink` or `ArrowSquareOut`.

## Related components

<ul class="fdic-related-list">
  <li><a href="./button">Button</a> — Icons are typically used inside button icon slots.</li>
</ul>
```

**Step 2: Create button doc page**

Create `apps/docs/components/button.md`:

```md
# Button

Buttons let users take actions — submitting forms, confirming decisions, or navigating to new pages.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>&lt;fd-button&gt;</code> for interactive actions. Five variants map to a visual hierarchy from primary actions through destructive confirmations. Buttons can also render as links when navigation is the intent.</p>
</div>

## When to use

- **A user needs to trigger an action** — Save, submit, delete, download, or confirm.
- **You need a clear visual hierarchy of actions** — Primary for the main action, neutral or outline for secondary actions, destructive for irreversible operations.
- **A link needs to look like a button** — Navigation that benefits from button-level visual weight (e.g., a "Get started" call to action). Set `href` and the component renders a native `<a>`.

## When not to use

- **Don't use a button for inline text navigation** — Use a regular `<a>` link. Buttons are for actions or prominent calls to action, not body-text links.
- **Don't use destructive for anything less than irreversible** — Deleting data, closing without saving, removing access. If the action is reversible, use a different variant.
- **Don't put more than one primary button in the same section** — Multiple primary buttons dilute the visual hierarchy. Use outline or neutral for secondary actions.
- **Don't disable buttons without explanation** — If a button is disabled, the user needs to understand why and what to do about it. Pair disabled state with a visible explanation.

## Examples

<StoryEmbed storyId="components-button--primary" caption="Primary — the main action on a page" />
<StoryEmbed storyId="components-button--neutral" caption="Neutral — secondary actions like 'Save as draft'" />
<StoryEmbed storyId="components-button--outline" caption="Outline — an alternative secondary action with more visual presence" />
<StoryEmbed storyId="components-button--subtle" caption="Subtle — minimal visual weight for non-critical actions" />
<StoryEmbed storyId="components-button--destructive" caption="Destructive — irreversible actions that warrant caution" />
<StoryEmbed storyId="components-button--with-icons" caption="With icons — leading and trailing icons reinforce the action" />
<StoryEmbed storyId="components-button--icon-only" caption="Icon-only — use aria-label on the button, not the icon" />
<StoryEmbed storyId="components-button--as-link" caption="As link — renders a native <a> with button styling" />

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use one primary button per section</h4>
    <p>A single primary button guides the user to the most important action.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use multiple primary buttons side by side</h4>
    <p>Competing primary actions make it unclear what the user should do.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Label buttons with specific verbs</h4>
    <p>"Download report" tells the user exactly what will happen.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use vague labels like "Click here" or "Submit"</h4>
    <p>Generic labels don't help users predict the outcome, especially in financial workflows where trust matters.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Pair destructive buttons with a confirmation step</h4>
    <p>In financial and regulatory contexts, irreversible actions should always include a confirmation dialog or a chance to undo.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use destructive as the only action</h4>
    <p>Always offer a safe exit alongside a destructive action — "Cancel" next to "Delete."</p>
  </div>
</div>

## Content guidelines

<div class="fdic-content-rule">
  <strong>Start labels with a verb.</strong>
  <p>Buttons describe actions. Lead with what the user is doing.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>Download report</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>Report download</p>
    </div>
  </div>
</div>

<div class="fdic-content-rule">
  <strong>Keep labels short — 1 to 3 words when possible.</strong>
  <p>Longer labels are harder to scan and may truncate in narrow layouts.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>Save changes</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>Save all changes to your profile</p>
    </div>
  </div>
</div>

<div class="fdic-content-rule">
  <strong>Use sentence case, not title case.</strong>
  <p>Sentence case is easier to read and matches FDIC content standards.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>Submit application</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>Submit Application</p>
    </div>
  </div>
</div>

## Accessibility

- Buttons render native `<button>` elements inside Shadow DOM. Keyboard behavior (Enter, Space) and screen reader announcements are automatic.
- Links with `href` render native `<a>` elements with link semantics. Screen readers announce them as links, not buttons.
- Disabled buttons use native `disabled` and are removed from tab order. Disabled links use `aria-disabled="true"` and `tabindex="-1"`.
- Icon-only buttons must have `aria-label` on the `<fd-button>` element. The slotted icon should remain `aria-hidden="true"`.
- Focus ring (keyboard only): 2px white gap + 2px blue outline, consistent with the design system's focus pattern.
- Minimum touch target: 44x44px (WCAG 2.5.8, Level AAA).
- All variants meet WCAG 2.1 AA color contrast requirements for text against their background. Disabled variants are exempt from contrast requirements per WCAG.

## Known limitations

- **Form submission**: The `<button>` inside Shadow DOM does not submit forms across shadow boundaries. If you need `<fd-button>` to submit a form, use a click handler to call `form.submit()` or `form.requestSubmit()` manually. Native form association via `ElementInternals` is planned for a future version.
- **No loading state**: There is no built-in spinner or loading indicator in v1.
- **No size variants**: A single 44px height is the only size. This matches the current Figma specification.

## Related components

<ul class="fdic-related-list">
  <li><a href="./icon">Icon</a> — Use <code>&lt;fd-icon&gt;</code> in the <code>icon-start</code> and <code>icon-end</code> slots.</li>
</ul>
```

**Step 3: Update VitePress sidebar**

Add "Icon" and "Button" to the Components sidebar in `apps/docs/.vitepress/config.ts`:

```ts
// Add these two entries to the Components items array:
{ text: "Icon", link: "/components/icon" },
{ text: "Button", link: "/components/button" },
```

**Step 4: Verify docs build**

Run: `npm run build:docs`
Expected: clean build

**Step 5: Commit**

```bash
git add apps/docs/components/icon.md apps/docs/components/button.md apps/docs/.vitepress/config.ts
git commit -m "docs: add icon and button component documentation"
```

---

### Task 8: GitHub Discussion

Create a GitHub Discussion documenting the research, design decisions, and acceptance criteria.

**Step 1: Create the discussion**

Run:
```bash
gh discussion create \
  --repo jflamb/fdic-design-system \
  --category "General" \
  --title "Component research: Button and Icon" \
  --body "$(cat docs/plans/2026-03-22-button-icon-design.md)"
```

If "General" category doesn't exist, check available categories:
```bash
gh discussion list --repo jflamb/fdic-design-system --limit 1
```
And use an appropriate category.

**Step 2: Note the discussion URL for the final summary**

---

### Task 9: Create Branch and Open PR

**Step 1: Create implementation branch**

```bash
git checkout -b feat/button-icon-components
```

Note: all commits from Tasks 1-7 should be on this branch. If you committed to `main`, create the branch first and cherry-pick, or start fresh on the branch.

**Step 2: Push and open PR**

```bash
git push -u origin feat/button-icon-components
gh pr create \
  --title "feat: add fd-icon and fd-button Web Components" \
  --body "$(cat <<'EOF'
## Summary

- Adds `<fd-icon>` — icon registry + inline SVG rendering with built-in Phosphor Regular set
- Adds `<fd-button>` — 5 variants (primary, neutral, subtle, outline, destructive) with link rendering
- Adds Vitest test infrastructure for the components package
- Adds Storybook stories and VitePress docs for both components

## Design doc

See `docs/plans/2026-03-22-button-icon-design.md`

## Test plan

- [ ] `npm run test:components` passes
- [ ] `npm run build:components` succeeds
- [ ] `npm run build:storybook` succeeds
- [ ] `npm run build:docs` succeeds
- [ ] Icon stories render all 20 built-in icons
- [ ] Button stories show all 5 variants in default and disabled states
- [ ] Keyboard focus ring visible on button stories
- [ ] Icon-only button has accessible name via aria-label
- [ ] Disabled link button suppresses click and removes href

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

### Task 10: Validation and Final Summary

**Step 1: Run all validation**

```bash
npm run test:components
npm run build:components
npm run build:storybook
npm run build:docs
```

All four must pass.

**Step 2: Compile final summary**

Document:
- GitHub Discussion link
- PR link
- Files changed
- What was validated
- What remains unvalidated (manual visual QA, cross-browser testing, screen reader testing)
- Open questions and follow-up recommendations from the design doc
