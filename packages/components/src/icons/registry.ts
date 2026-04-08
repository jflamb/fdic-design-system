import {
  DOMParser as XmlDomParser,
  XMLSerializer as XmlSerializer,
} from "@xmldom/xmldom";

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
 * string. Uses the browser DOM parser when available and falls back to an XML
 * DOM implementation for non-browser environments such as SSR.
 */
function sanitizeNode(node: Node): void {
  if (node.nodeType !== 1) {
    return;
  }

  const element = node as Element;

  if (element.nodeName.toLowerCase() === "script") {
    element.parentNode?.removeChild(element);
    return;
  }

  for (const attr of [...element.attributes]) {
    if (attr.name.toLowerCase().startsWith("on")) {
      element.removeAttribute(attr.name);
    }
  }

  for (const child of [...element.childNodes]) {
    sanitizeNode(child);
  }
}

function sanitize(svg: string): string {
  const useNativeDomParser =
    typeof DOMParser !== "undefined" && typeof XMLSerializer !== "undefined";
  const Parser = useNativeDomParser ? DOMParser : XmlDomParser;
  const Serializer = useNativeDomParser ? XMLSerializer : XmlSerializer;

  const doc = new Parser().parseFromString(svg, "image/svg+xml");
  const root = doc.documentElement;
  if (!root) {
    return "";
  }

  sanitizeNode(root as Node);
  return new Serializer().serializeToString(root as any);
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
