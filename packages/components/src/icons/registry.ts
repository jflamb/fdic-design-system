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
 * string. Returns the sanitized SVG.
 */
function sanitize(svg: string): string {
  // Remove <script>...</script> and self-closing <script/> tags (case-insensitive)
  let cleaned = svg.replace(/<script[\s\S]*?<\/script\s*>/gi, "");
  cleaned = cleaned.replace(/<script\s*\/>/gi, "");

  // Remove on* event handler attributes (e.g. onclick="...", onload='...')
  cleaned = cleaned.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "");

  return cleaned;
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
