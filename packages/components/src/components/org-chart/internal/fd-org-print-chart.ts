import { hierarchy, tree as d3Tree, type HierarchyPointNode } from "d3-hierarchy";
import { LitElement, css, html, nothing, svg } from "lit";
import type {
  FdOrgNode,
  FdOrgPrintScope,
  FdOrgTree,
} from "../../org-chart-types.js";
import {
  FD_ORG_NODE_TYPE_LABELS,
  FD_ORG_SOURCE_STATUS_LABELS,
  getOrgDescendantIds,
  printDecision,
} from "../../org-chart-types.js";

type PrintNode = {
  id: string;
  label: string;
  title?: string;
  description?: string;
  nodeType: FdOrgNode["nodeType"];
  sourceStatus: FdOrgNode["sourceStatus"];
  acting: boolean;
  children: PrintNode[];
  synthetic?: boolean;
  width: number;
  height: number;
};

type LayoutNode = {
  id: string;
  label: string;
  title?: string;
  description?: string;
  nodeType: FdOrgNode["nodeType"];
  sourceStatus: FdOrgNode["sourceStatus"];
  acting: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
};

type LayoutLink = {
  sourceId: string;
  targetId: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

type ChartLayout = {
  nodes: LayoutNode[];
  links: LayoutLink[];
  width: number;
  height: number;
};

const CARD_WIDTH = 232;
const MIN_CARD_HEIGHT = 92;
const HORIZONTAL_GAP = 48;
const VERTICAL_GAP = 88;
const PADDING = 32;

function toPrintNode(tree: FdOrgTree, nodeId: string): PrintNode | null {
  const node = tree.nodesById[nodeId];
  if (!node) return null;
  const title = node.title ?? node.description;
  const detailLines = [
    title,
    FD_ORG_NODE_TYPE_LABELS[node.nodeType],
    FD_ORG_SOURCE_STATUS_LABELS[node.sourceStatus],
    node.actingMeta ? "Acting assignment" : undefined,
  ].filter(Boolean);
  const height = Math.max(MIN_CARD_HEIGHT, 56 + detailLines.length * 16);

  return {
    id: node.id,
    label: node.label,
    title: node.title,
    description: node.description,
    nodeType: node.nodeType,
    sourceStatus: node.sourceStatus,
    acting: node.actingMeta !== undefined,
    children: node.childrenIds
      .map((childId) => toPrintNode(tree, childId))
      .filter((child): child is PrintNode => Boolean(child)),
    width: CARD_WIDTH,
    height,
  };
}

function buildPrintTree(
  tree: FdOrgTree,
  scope: FdOrgPrintScope,
  selectedNodeId?: string,
): PrintNode | null {
  if (scope === "selected-branch" && selectedNodeId) {
    return toPrintNode(tree, selectedNodeId);
  }

  const roots = tree.rootIds
    .map((rootId) => toPrintNode(tree, rootId))
    .filter((node): node is PrintNode => Boolean(node));

  if (roots.length === 0) return null;
  if (roots.length === 1) return roots[0];

  return {
    id: "__fd-org-print-root",
    label: "Organization",
    nodeType: "unit",
    sourceStatus: "official",
    acting: false,
    children: roots,
    synthetic: true,
    width: 1,
    height: 1,
  };
}

export function layoutOrgPrintChart(
  tree: FdOrgTree,
  scope: FdOrgPrintScope = "selected-branch",
  selectedNodeId?: string,
): ChartLayout | null {
  const rootData = buildPrintTree(tree, scope, selectedNodeId);
  if (!rootData) return null;

  const root = hierarchy(rootData, (node) => node.children);
  const layout = d3Tree<PrintNode>()
    .nodeSize([CARD_WIDTH + HORIZONTAL_GAP, MIN_CARD_HEIGHT + VERTICAL_GAP])
    .separation((a, b) => (a.parent === b.parent ? 1 : 1.35));
  const laidOutRoot = layout(root);

  const visible = laidOutRoot.descendants().filter((node) => !node.data.synthetic);
  if (visible.length === 0) return null;

  const minX = Math.min(...visible.map((node) => node.x - node.data.width / 2));
  const minY = Math.min(...visible.map((node) => node.y));
  const maxX = Math.max(...visible.map((node) => node.x + node.data.width / 2));
  const maxY = Math.max(...visible.map((node) => node.y + node.data.height));
  const offsetX = PADDING - minX;
  const offsetY = PADDING - minY;

  const positionFor = (node: HierarchyPointNode<PrintNode>) => ({
    x: node.x + offsetX,
    y: node.y + offsetY,
  });

  const nodes: LayoutNode[] = visible.map((node) => {
    const position = positionFor(node);
    return {
      id: node.data.id,
      label: node.data.label,
      title: node.data.title,
      description: node.data.description,
      nodeType: node.data.nodeType,
      sourceStatus: node.data.sourceStatus,
      acting: node.data.acting,
      x: position.x,
      y: position.y,
      width: node.data.width,
      height: node.data.height,
    };
  });

  const links = laidOutRoot
    .links()
    .filter((link) => !link.source.data.synthetic && !link.target.data.synthetic)
    .map((link) => {
      const source = positionFor(link.source);
      const target = positionFor(link.target);
      return {
        sourceId: link.source.data.id,
        targetId: link.target.data.id,
        sourceX: source.x,
        sourceY: source.y + link.source.data.height,
        targetX: target.x,
        targetY: target.y,
      };
    });

  return {
    nodes,
    links,
    width: maxX - minX + PADDING * 2,
    height: maxY - minY + PADDING * 2,
  };
}

function truncate(value: string | undefined, maxLength: number) {
  if (!value) return "";
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}...` : value;
}

/**
 * Internal print-only chart renderer for org chart prototypes. It is not part
 * of the public component inventory and should stay behind composed stories or
 * future adapter work until the visual chart boundary is intentionally opened.
 */
export class FdOrgPrintChart extends LitElement {
  static properties = {
    tree: { attribute: false },
    scope: { reflect: true },
    selectedNodeId: { attribute: "selected-node-id", reflect: true },
    heading: { reflect: true },
    generatedOn: { attribute: "generated-on", reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      color: var(--fdic-color-text-primary, #111827);
      font-family: var(--fdic-font-family-sans-serif, "Source Sans 3", sans-serif);
    }

    figure {
      margin: 0;
    }

    figcaption {
      display: grid;
      gap: var(--fdic-spacing-2xs, 4px);
      margin-block-end: var(--fdic-spacing-md, 16px);
    }

    h2 {
      margin: 0;
      font-size: var(--fdic-font-size-h4, 1.125rem);
      line-height: 1.2;
    }

    p {
      margin: 0;
      color: var(--fdic-color-text-secondary, #555);
      font-size: var(--fdic-font-size-body-smaller, 0.8125rem);
    }

    .chart-wrap {
      max-inline-size: 100%;
      overflow: auto;
      padding: var(--fdic-spacing-sm, 12px);
      border: 1px solid var(--fdic-color-border-subtle, #d6d7d9);
      border-radius: var(--fdic-corner-radius-md, 6px);
      background: var(--fdic-color-bg-surface, #fff);
    }

    svg {
      display: block;
      inline-size: 100%;
      min-inline-size: min(48rem, 100%);
      block-size: auto;
    }

    .fallback {
      padding: var(--fdic-spacing-md, 16px);
      border: 1px solid var(--fdic-color-border-subtle, #d6d7d9);
      border-radius: var(--fdic-corner-radius-md, 6px);
      background: var(--fdic-color-bg-subtle, #f8f8f8);
    }

    @media print {
      .chart-wrap {
        overflow: visible;
        padding: 0;
        border: 0;
        background: transparent;
      }

      svg {
        inline-size: 100%;
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }

      h2 {
        font-size: 14pt;
      }

      p {
        font-size: 8pt;
      }
    }
  `;

  declare tree?: FdOrgTree;
  declare scope: FdOrgPrintScope;
  declare selectedNodeId?: string;
  declare heading: string;
  declare generatedOn: string;

  constructor() {
    super();
    this.scope = "selected-branch";
    this.heading = "Organization chart";
    this.generatedOn = new Date().toISOString().slice(0, 10);
  }

  render() {
    if (!this.tree) return nothing;
    const decision = printDecision(this.tree, this.scope, this.selectedNodeId, {
      visualChartAvailable: true,
    });

    if (decision.mode !== "chart") {
      return html`
        <section class="fallback" part="fallback">
          <p>${decision.reason}</p>
        </section>
      `;
    }

    const layout = layoutOrgPrintChart(this.tree, this.scope, this.selectedNodeId);
    if (!layout) return nothing;

    return html`
      <figure part="figure">
        <figcaption>
          <h2>${this.heading}</h2>
          <p>
            ${decision.metrics.nodeCount} records · ${decision.metrics.maxDepth} levels · generated
            ${this.generatedOn}
          </p>
        </figcaption>
        <div class="chart-wrap">
          <svg
            part="chart"
            role="img"
            aria-labelledby="print-chart-title print-chart-desc"
            viewBox="0 0 ${layout.width} ${layout.height}"
          >
            <title id="print-chart-title">${this.heading}</title>
            <desc id="print-chart-desc">
              Printable organization chart for ${decision.metrics.nodeCount} records.
            </desc>
            <g class="links" fill="none" stroke="#8a8f98" stroke-width="1.5">
              ${layout.links.map((link) => this.renderLink(link))}
            </g>
            <g class="nodes">${layout.nodes.map((node) => this.renderNode(node))}</g>
          </svg>
        </div>
      </figure>
    `;
  }

  private renderLink(link: LayoutLink) {
    const midY = link.sourceY + (link.targetY - link.sourceY) / 2;
    return svg`
      <path
        part="connector"
        d="M ${link.sourceX} ${link.sourceY} V ${midY} H ${link.targetX} V ${link.targetY}"
      ></path>
    `;
  }

  private renderNode(node: LayoutNode) {
    const x = node.x - node.width / 2;
    const y = node.y;
    const status = FD_ORG_SOURCE_STATUS_LABELS[node.sourceStatus];
    const nodeType = FD_ORG_NODE_TYPE_LABELS[node.nodeType];
    const accent =
      node.sourceStatus === "override"
        ? "#8a5a00"
        : node.sourceStatus === "draft"
          ? "#2f5f9f"
          : node.sourceStatus === "historical"
            ? "#5c5f66"
            : "#246b47";
    const issueLabel = node.acting ? "Acting" : status;

    return svg`
      <g part="node" data-node-id=${node.id}>
        <rect
          x=${x}
          y=${y}
          width=${node.width}
          height=${node.height}
          rx="6"
          fill="#ffffff"
          stroke="#aeb4bf"
          stroke-width="1"
        ></rect>
        <rect
          x=${x}
          y=${y}
          width=${node.width}
          height="5"
          rx="6"
          fill=${accent}
        ></rect>
        <text x=${x + 16} y=${y + 28} fill="#111827" font-size="13" font-weight="700">
          ${truncate(node.label, 28)}
        </text>
        ${
          node.title
            ? svg`
                <text x=${x + 16} y=${y + 48} fill="#4b5563" font-size="10.5">
                  ${truncate(node.title, 34)}
                </text>
              `
            : nothing
        }
        <text x=${x + 16} y=${y + node.height - 18} fill="#4b5563" font-size="9.5">
          ${nodeType}
        </text>
        <rect
          x=${x + node.width - 92}
          y=${y + node.height - 33}
          width="76"
          height="20"
          rx="10"
          fill="#f3f4f6"
          stroke="#9ca3af"
        ></rect>
        <text
          x=${x + node.width - 54}
          y=${y + node.height - 19}
          fill="#111827"
          font-size="8.5"
          text-anchor="middle"
          font-weight="700"
        >
          ${truncate(issueLabel, 12)}
        </text>
      </g>
    `;
  }
}
