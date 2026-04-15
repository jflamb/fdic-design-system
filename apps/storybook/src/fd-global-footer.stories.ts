import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "@jflamb/fdic-ds-components/register-all";
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
  "display:block;background:var(--fdic-color-bg-base, #ffffff);";

const renderFooter = (args: GlobalFooterArgs) => html`
  <div
    style=${[
      FRAME_STYLE,
      "padding: 0",
      "width: 100%",
      `max-width: ${args.mobile ? "390px" : "1440px"}`,
      `margin: 0 auto`,
    ].join("; ")}
  >
    <fd-global-footer
      agency-name=${args.agencyName}
      agency-href=${ifDefined(args.agencyHref || undefined)}
      updated-text=${ifDefined(args.updatedText || undefined)}
      .utilityLinks=${args.utilityLinks}
      .socialLinks=${args.socialLinks}
    ></fd-global-footer>
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
    mobile: false,
  },
  render: renderFooter,
} satisfies Meta<GlobalFooterArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Desktop: Story = {
  args: {
    mobile: false,
  },
};

Desktop.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-global-footer") as HTMLElement | null;
  const footer = host?.shadowRoot?.querySelector("footer");
  const utilityLinks = host?.shadowRoot?.querySelectorAll('[part="utility-links"] a') ?? [];
  const socialLinks = host?.shadowRoot?.querySelectorAll(".social-link") ?? [];
  const firstSocial = socialLinks[0] as HTMLAnchorElement | undefined;

  expect(footer).toBeDefined();
  expect(footer?.getAttribute("part")).toBe("base");
  expect(utilityLinks.length).toBeGreaterThan(0);
  expect(socialLinks.length).toBe(5);
  expect(firstSocial?.getAttribute("aria-label")).toContain("FDIC");
  expect(firstSocial?.getAttribute("rel")).toContain("noopener");
};

export const Mobile: Story = {
  args: {
    mobile: true,
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Global footer shell</p>
        ${renderFooter({
          agencyName: "Federal Deposit Insurance Corporation",
          agencyHref: "/",
          updatedText: "Updated August 7, 2024",
          utilityLinks: createUtilityLinks(),
          socialLinks: createSocialLinks(),
          mobile: false,
        })}
      </div>
    </div>
  `,
};
