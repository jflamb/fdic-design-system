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
import bankingAct from "./assets/social-media/banking-act.png";
import officeHours from "./assets/social-media/office-hours.png";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_CLASS,
  DOCS_OVERVIEW_SPACIOUS_STACK_CLASS,
} from "./docs-overview";

type SocialMediaListArgs = {
  columns: "2" | "3" | "4";
  label?: string;
};

const renderItem = ({
  timestamp,
  imageSrc,
  imageAlt,
  platforms,
  body,
}: {
  timestamp: string;
  imageSrc: string;
  imageAlt: string;
  platforms: string[];
  body: unknown;
}) => html`
  <fd-social-media-item
    timestamp=${timestamp}
    image-src=${imageSrc}
    image-alt=${imageAlt}
    .platforms=${platforms}
  >
    ${body}
  </fd-social-media-item>
`;

const renderSocialMediaList = (args: SocialMediaListArgs) => html`
  <fd-social-media-list columns=${args.columns} label=${ifDefined(args.label)}>
    ${renderItem({
      timestamp: "Aug. 26, 2024 · 9:25 AM",
      imageSrc: socialGraphic,
      imageAlt:
        "Graphic stating that 75 percent of unbanked Hispanic households rely on cash.",
      platforms: ["facebook", "youtube", "instagram", "x", "reddit", "linkedin", "threads"],
      body: html`<span
          >Did you know that unbanked Hispanic households were more likely to rely on
          cash to meet their financial needs, which carries the risk of theft and loss?
          Our latest research explores these findings </span
        ><a href="https://www.fdic.gov/analysis/household-survey">https://fdic.gov/household-survey</a><span>.</span>`,
    })}
    ${renderItem({
      timestamp: "Aug. 26, 2024 · 9:25 AM",
      imageSrc: bankingAct,
      imageAlt:
        "Historical black-and-white photo of President Franklin Roosevelt signing the Banking Act.",
      platforms: ["instagram", "x", "linkedin"],
      body: html`<a href="https://www.fdic.gov/history">#OnThisDay</a><span>
          in 1935, President Franklin Roosevelt signed the Banking Act into law and
          made the FDIC a permanent part of the financial system.</span
        >`,
    })}
    ${renderItem({
      timestamp: "Aug. 23, 2024 · 1:25 PM",
      imageSrc: officeHours,
      imageAlt:
        "Blue virtual event graphic for an Office Hours Session on diversity self-assessment.",
      platforms: ["instagram", "x", "linkedin"],
      body: html`<span
          >Calling all bankers at FDIC-supervised banks. Join us for office hours
          on completing the voluntary self-assessment of diversity policies and
          practices. </span
        ><a href="https://www.fdic.gov">Learn more</a><span>.</span>`,
    })}
  </fd-social-media-list>
`;

const meta = {
  title: "Components/Social Media List",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "A responsive list container for direct social media item children.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-social-media-list"),
  },
  args: {
    ...getComponentArgs("fd-social-media-list"),
    columns: "3",
    label: "Recent FDIC social posts",
  },
  render: renderSocialMediaList,
} satisfies Meta<SocialMediaListArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const list = canvasElement.querySelector("fd-social-media-list");
  const base = list?.shadowRoot?.querySelector("[part=base]");
  const items = list?.querySelectorAll("fd-social-media-item") ?? [];

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
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Responsive social media list</strong>
        ${renderSocialMediaList({
          columns: "3",
          label: "Recent FDIC social posts",
        })}
      </section>
    </div>
  `,
};
