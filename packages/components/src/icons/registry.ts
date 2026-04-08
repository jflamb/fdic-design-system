/**
 * Global Icon Registry
 *
 * A simple registry for SVG icon strings, keyed by name. Components look up
 * icons at render-time so that the set of available icons can be extended or
 * replaced without modifying component source code.
 *
 * ## Security note
 *
 * The `register` method performs basic sanitization (stripping `<script>` tags
 * and `on*` event-handler attributes) as a defense-in-depth measure. This is
 * **not** a full untrusted-content sanitization pipeline — callers are expected
 * to register only SVG markup from trusted sources (e.g., the bundled Phosphor
 * icon set or a vetted design-system icon library).
 */

/**
 * Strip `<script>` elements and `on*` event-handler attributes from an SVG
 * string. Uses DOM parsing when available (browser), falls back to regex
 * stripping in non-browser environments (e.g. SSR / Node.js).
 */
function sanitizeWithoutDomParser(svg: string): string {
  let sanitized = svg;

  do {
    svg = sanitized;
    sanitized = sanitized
      .replace(/<script\b[^>]*>[^]*?<\/script\s*>/gi, "")
      .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  } while (sanitized !== svg);

  return sanitized;
}

function sanitize(svg: string): string {
  if (typeof DOMParser === "undefined") {
    return sanitizeWithoutDomParser(svg);
  }

  const doc = new DOMParser().parseFromString(svg, "image/svg+xml");

  for (const el of doc.querySelectorAll("script")) {
    el.remove();
  }

  for (const el of doc.querySelectorAll("*")) {
    for (const attr of [...el.attributes]) {
      if (attr.name.toLowerCase().startsWith("on")) {
        el.removeAttribute(attr.name);
      }
    }
  }

  const root = doc.documentElement;
  return new XMLSerializer().serializeToString(root);
}

const registry = new Map<string, string>();

export const iconRegistry = {
  /**
   * Register one or more icons.
   *
   * Single registration:
   * ```ts
   * iconRegistry.register("star", "<svg>...</svg>");
   * ```
   *
   * Batch registration:
   * ```ts
   * iconRegistry.register({ star: "<svg>...</svg>", check: "<svg>...</svg>" });
   * ```
   */
  register(
    nameOrIcons: string | Record<string, string>,
    svg?: string,
  ): void {
    if (typeof nameOrIcons === "string") {
      if (svg === undefined) {
        throw new Error("svg argument is required when registering a single icon");
      }
      registry.set(nameOrIcons, sanitize(svg));
    } else {
      for (const [name, iconSvg] of Object.entries(nameOrIcons)) {
        registry.set(name, sanitize(iconSvg));
      }
    }
  },

  /**
   * Retrieve a registered icon's SVG string, or `undefined` if not found.
   */
  get(name: string): string | undefined {
    return registry.get(name);
  },

  /**
   * Return a sorted array of all registered icon names.
   */
  names(): string[] {
    return [...registry.keys()].sort();
  },

  /**
   * Remove all registered icons. Primarily useful in tests.
   */
  clear(): void {
    registry.clear();
  },
};
