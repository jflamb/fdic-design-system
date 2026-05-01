import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "@jflamb/fdic-ds-components/register-all";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";
import socialGraphic from "./assets/social-media/unbanked-hispanic-households.png";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_CLASS,
  DOCS_OVERVIEW_SPACIOUS_STACK_CLASS,
} from "./docs-overview";

type SocialMediaItemArgs = {
  timestamp: string;
  imageSrc?: string;
  imageAlt: string;
  platforms: string[];
};

const PLATFORM_OPTIONS = [
  "facebook",
  "youtube",
  "instagram",
  "x",
  "reddit",
  "linkedin",
  "threads",
] as const;

const renderSocialMediaItem = (args: SocialMediaItemArgs) => html`
  <div style="inline-size:min(100%, 368px);">
    <fd-social-media-item
      timestamp=${args.timestamp}
      image-src=${ifDefined(args.imageSrc)}
      image-alt=${args.imageAlt}
      .platforms=${args.platforms}
    >
      <span
        >Did you know that unbanked Hispanic households were more likely to rely on
        cash to meet their financial needs, which carries the risk of theft and
        loss? Our latest research explores these findings </span
      ><a href="https://www.fdic.gov/analysis/household-survey">https://fdic.gov/household-survey</a><span>.</span>
    </fd-social-media-item>
  </div>
`;

const meta = {
  title: "Components/Social Media Item",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "A static social post summary with representative media, authored body content, and platform attribution.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-social-media-item"),
    platforms: {
      control: "check",
      options: PLATFORM_OPTIONS,
    },
  },
  args: {
    ...getComponentArgs("fd-social-media-item"),
    timestamp: "Aug. 26, 2024 · 9:25 AM",
    imageSrc: socialGraphic,
    imageAlt:
      "Graphic stating that 75 percent of unbanked Hispanic households rely on cash.",
    platforms: ["facebook", "youtube", "instagram", "x", "reddit", "linkedin", "threads"],
  },
  render: renderSocialMediaItem,
} satisfies Meta<SocialMediaItemArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const item = canvasElement.querySelector("fd-social-media-item");
  const image = item?.shadowRoot?.querySelector<HTMLImageElement>("[part=image]");
  const platformItems = item?.shadowRoot?.querySelectorAll("[part=platform-item]");

  expect(item?.getAttribute("tabindex")).toBeNull();
  expect(image?.getAttribute("alt")).toContain("75 percent");
  expect(platformItems).toHaveLength(7);
};

export const TextOnly: Story = {
  args: {
    imageSrc: undefined,
    imageAlt: "",
    platforms: ["linkedin", "x"],
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div class=${DOCS_OVERVIEW_SPACIOUS_STACK_CLASS}>
      <section class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Static item</strong>
        ${renderSocialMediaItem({
          timestamp: "Aug. 26, 2024 · 9:25 AM",
          imageSrc: socialGraphic,
          imageAlt:
            "Graphic stating that 75 percent of unbanked Hispanic households rely on cash.",
          platforms: [
            "facebook",
            "youtube",
            "instagram",
            "x",
            "reddit",
            "linkedin",
            "threads",
          ],
        })}
      </section>
    </div>
  `,
};
