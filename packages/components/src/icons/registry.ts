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
 * The `register` method sanitizes SVG input with a strict element and
 * attribute allowlist before rendering through Lit's `unsafeSVG` directive.
 * This protects the registry from active SVG surfaces such as scripts,
 * event-handler attributes, URL-bearing references, embedded HTML, external
 * images, and data URLs.
 *
 * Callers should still register only simple icon glyphs from trusted or vetted
 * sources. Complex SVG features such as filters, gradients, masks, symbols,
 * animation, images, and embedded documents are intentionally not supported.
 */

/**
 * Keep registered SVGs to simple icon glyphs. Uses the browser DOM parser when
 * available and falls back to an XML DOM implementation for non-browser
 * environments such as SSR.
 */
const ALLOWED_ELEMENTS = new Set([
  "svg",
  "g",
  "path",
  "circle",
  "ellipse",
  "line",
  "polygon",
  "polyline",
  "rect",
]);

const ALLOWED_ATTRIBUTES = new Set([
  "aria-hidden",
  "cx",
  "cy",
  "d",
  "fill",
  "fill-rule",
  "height",
  "opacity",
  "r",
  "rx",
  "ry",
  "stroke",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-width",
  "transform",
  "viewbox",
  "width",
  "x",
  "x1",
  "x2",
  "xmlns",
  "y",
  "y1",
  "y2",
]);

const URL_REFERENCE_PATTERN = /\b(?:javascript|data):|url\s*\(/i;

function isAllowedAttribute(attr: Attr): boolean {
  const name = attr.name.toLowerCase();

  if (name.startsWith("on")) {
    return false;
  }

  if (!ALLOWED_ATTRIBUTES.has(name)) {
    return false;
  }

  return !URL_REFERENCE_PATTERN.test(attr.value);
}

function sanitizeElement(node: Element): boolean {
  const element = node as Element;
  const elementName = element.nodeName.toLowerCase();

  if (!ALLOWED_ELEMENTS.has(elementName)) {
    return false;
  }

  for (const attr of [...element.attributes]) {
    if (!isAllowedAttribute(attr)) {
      element.removeAttribute(attr.name);
    }
  }

  for (const child of [...element.childNodes]) {
    if (child.nodeType === 1) {
      if (!sanitizeElement(child as Element)) {
        element.removeChild(child);
      }
    } else if (child.nodeType !== 3) {
      element.removeChild(child);
    }
  }

  return true;
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

  if (!sanitizeElement(root as Element)) {
    return "";
  }

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
