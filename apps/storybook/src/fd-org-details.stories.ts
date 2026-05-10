import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "@jflamb/fdic-ds-components/register-all";
import { normalizeOrgTree } from "../../../packages/components/src/components/org-chart-normalize";
import { statesOrgFixture } from "../../../packages/components/src/components/org-chart-fixtures/fixture.states";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";

const normalizedStates = normalizeOrgTree(statesOrgFixture);
const SAMPLE_AVATAR_SVG = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
    <rect width="72" height="72" fill="#d6e8f5" />
    <circle cx="36" cy="25" r="13" fill="#235c86" />
    <path d="M14 72C17 54 25 45 36 45C47 45 55 54 58 72Z" fill="#235c86" />
  </svg>
`);
const SAMPLE_AVATAR_SRC = `data:image/svg+xml;charset=utf-8,${SAMPLE_AVATAR_SVG}`;

const renderDetails = (args: { nodeId: string; emptyLabel: string }) => html`
  <div style="max-inline-size: 38rem;">
    <fd-org-details
      node-id=${args.nodeId}
      empty-label=${args.emptyLabel}
      .tree=${normalizedStates.tree}
      .photoResolver=${() => SAMPLE_AVATAR_SRC}
    >
      <button slot="actions" type="button">Review source</button>
    </fd-org-details>
  </div>
`;

const meta = {
  title: "Components/Org Details",
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Selected-node details panel with polite announcements, source status, acting metadata, and explicit conflict comparison.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-org-details"),
  },
  args: {
    ...getComponentArgs("fd-org-details"),
    nodeId: "jordan-pierce",
    emptyLabel: "Select an organization record to review details.",
  },
  render: renderDetails,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Vacancy: Story = {
  args: { nodeId: "vacant-analyst" },
};

export const Acting: Story = {
  args: { nodeId: "sam-taylor" },
};

export const OverrideWithConflict: Story = {
  args: { nodeId: "branch-chief" },
};

export const Draft: Story = {
  args: { nodeId: "proposed-deputy" },
};

export const Historical: Story = {
  args: { nodeId: "legacy-team" },
};

export const Empty: Story = {
  args: { nodeId: "" },
};
