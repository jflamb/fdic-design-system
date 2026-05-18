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
  datetime?: string;
  imageSrc?: string;
  imageAlt: string;
  platforms: string[];
  facebookHref?: string;
  youtubeHref?: string;
  instagramHref?: string;
  xHref?: string;
  redditHref?: string;
  linkedinHref?: string;
  threadsHref?: string;
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
  <div style="inline-size:min(100%, 320px);">
    <fd-social-media-item
      timestamp=${args.timestamp}
      datetime=${ifDefined(args.datetime)}
      image-src=${ifDefined(args.imageSrc)}
      image-alt=${args.imageAlt}
      facebook-href=${ifDefined(args.facebookHref)}
      youtube-href=${ifDefined(args.youtubeHref)}
      instagram-href=${ifDefined(args.instagramHref)}
      x-href=${ifDefined(args.xHref)}
      reddit-href=${ifDefined(args.redditHref)}
      linkedin-href=${ifDefined(args.linkedinHref)}
      threads-href=${ifDefined(args.threadsHref)}
      .platforms=${args.platforms}
    >
      <p>
        Did you know that unbanked Hispanic households were more likely to rely on
        cash to meet their financial needs, which carries the risk of theft and
        loss? Our latest research explores these findings.
      </p>
      <p>
        <a href="https://www.fdic.gov/analysis/household-survey">https://fdic.gov/household-survey</a>
      </p>
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
    datetime: "2024-08-26T09:25:00-04:00",
    imageSrc: socialGraphic,
    imageAlt:
      "Graphic stating that 75 percent of unbanked Hispanic households rely on cash.",
    platforms: ["facebook", "youtube", "instagram", "x", "reddit", "linkedin", "threads"],
    facebookHref: "https://www.facebook.com/fdicgov/posts/example",
    youtubeHref: "https://www.youtube.com/watch?v=fdic-example",
    instagramHref: "https://www.instagram.com/fdicgov/p/example",
    xHref: "https://x.com/FDICgov/status/example",
    redditHref: "https://www.reddit.com/r/fdic/comments/example",
    linkedinHref: "https://www.linkedin.com/company/fdic/posts/example",
    threadsHref: "https://www.threads.net/@fdicgov/post/example",
  },
  render: renderSocialMediaItem,
} satisfies Meta<SocialMediaItemArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const item = canvasElement.querySelector("fd-social-media-item");
  const image = item?.shadowRoot?.querySelector<HTMLImageElement>("[part=image]");
  const timestamp = item?.shadowRoot?.querySelector<HTMLTimeElement>("[part=timestamp]");
  const platformItems = item?.shadowRoot?.querySelectorAll("[part=platform-item]");
  const platformLinks = item?.shadowRoot?.querySelectorAll("fd-button[part=platform-link]");

  expect(item?.getAttribute("tabindex")).toBeNull();
  expect(image?.getAttribute("alt")).toContain("75 percent");
  expect(timestamp?.tagName.toLowerCase()).toBe("time");
  expect(timestamp?.getAttribute("datetime")).toBe("2024-08-26T09:25:00-04:00");
  expect(platformItems).toHaveLength(7);
  expect(platformLinks?.[0]?.getAttribute("href")).toContain("facebook.com");
  expect(platformLinks?.[0]?.getAttribute("aria-label")).toBe("View post on Facebook");
};

export const TextOnly: Story = {
  args: {
    imageSrc: undefined,
    imageAlt: "",
    platforms: ["linkedin", "x"],
    linkedinHref: "https://www.linkedin.com/company/fdic/posts/example",
    xHref: "https://x.com/FDICgov/status/example",
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div class=${DOCS_OVERVIEW_SPACIOUS_STACK_CLASS}>
      <section class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Static item</strong>
        ${renderSocialMediaItem({
          timestamp: "Aug. 26, 2024 · 9:25 AM",
          datetime: "2024-08-26T09:25:00-04:00",
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
          facebookHref: "https://www.facebook.com/fdicgov/posts/example",
          youtubeHref: "https://www.youtube.com/watch?v=fdic-example",
          instagramHref: "https://www.instagram.com/fdicgov/p/example",
          xHref: "https://x.com/FDICgov/status/example",
          redditHref: "https://www.reddit.com/r/fdic/comments/example",
          linkedinHref: "https://www.linkedin.com/company/fdic/posts/example",
          threadsHref: "https://www.threads.net/@fdicgov/post/example",
        })}
      </section>
    </div>
  `,
};
