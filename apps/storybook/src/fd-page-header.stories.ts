import type { FdPageHeaderBreadcrumb } from "@fdic-ds/components";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "@fdic-ds/components/register-all";
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
    heading: "Deposit Insurance",
    breadcrumbs: sampleBreadcrumbs,
    showActions: false,
  },
  render: (args: PageHeaderArgs) => html`
    <fd-page-header
      heading=${args.heading}
      kicker=${args.kicker || ""}
      breadcrumb-label=${args.breadcrumbLabel || "Breadcrumbs"}
      .breadcrumbs=${args.breadcrumbs}
    >
      ${args.showActions
        ? html`<fd-button slot="actions" variant="outline" size="small"
            >Print</fd-button
          >`
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
    breadcrumbs: sampleBreadcrumbs,
    kicker: "",
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
    heading: "How Deposit Insurance Works",
    kicker: "Consumer Resources",
    breadcrumbs: [
      { label: "Home", href: "#" },
      { label: "Resources", href: "#" },
      { label: "Deposit Insurance", href: "#" },
      { label: "How Deposit Insurance Works", href: "#" },
    ],
    showActions: true,
  },
};
