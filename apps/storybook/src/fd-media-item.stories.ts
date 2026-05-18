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
  mediaType: string;
  duration?: string;
  durationLabel: string;
  level: string;
  publishedDate?: string;
  publishedLabel: string;
  updatedDate?: string;
  updatedLabel: string;
  captionsLabel: string;
  transcriptHref?: string;
  transcriptLabel: string;
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
      media-type=${ifDefined(args.mediaType || undefined)}
      duration=${ifDefined(args.duration)}
      duration-label=${ifDefined(args.durationLabel || undefined)}
      level=${ifDefined(args.level || undefined)}
      published-date=${ifDefined(args.publishedDate)}
      published-label=${ifDefined(args.publishedLabel || undefined)}
      updated-date=${ifDefined(args.updatedDate)}
      updated-label=${ifDefined(args.updatedLabel || undefined)}
      captions-label=${ifDefined(args.captionsLabel || undefined)}
      transcript-href=${ifDefined(args.transcriptHref)}
      transcript-label=${ifDefined(args.transcriptLabel || undefined)}
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
    mediaType: "",
    duration: undefined,
    durationLabel: "",
    level: "",
    publishedDate: undefined,
    publishedLabel: "",
    updatedDate: undefined,
    updatedLabel: "",
    captionsLabel: "",
    transcriptHref: undefined,
    transcriptLabel: "",
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

export const StructuredMetadata: Story = {
  args: {
    metadata: "",
    mediaType: "Video",
    duration: "PT1H3M",
    durationLabel: "1h 3m",
    level: "Beginner",
    updatedDate: "2023-10-01",
    updatedLabel: "Updated Oct 2023",
    captionsLabel: "Captions available",
    transcriptHref: "/resources/bankers/information-technology/transcript/",
    transcriptLabel: "Transcript",
  },
};

StructuredMetadata.play = async ({ canvasElement }) => {
  const item = canvasElement.querySelector("fd-media-item");
  const metadataItems =
    item?.shadowRoot?.querySelectorAll("[part~='metadata-item']") ?? [];
  const duration = item?.shadowRoot?.querySelector<HTMLDataElement>("data");
  const updated = item?.shadowRoot?.querySelector<HTMLTimeElement>("time");
  const transcript =
    item?.shadowRoot?.querySelector<HTMLAnchorElement>("[part~='transcript-link']");

  expect([...metadataItems].map((entry) => entry.textContent?.trim())).toEqual([
    "Video",
    "1h 3m",
    "Beginner",
    "Captions available",
    "Updated Oct 2023",
    "Transcript",
  ]);
  expect(duration?.getAttribute("value")).toBe("PT1H3M");
  expect(updated?.getAttribute("datetime")).toBe("2023-10-01");
  expect(transcript?.getAttribute("aria-label")).toContain("Transcript for");
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
          mediaType: "",
          duration: undefined,
          durationLabel: "",
          level: "",
          publishedDate: undefined,
          publishedLabel: "",
          updatedDate: undefined,
          updatedLabel: "",
          captionsLabel: "",
          transcriptHref: undefined,
          transcriptLabel: "",
          imageSrc: pciCompliance,
          imageAlt: "Illustration of a protected credit card transaction.",
        })}
      </section>
    </div>
  `,
};
