import type { FdPageHeaderBreadcrumb } from "@jflamb/fdic-ds-components";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect } from "storybook/test";
import "@jflamb/fdic-ds-components/register-all";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";

type PageHeaderArgs = {
  heading: string;
  kicker: string;
  breadcrumbs: FdPageHeaderBreadcrumb[];
  breadcrumbLabel: string;
  showActions: boolean;
};

const sampleBreadcrumbs: FdPageHeaderBreadcrumb[] = [
  { label: "Home", href: "#" },
  { label: "Consumer Resources", href: "#" },
  { label: "Deposit Insurance", href: "#" },
];

const meta = {
  title: "Components/Page Header",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-page-header"),
    showActions: {
      name: "Show actions slot",
      control: "boolean",
      description: "Toggle the actions slot for demonstration.",
      table: { category: "Story controls" },
    },
  },
  args: {
    ...getComponentArgs("fd-page-header"),
    heading: "Workplace & Technology",
    kicker:
      "Navigate tools and services for a productive work environment",
    breadcrumbs: sampleBreadcrumbs,
    showActions: true,
  },
  render: (args: PageHeaderArgs) => html`
    <fd-page-header
      heading=${args.heading}
      kicker=${args.kicker || ""}
      breadcrumb-label=${args.breadcrumbLabel || "Breadcrumbs"}
      .breadcrumbs=${args.breadcrumbs}
    >
      ${args.showActions
        ? html`
            <fd-button-group slot="actions" label="Page actions">
              <fd-button variant="subtle">
                <fd-icon slot="icon-start" name="share-fat"></fd-icon>
                Share
              </fd-button>
              <fd-button variant="subtle">
                <fd-icon slot="icon-start" name="plus"></fd-icon>
                Add to Quick Links
              </fd-button>
            </fd-button-group>
          `
        : ""}
    </fd-page-header>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Default: Story = {
  name: "Default",
  args: {
    heading: "Deposit Insurance",
    kicker: "",
    breadcrumbs: sampleBreadcrumbs,
    showActions: false,
  },
};

export const WithKicker: Story = {
  name: "With kicker",
  args: {
    heading: "Deposit Insurance FAQ",
    kicker: "Consumer Resources",
    breadcrumbs: sampleBreadcrumbs,
    showActions: false,
  },
};

export const WithActions: Story = {
  name: "With actions",
  args: {
    heading: "Quarterly Banking Profile",
    kicker: "Analysis",
    breadcrumbs: [
      { label: "Home", href: "#" },
      { label: "Analysis", href: "#" },
      { label: "Quarterly Banking Profile", href: "#" },
    ],
    showActions: true,
  },
};

WithActions.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-page-header") as HTMLElement | null;
  const breadcrumbs = host?.shadowRoot?.querySelector('[part="breadcrumbs"]');
  const breadcrumbLinks = host?.shadowRoot?.querySelectorAll(".breadcrumb-link") ?? [];
  const actions = host?.shadowRoot?.querySelector('[part="actions"]');
  const actionGroup = host?.querySelector('[slot="actions"]');

  expect(breadcrumbs).toBeDefined();
  expect(breadcrumbLinks.length).toBeGreaterThan(0);
  expect(actions?.classList.contains("actions-hidden")).toBe(false);
  expect(actionGroup?.tagName.toLowerCase()).toBe("fd-button-group");
};

export const MinimalTitle: Story = {
  name: "Title only",
  args: {
    heading: "Home",
    kicker: "",
    breadcrumbs: [],
    showActions: false,
  },
};

export const FullHeader: Story = {
  name: "Full header",
  args: {
    heading: "Workplace & Technology",
    kicker:
      "Navigate tools and services for a productive work environment",
    breadcrumbs: [
      { label: "Home", href: "#" },
      { label: "Resources", href: "#" },
      { label: "Workplace & Technology", href: "#" },
    ],
    showActions: true,
  },
};
