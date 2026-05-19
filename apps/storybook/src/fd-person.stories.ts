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
  DOCS_OVERVIEW_SECTION_CLASS,
  DOCS_OVERVIEW_SPACIOUS_STACK_CLASS,
} from "./docs-overview";
import jordanPierceHeadshot from "./assets/person/jordan-pierce.webp";
import morganLeeHeadshot from "./assets/person/morgan-lee.webp";
import linWeiHeadshot from "./assets/person/lin-wei.webp";
import andreColemanHeadshot from "./assets/person/andre-coleman.webp";
import eleanorVossHeadshot from "./assets/person/eleanor-voss.webp";

type PersonArgs = {
  variant: string;
  name: string;
  title: string;
  organization: string;
  email?: string;
  phone?: string;
  location?: string;
  profileUrl?: string;
  profileLabel: string;
  target?: string;
  rel?: string;
  imageSrc?: string;
  imageSrcset?: string;
  imageAlt: string;
  imagePosition?: string;
  summary: string;
};

// Demo headshots are vendored synthetic (AI-generated) portraits — no real
// person is depicted, so labelling them as fictional staff raises no consent
// concern, and bundling them locally keeps stories sharp and offline-safe.
// Instances with no `imageSrc` fall back to the component's silhouette
// placeholder.
const renderPerson = (args: PersonArgs) => html`
  <fd-person
    variant=${args.variant}
    name=${args.name}
    title=${args.title}
    organization=${args.organization}
    email=${ifDefined(args.email)}
    phone=${ifDefined(args.phone)}
    location=${ifDefined(args.location)}
    profile-url=${ifDefined(args.profileUrl)}
    profile-label=${args.profileLabel}
    target=${ifDefined(args.target)}
    rel=${ifDefined(args.rel)}
    image-src=${ifDefined(args.imageSrc)}
    image-srcset=${ifDefined(args.imageSrcset)}
    image-alt=${args.imageAlt}
    image-position=${ifDefined(args.imagePosition)}
    summary=${args.summary}
  ></fd-person>
`;

const meta = {
  title: "Components/Person",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "A governed Person display pattern with purpose-named variants for Drupal Person view modes.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-person"),
  },
  args: {
    ...getComponentArgs("fd-person"),
    variant: "contact",
    name: "Jordan Pierce",
    title: "Program Analyst",
    organization: "Division of Administration",
    email: "jordan.pierce@example.gov",
    phone: "555-555-0101",
    location: "Washington, DC",
    profileUrl: "/people/jordan-pierce",
    profileLabel: "Read more",
    target: undefined,
    rel: undefined,
    imageSrc: jordanPierceHeadshot,
    imageSrcset: undefined,
    imageAlt: "Jordan Pierce headshot",
    summary: "Jordan helps teams publish clearer internal service information.",
  },
  render: renderPerson,
} satisfies Meta<PersonArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const person = canvasElement.querySelector("fd-person");
  const article = person?.shadowRoot?.querySelector("article");
  const image = person?.shadowRoot?.querySelector("[part=image]");
  const email = person?.shadowRoot?.querySelector("[part=email-link]");

  expect(article?.part.contains("contact")).toBe(true);
  expect(image).toBeNull();
  expect(email?.getAttribute("href")).toBe("mailto:jordan.pierce@example.gov");
};

export const ContactWithImage: Story = {
  args: {
    variant: "contact-with-image",
  },
};

ContactWithImage.play = async ({ canvasElement }) => {
  const person = canvasElement.querySelector("fd-person");
  const image =
    person?.shadowRoot?.querySelector<HTMLImageElement>("[part=image]");
  const nameLink = person?.shadowRoot?.querySelector("[part~='email-link']");

  expect(image?.getAttribute("alt")).toBe("");
  expect(nameLink?.textContent).toContain("Jordan Pierce");
};

export const ContactDetails: Story = {
  args: {
    variant: "contact-details",
    name: "Eleanor Voss",
    title: "Regional Counsel",
    organization: "Legal Division",
    email: "eleanor.voss@example.gov",
    summary:
      "Eleanor advises regional offices on supervisory legal questions and review timelines.",
    imageSrc: eleanorVossHeadshot,
    imageAlt: "Eleanor Voss headshot",
  },
};

ContactDetails.play = async ({ canvasElement }) => {
  const person = canvasElement.querySelector("fd-person");
  const image = person?.shadowRoot?.querySelector("[part=image]");
  const email = person?.shadowRoot?.querySelector("[part=email-link]");
  const summary = person?.shadowRoot?.querySelector("[part=summary]");

  expect(image?.getAttribute("alt")).toBe("");
  expect(email?.getAttribute("href")).toBe("mailto:eleanor.voss@example.gov");
  expect(summary?.textContent).toContain("regional offices");
};

export const Spotlight: Story = {
  args: {
    variant: "spotlight",
    name: "Morgan Lee",
    title: "Employee Spotlight",
    organization: "Office of Communications",
    profileUrl: "/people/morgan-lee",
    profileLabel: "Read Morgan's profile",
    summary: "Morgan improved the intranet publishing workflow.",
    imageSrc: morganLeeHeadshot,
    imageAlt: "Morgan Lee headshot",
  },
};

