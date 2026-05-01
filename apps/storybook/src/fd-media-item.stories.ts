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
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_CLASS,
  DOCS_OVERVIEW_SPACIOUS_STACK_CLASS,
} from "./docs-overview";

type MediaItemArgs = {
  heading: string;
  href?: string;
  target?: string;
  rel?: string;
  metadata: string;
  imageSrc?: string;
  imageAlt: string;
};

const renderMediaItem = (args: MediaItemArgs) => html`
  <div style="inline-size:min(100%, 366px);">
    <fd-media-item
      heading=${args.heading}
      href=${ifDefined(args.href)}
      target=${ifDefined(args.target)}
      rel=${ifDefined(args.rel)}
      metadata=${args.metadata}
      image-src=${ifDefined(args.imageSrc)}
      image-alt=${args.imageAlt}
    ></fd-media-item>
  </div>
`;

const meta = {
  title: "Components/Media Item",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "A compact multimedia resource summary with a thumbnail, native media link, and supporting metadata.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-media-item"),
  },
  args: {
    ...getComponentArgs("fd-media-item"),
    heading: "Safeguarding Customer Credit Card Data: PCI Compliance",
    href: "https://www.fdic.gov/resources/bankers/information-technology/",
    target: undefined,
    rel: undefined,
    metadata: "1h 3m  ·  Beginner  ·  2 months ago",
    imageSrc: pciCompliance,
    imageAlt: "Illustration of a protected credit card transaction.",
  },
  render: renderMediaItem,
} satisfies Meta<MediaItemArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const item = canvasElement.querySelector("fd-media-item");
  const image = item?.shadowRoot?.querySelector<HTMLImageElement>("[part=image]");
  const link = item?.shadowRoot?.querySelector<HTMLAnchorElement>(".title-link");

  expect(item?.getAttribute("tabindex")).toBeNull();
  expect(image?.getAttribute("alt")).toBe("");
  expect(link?.querySelector("[part=media]")).toBe(image?.parentElement);
  expect(link?.getAttribute("href")).toContain("fdic.gov");
  expect(link?.textContent).toContain("PCI Compliance");
};

export const TextOnly: Story = {
  args: {
    href: undefined,
    imageSrc: undefined,
    imageAlt: "",
    metadata: "Updated Oct 2023",
    heading: "FDIC failed bank exercise",
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div class=${DOCS_OVERVIEW_SPACIOUS_STACK_CLASS}>
      <section class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Linked media item</strong>
        ${renderMediaItem({
          heading: "Safeguarding Customer Credit Card Data: PCI Compliance",
          href: "https://www.fdic.gov/resources/bankers/information-technology/",
          metadata: "1h 3m  ·  Beginner  ·  2 months ago",
          imageSrc: pciCompliance,
          imageAlt: "Illustration of a protected credit card transaction.",
        })}
      </section>
    </div>
  `,
};
