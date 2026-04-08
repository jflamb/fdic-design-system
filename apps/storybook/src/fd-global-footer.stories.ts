import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
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

type FooterStoryLink = {
  label: string;
  href: string;
  target?: string;
  rel?: string;
};

type FooterStorySocialLink = FooterStoryLink & {
  icon: "facebook" | "x" | "instagram" | "youtube" | "linkedin";
};

type GlobalFooterArgs = {
  agencyName: string;
  agencyHref: string;
  updatedText: string;
  utilityLinks: FooterStoryLink[];
  socialLinks: FooterStorySocialLink[];
  includeFeedback: boolean;
  mobile: boolean;
};

function createUtilityLinks(): FooterStoryLink[] {
  return [{ label: "Accessibility", href: "/accessibility" }];
}

function createSocialLinks(): FooterStorySocialLink[] {
  return [
    {
      icon: "facebook",
      label: "Follow the FDIC on Facebook",
      href: "https://www.facebook.com/FDICgov/",
      target: "_blank",
    },
    {
      icon: "x",
      label: "Follow the FDIC on X",
      href: "https://x.com/FDICgov",
      target: "_blank",
    },
    {
      icon: "instagram",
      label: "Follow the FDIC on Instagram",
      href: "https://www.instagram.com/fdicgov/",
      target: "_blank",
    },
    {
      icon: "youtube",
      label: "Follow the FDIC on YouTube",
      href: "https://youtube.com/user/FDICchannel/",
      target: "_blank",
    },
    {
      icon: "linkedin",
      label: "Follow the FDIC on LinkedIn",
      href: "https://www.linkedin.com/company/fdic/",
      target: "_blank",
    },
  ];
}

const FRAME_STYLE =
  "display:block;background:var(--fdic-background-base, #ffffff);";

const renderFooter = (args: GlobalFooterArgs) => html`
  <div
    style=${[
      FRAME_STYLE,
      "padding: 0",
      `max-width: ${args.mobile ? "390px" : "1200px"}`,
      `margin: 0 auto`,
    ].join("; ")}
  >
    <fd-global-footer
      agency-name=${args.agencyName}
      agency-href=${ifDefined(args.agencyHref || undefined)}
      updated-text=${ifDefined(args.updatedText || undefined)}
      .utilityLinks=${args.utilityLinks}
      .socialLinks=${args.socialLinks}
    >
      ${args.includeFeedback
        ? html`<fd-page-feedback
            slot="feedback"
            survey-href="https://www.fdic.gov/feedback-survey"
            survey-target="_blank"
          ></fd-page-feedback>`
        : null}
    </fd-global-footer>
  </div>
`;

const meta = {
  title: "Components/Global Footer",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-global-footer"),
    includeFeedback: {
      control: "boolean",
      description:
        "Story-only flag that composes fd-page-feedback in the named feedback slot.",
    },
    mobile: {
      control: "boolean",
      description: "Story-only flag that constrains the preview to the Figma mobile width.",
    },
  },
  args: {
    ...getComponentArgs("fd-global-footer"),
    agencyName: "Federal Deposit Insurance Corporation",
    agencyHref: "/",
    updatedText: "Updated August 7, 2024",
    utilityLinks: createUtilityLinks(),
    socialLinks: createSocialLinks(),
    includeFeedback: false,
    mobile: false,
  },
  render: renderFooter,
} satisfies Meta<GlobalFooterArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Desktop: Story = {
  args: {
    includeFeedback: false,
    mobile: false,
  },
};

export const Mobile: Story = {
  args: {
    mobile: true,
  },
};

export const WithFeedback: Story = {
  args: {
    includeFeedback: true,
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Global footer with composed page feedback</p>
        ${renderFooter({
          agencyName: "Federal Deposit Insurance Corporation",
          agencyHref: "/",
          updatedText: "Updated August 7, 2024",
          utilityLinks: createUtilityLinks(),
          socialLinks: createSocialLinks(),
          includeFeedback: true,
          mobile: false,
        })}
      </div>
    </div>
  `,
};
