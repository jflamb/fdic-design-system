import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "@jflamb/fdic-ds-components/register-all";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";
import pciCompliance from "./assets/media-item/pci-compliance.png";
import failedBankExercise from "./assets/media-item/failed-bank-exercise.png";
import customerData from "./assets/media-item/customer-data.png";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_CLASS,
  DOCS_OVERVIEW_SPACIOUS_STACK_CLASS,
} from "./docs-overview";

type MediaListArgs = {
  columns: "2" | "3" | "4";
  label?: string;
};

const renderItem = ({
  heading,
  href,
  metadata,
  imageSrc,
  imageAlt,
}: {
  heading: string;
  href: string;
  metadata: string;
  imageSrc: string;
  imageAlt: string;
}) => html`
  <fd-media-item
    heading=${heading}
    href=${href}
    metadata=${metadata}
    image-src=${imageSrc}
    image-alt=${imageAlt}
  ></fd-media-item>
`;

const renderMediaList = (args: MediaListArgs) => html`
  <fd-media-list columns=${args.columns} label=${ifDefined(args.label)}>
    ${renderItem({
      heading: "Safeguarding Customer Credit Card Data: PCI Compliance",
      href: "https://www.fdic.gov/resources/bankers/information-technology/",
      metadata: "1h 3m  ·  Beginner  ·  2 months ago",
      imageSrc: pciCompliance,
      imageAlt: "Illustration of a protected credit card transaction.",
    })}
    ${renderItem({
      heading: "FDIC failed bank exercise",
      href: "https://www.fdic.gov/resources/resolutions/bank-failures/",
      metadata: "1m 23s  ·  Updated Oct 2023",
      imageSrc: failedBankExercise,
      imageAlt: "Illustration of a person reviewing charts and data screens.",
    })}
    ${renderItem({
      heading: "Examining bank customer data",
      href: "https://www.fdic.gov/analysis/",
      metadata: "5m 56s  ·  Updated Sep 2023",
      imageSrc: customerData,
      imageAlt: "Illustration of a person presenting charts beside a laptop.",
    })}
  </fd-media-list>
`;

const meta = {
  title: "Components/Media List",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "A responsive list container for direct media item children.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-media-list"),
  },
  args: {
    ...getComponentArgs("fd-media-list"),
    columns: "3",
    label: "Training videos",
  },
  render: renderMediaList,
} satisfies Meta<MediaListArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const list = canvasElement.querySelector("fd-media-list");
  const base = list?.shadowRoot?.querySelector("[part=base]");
  const items = list?.querySelectorAll("fd-media-item") ?? [];

  expect(base?.getAttribute("role")).toBe("list");
  expect(items).toHaveLength(3);
  expect(items[0]?.getAttribute("role")).toBe("listitem");
};

export const TwoColumns: Story = {
  args: {
    columns: "2",
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div class=${DOCS_OVERVIEW_SPACIOUS_STACK_CLASS}>
      <section class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Responsive media list</strong>
        ${renderMediaList({
          columns: "3",
          label: "Training videos",
        })}
      </section>
    </div>
  `,
};