export const ProfileCard: Story = {
  args: {
    variant: "profile-card",
    name: "Lin Wei",
    title: "Honors Attorney",
    organization: "Legal Division",
    profileUrl: "/people/lin-wei",
    imageSrc: undefined,
    imageSrcset: undefined,
  },
};

ProfileCard.play = async ({ canvasElement }) => {
  const person = canvasElement.querySelector("fd-person");
  const links = person?.shadowRoot?.querySelectorAll("a") ?? [];
  const placeholder = person?.shadowRoot?.querySelector("[part=placeholder]");

  expect(links).toHaveLength(1);
  expect(links[0]?.textContent?.trim()).toBe("Lin Wei");
  expect(placeholder?.querySelector("svg")).not.toBeNull();
};

export const ImagePosition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`image-position` places the headshot beside the text (`left`, the default) or above it (`top`) for the row-capable contact variants.",
      },
    },
  },
  render: () => {
    const base: PersonArgs = {
      variant: "contact-with-image",
      name: "Andre Coleman",
      title: "Senior Counsel",
      organization: "Legal Division",
      email: "andre.coleman@example.gov",
      profileLabel: "Read more",
      imageSrc: andreColemanHeadshot,
      imageAlt: "",
      summary: "",
    };
    const label = (text: string) => html`
      <p
        style="margin:0 0 8px;font:600 0.8125rem/1.4 sans-serif;color:#595961;"
      >
        ${text}
      </p>
    `;
    return html`
      <div style="display:flex;gap:48px;flex-wrap:wrap;align-items:flex-start;">
        <div style="inline-size:260px;">
          ${label('image-position="left" (default)')}
          ${renderPerson({ ...base, imagePosition: "left" })}
        </div>
        <div style="inline-size:260px;">
          ${label('image-position="top"')}
          ${renderPerson({ ...base, imagePosition: "top" })}
        </div>
      </div>
    `;
  },
};

ImagePosition.play = async ({ canvasElement }) => {
  const [left, top] = canvasElement.querySelectorAll("fd-person");
  const flexDirection = (person?: Element) => {
    const personBase = person?.shadowRoot?.querySelector("[part~='base']");
    return personBase ? getComputedStyle(personBase).flexDirection : undefined;
  };

  expect(flexDirection(left)).toBe("row");
  expect(flexDirection(top)).toBe("column");
};

export const DocsOverview: Story = {
  render: () => html`
    <div class=${DOCS_OVERVIEW_SPACIOUS_STACK_CLASS}>
      <section class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Compact contact</strong>
        ${renderPerson({
          variant: "contact",
          name: "Jordan Pierce",
          title: "Program Analyst",
          organization: "Division of Administration",
          email: "jordan.pierce@example.gov",
          profileLabel: "Read more",
          imageAlt: "",
          summary: "",
        })}
      </section>
      <section class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Employee spotlight</strong>
        <div style="max-inline-size: 720px;">
          ${renderPerson({
            variant: "spotlight",
            name: "Morgan Lee",
            title: "Employee Spotlight",
            organization: "Office of Communications",
            email: undefined,
            profileUrl: "/people/morgan-lee",
            profileLabel: "Read Morgan's profile",
            imageSrc: morganLeeHeadshot,
            imageAlt: "",
            summary: "Morgan improved the intranet publishing workflow.",
          })}
        </div>
      </section>
      <section class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}
          >Profile-card grid items</strong
        >
        <div
          style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:24px;max-inline-size:640px;"
        >
          ${renderPerson({
            variant: "profile-card",
            name: "Lin Wei",
            title: "Honors Attorney",
            organization: "Legal Division",
            profileUrl: "/people/lin-wei",
            profileLabel: "Read more",
            imageSrc: linWeiHeadshot,
            imageAlt: "",
            summary: "",
          })}
          ${renderPerson({
            variant: "profile-card",
            name: "Andre Coleman",
            title: "Senior Counsel",
            organization: "Legal Division",
            profileUrl: "/people/andre-coleman",
            profileLabel: "Read more",
            imageSrc: andreColemanHeadshot,
            imageAlt: "",
            summary: "",
          })}
          ${renderPerson({
            variant: "profile-card",
            name: "Eleanor Voss",
            title: "Regional Counsel",
            organization: "Legal Division",
            profileUrl: "/people/eleanor-voss",
            profileLabel: "Read more",
            imageSrc: eleanorVossHeadshot,
            imageAlt: "",
            summary: "",
          })}
          ${renderPerson({
            variant: "profile-card",
            name: "Avery Chen",
            title: "Deputy Director",
            organization: "Legal Division",
            profileUrl: "/people/avery-chen",
            profileLabel: "Read more",
            imageAlt: "",
            summary: "",
          })}
        </div>
      </section>
    </div>
  `,
};
