import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "@fdic-ds/components";
import {
  DOCS_OVERVIEW_HEADING_STYLE,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_STACK_STYLE,
} from "./docs-overview";

type LabelArgs = {
  label: string;
  for: string;
  required: boolean;
  description: string;
  infotip: string;
  infotipLabel: string;
};

const renderLabel = (args: LabelArgs) => html`
  <div style="max-width: 328px;">
    <fd-label
      for=${ifDefined(args.for || undefined)}
      label=${args.label}
      ?required=${args.required}
      description=${ifDefined(args.description || undefined)}
      infotip=${ifDefined(args.infotip || undefined)}
      infotip-label=${ifDefined(args.infotipLabel || undefined)}
    ></fd-label>
    <input
      id=${ifDefined(args.for || undefined)}
      type="text"
      ?required=${args.required}
      style="display: block; width: 100%; padding: 8px 12px; border: 1px solid var(--fdic-border-input-rest, #bdbdbf); border-radius: var(--fdic-corner-radius-sm, 3px); font: inherit; box-sizing: border-box;"
    />
  </div>
`;

const meta = {
  title: "Components/Label",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    for: { control: "text" },
    required: { control: "boolean" },
    description: { control: "text" },
    infotip: { control: "text" },
    infotipLabel: { control: "text" },
  },
  args: {
    label: "Account number",
    for: "account-number",
    required: false,
    description: "",
    infotip: "",
    infotipLabel: "",
  },
  render: renderLabel,
} satisfies Meta<LabelArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-label") as HTMLElement | null;
  const label = host?.querySelector("[part=label]") as HTMLLabelElement | null;

  expect(host).toBeDefined();
  expect(label?.tagName).toBe("LABEL");
};

export const Default: Story = {};

export const WithRequired: Story = {
  args: {
    label: "Social Security Number",
    for: "ssn",
    required: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: "Routing number",
    for: "routing",
    description:
      "9-digit number on the bottom left of your check",
  },
};

export const WithInfoTip: Story = {
  args: {
    label: "Beneficial owner",
    for: "beneficial-owner",
    required: true,
    infotip:
      "A beneficial owner is any individual who owns 25% or more of the legal entity, or who controls the entity.",
  },
};

export const FullFeatured: Story = {
  args: {
    label: "Employer Identification Number",
    for: "ein",
    required: true,
    description: "Format: XX-XXXXXXX",
    infotip:
      "Your EIN is assigned by the IRS. You can find it on IRS correspondence or your original application (Form SS-4).",
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_STACK_STYLE}>
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p style=${DOCS_OVERVIEW_HEADING_STYLE}>Basic label</p>
        <div style="max-width: 328px;">
          <fd-label for="do-basic" label="Account number"></fd-label>
          <input
            id="do-basic"
            type="text"
            style="display: block; width: 100%; padding: 8px 12px; border: 1px solid #bdbdbf; border-radius: 3px; font: inherit; box-sizing: border-box;"
          />
        </div>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p style=${DOCS_OVERVIEW_HEADING_STYLE}>Required with description</p>
        <div style="max-width: 328px;">
          <fd-label
            for="do-required"
            label="Routing number"
            required
            description="9-digit number on the bottom left of your check"
          ></fd-label>
          <input
            id="do-required"
            type="text"
            required
            style="display: block; width: 100%; padding: 8px 12px; border: 1px solid #bdbdbf; border-radius: 3px; font: inherit; box-sizing: border-box;"
          />
        </div>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p style=${DOCS_OVERVIEW_HEADING_STYLE}>With InfoTip</p>
        <div style="max-width: 328px;">
          <fd-label
            for="do-infotip"
            label="Beneficial owner"
            required
            infotip="A beneficial owner is any individual who owns 25% or more of the legal entity, or who controls the entity."
          ></fd-label>
          <input
            id="do-infotip"
            type="text"
            required
            style="display: block; width: 100%; padding: 8px 12px; border: 1px solid #bdbdbf; border-radius: 3px; font: inherit; box-sizing: border-box;"
          />
        </div>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p style=${DOCS_OVERVIEW_HEADING_STYLE}>
          Full featured (required + description + InfoTip)
        </p>
        <div style="max-width: 328px;">
          <fd-label
            for="do-full"
            label="Employer Identification Number"
            required
            description="Format: XX-XXXXXXX"
            infotip="Your EIN is assigned by the IRS. You can find it on IRS correspondence or your original application (Form SS-4)."
          ></fd-label>
          <input
            id="do-full"
            type="text"
            required
            style="display: block; width: 100%; padding: 8px 12px; border: 1px solid #bdbdbf; border-radius: 3px; font: inherit; box-sizing: border-box;"
          />
        </div>
      </div>
    </div>
  `,
};
