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

const renderDetails = (args: { nodeId: string; emptyLabel: string }) => html`
  <div style="max-inline-size: 38rem;">
    <fd-org-details
      node-id=${args.nodeId}
      empty-label=${args.emptyLabel}
      .tree=${normalizedStates.tree}
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
