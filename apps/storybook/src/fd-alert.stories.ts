import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn } from "storybook/test";
import "@fdic-ds/components/register-all";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_SPACIOUS_STACK_STYLE,
} from "./docs-overview";

type AlertArgs = {
  variant: "default" | "slim" | "site";
  type: "info" | "success" | "warning" | "error" | "emergency";
  title: string;
  dismissible: boolean;
  dismissLabel: string;
  live: "off" | "polite" | "assertive";
  body: string;
  linkText: string;
  linkHref: string;
  onDismiss?: () => void;
};

const DEFAULT_BODY =
  "Review the updated submission guidance before you continue.";

const ALERT_FRAME_STYLE =
  "display: grid; gap: var(--fdic-spacing-md, 1rem); max-width: 46rem;";

const SITE_FRAME_STYLE =
  "display: block; background: var(--fdic-background-subtle, #f5f5f7); padding: 0 0 2rem;";

const renderAlert = (args: AlertArgs) => {
  const content = html`
    <fd-alert
      variant=${args.variant}
      type=${args.type}
      title=${ifDefined(args.title || undefined)}
      ?dismissible=${args.dismissible}
      dismiss-label=${ifDefined(args.dismissLabel || undefined)}
      live=${args.live}
      @fd-alert-dismiss=${args.onDismiss}
    >
      ${args.body}
      ${args.linkText && args.linkHref
        ? html` <a href=${args.linkHref}>${args.linkText}</a>`
        : nothing}
    </fd-alert>
  `;

  if (args.variant === "site") {
    return html`
      <div style=${SITE_FRAME_STYLE}>
        ${content}
        <div style="max-width: 46rem; margin: 0 auto; padding: 1.5rem 1.25rem 0;">
          <p style="margin: 0; font: inherit; color: #595961;">
            Example page content continues below the site-level alert.
          </p>
        </div>
      </div>
    `;
  }

  return html`<div style=${ALERT_FRAME_STYLE}>${content}</div>`;
};

const meta = {
  title: "Components/Alert",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-alert"),
    variant: {
      control: "select",
      options: ["default", "slim", "site"],
    },
    type: {
      control: "select",
      options: ["info", "success", "warning", "error", "emergency"],
    },
    title: { control: "text" },
    dismissLabel: { control: "text", name: "dismiss-label" },
    live: {
      control: "select",
      options: ["off", "polite", "assertive"],
    },
    body: { control: "text" },
    linkText: { control: "text" },
    linkHref: { control: "text" },
    onDismiss: { action: "fd-alert-dismiss", table: { disable: true } },
  },
  args: {
    ...getComponentArgs("fd-alert"),
    variant: "default",
    type: "info",
    title: "System update",
    dismissible: false,
    dismissLabel: "",
    live: "off",
    body: DEFAULT_BODY,
    linkText: "Read the guidance.",
    linkHref: "https://www.fdic.gov",
    onDismiss: fn(),
  },
  render: renderAlert,
} satisfies Meta<AlertArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-alert") as HTMLElement | null;
  const base = host?.shadowRoot?.querySelector("[part=base]") as HTMLElement | null;

  expect(host).toBeDefined();
  expect(base?.className).toContain("variant-default");
  expect(base?.getAttribute("role")).toBeNull();
};

export const Default: Story = {
  args: {
    title: "System update",
    body: "Review the updated submission guidance before you continue.",
    linkText: "Read the guidance.",
    linkHref: "https://www.fdic.gov",
  },
};

export const Dismissible: Story = {
  args: {
    title: "Document checklist changed",
    body: "The annual certification checklist now includes a signed officer attestation.",
    dismissible: true,
    linkText: "",
    linkHref: "",
  },
};

Dismissible.play = async ({ canvasElement, args }) => {
  const host = canvasElement.querySelector("fd-alert") as HTMLElement | null;
  const dismissButton = host?.shadowRoot?.querySelector(
    "[part=dismiss-button]",
  ) as HTMLButtonElement | null;

  dismissButton?.click();

  expect(dismissButton?.getAttribute("aria-label")).toBe(
    "Dismiss Document checklist changed",
  );
  expect(args.onDismiss).toHaveBeenCalled();
};

export const Slim: Story = {
  args: {
    variant: "slim",
    title: "",
    type: "warning",
    body: "Your session will expire in 2 minutes unless you save your work.",
    dismissible: true,
    linkText: "",
    linkHref: "",
  },
};

export const SiteLevel: Story = {
  args: {
    variant: "site",
    type: "info",
    title: "Planned maintenance",
    body: "Online filing services will be unavailable from 8 to 10 p.m. Eastern time.",
    dismissible: true,
    linkText: "View status updates.",
    linkHref: "https://www.fdic.gov",
  },
};

SiteLevel.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-alert") as HTMLElement | null;
  const base = host?.shadowRoot?.querySelector("[part=base]") as HTMLElement | null;

  expect(base?.tagName).toBe("SECTION");
  expect(base?.getAttribute("aria-label")).toBeNull();
};

export const LiveAssertive: Story = {
  args: {
    type: "error",
    title: "Submission failed",
    live: "assertive",
    body: "Fix the highlighted errors before you resubmit the filing.",
    linkText: "Review the error summary.",
    linkHref: "https://www.fdic.gov",
  },
};

LiveAssertive.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-alert") as HTMLElement | null;
  const base = host?.shadowRoot?.querySelector("[part=base]") as HTMLElement | null;

  expect(base?.getAttribute("role")).toBe("alert");
  expect(base?.getAttribute("aria-atomic")).toBe("true");
};

export const Emergency: Story = {
  args: {
    type: "emergency",
    title: "Emergency closure",
    body: "Branch access is temporarily suspended while staff resolve an active safety incident.",
    dismissible: true,
    linkText: "Get service alternatives.",
    linkHref: "https://www.fdic.gov",
  },
};

export const AllSeverities: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <fd-alert type="info" title="Information">
        Review the updated application instructions before you continue.
      </fd-alert>
      <fd-alert type="success" title="Application received">
        We received your filing and emailed a confirmation to the address on
        record.
      </fd-alert>
      <fd-alert type="warning" title="Missing attachment">
        Upload the signed letter before 5 p.m. Eastern time to avoid delay.
      </fd-alert>
      <fd-alert type="error" title="Submission failed">
        Fix the highlighted errors before you resubmit the filing.
      </fd-alert>
      <fd-alert type="emergency" title="Emergency closure">
        Branch access is temporarily suspended while staff resolve an active
        safety incident.
      </fd-alert>
    </div>
  `,
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Default</p>
        <fd-alert title="System update">
          Review the updated submission guidance before you continue.
          <a href="https://www.fdic.gov">Read the guidance.</a>
        </fd-alert>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Slim</p>
        <fd-alert variant="slim" type="warning" dismissible>
          Your session will expire in 2 minutes unless you save your work.
        </fd-alert>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Site-level</p>
        <div style=${SITE_FRAME_STYLE}>
          <fd-alert
            variant="site"
            type="info"
            title="Planned maintenance"
            dismissible
          >
            Online filing services will be unavailable from 8 to 10 p.m.
            Eastern time.
            <a href="https://www.fdic.gov">View status updates.</a>
          </fd-alert>
        </div>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Emergency</p>
        <fd-alert type="emergency" title="Emergency closure" dismissible>
          Branch access is temporarily suspended while staff resolve an active
          safety incident.
          <a href="https://www.fdic.gov">Get service alternatives.</a>
        </fd-alert>
      </div>
    </div>
  `,
};
