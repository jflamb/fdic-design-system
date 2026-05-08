import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect } from "storybook/test";
import "@jflamb/fdic-ds-components/register-all";
import { normalizeOrgTree } from "../../../packages/components/src/components/org-chart-normalize";
import { dirOrgFixture } from "../../../packages/components/src/components/org-chart-fixtures/fixture.dir";
import { fdicShapeOrgFixture } from "../../../packages/components/src/components/org-chart-fixtures/fixture.fdic-shape";
import { minimalOrgFixture } from "../../../packages/components/src/components/org-chart-fixtures/fixture.minimal";
import { statesOrgFixture } from "../../../packages/components/src/components/org-chart-fixtures/fixture.states";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";

const normalizedMinimal = normalizeOrgTree(minimalOrgFixture);
const normalizedShape = normalizeOrgTree(fdicShapeOrgFixture);
const normalizedStates = normalizeOrgTree(statesOrgFixture);
const normalizedDir = normalizeOrgTree(dirOrgFixture);

const renderOutline = (args: {
  label: string;
  currentNodeId: string;
  searchQuery: string;
  fixture: "minimal" | "shape" | "states" | "dir";
}) => {
  const tree = args.fixture === "shape"
    ? normalizedShape.tree
    : args.fixture === "states"
      ? normalizedStates.tree
      : args.fixture === "dir"
        ? normalizedDir.tree
        : normalizedMinimal.tree;

  return html`
    <div style="max-inline-size: 48rem;">
      <fd-org-outline
        label=${args.label}
        current-node-id=${args.currentNodeId}
        search-query=${args.searchQuery}
        .tree=${tree}
      ></fd-org-outline>
    </div>
  `;
};

const meta = {
  title: "Components/Org Outline",
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Semantic outline-first organization hierarchy using native lists and disclosure. V1 deliberately avoids role=\"tree\" and roving tabindex.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-org-outline"),
    fixture: {
      control: "select",
      options: ["minimal", "shape", "states", "dir"],
    },
  },
  args: {
    ...getComponentArgs("fd-org-outline"),
    label: "Organization outline",
    currentNodeId: "person-rivera",
    searchQuery: "",
    fixture: "minimal",
  },
  render: renderOutline,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Override: Story = {
  args: {
    fixture: "states",
    currentNodeId: "branch-chief",
  },
};

export const Draft: Story = {
  args: {
    fixture: "states",
    currentNodeId: "proposed-deputy",
  },
};

export const Historical: Story = {
  args: {
    fixture: "states",
    currentNodeId: "legacy-team",
  },
};

export const Vacancy: Story = {
  args: {
    fixture: "shape",
    currentNodeId: "vac-policy-manager",
  },
};

export const Acting: Story = {
  args: {
    fixture: "shape",
    currentNodeId: "person-jordan",
  },
};

export const SearchSingleHit: Story = {
  args: {
    fixture: "shape",
    searchQuery: "Jordan",
  },
};

export const SearchNoResults: Story = {
  args: {
    fixture: "shape",
    searchQuery: "not in fixture",
  },
};

export const Empty: Story = {
  render: () => html`<fd-org-outline .tree=${normalizeOrgTree([]).tree}></fd-org-outline>`,
};

export const DivisionOfInsuranceAndResearch: Story = {
  args: {
    fixture: "dir",
    currentNodeId: "singer",
    label: "Division of Insurance and Research",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Real-world FDIC Division of Insurance and Research transcribed from the public org chart. Demonstrates branches-first ordering, multi-column leaf flow under managers like Marshall and the Regions unit, vacancies sorting to the bottom under Daniel Hoople, and acting assignments on Singer, Allagh, Vogel, and Nguyen.",
      },
    },
  },
};

export const DocsOverview: Story = {
  args: {
    fixture: "shape",
    currentNodeId: "person-jordan",
  },
};

DocsOverview.play = async ({ canvasElement }) => {
  const outline = canvasElement.querySelector("fd-org-outline");

  expect(outline?.shadowRoot?.querySelector("[role='tree']")).toBeNull();
  expect(outline?.shadowRoot?.querySelector("ul")).toBeTruthy();
  expect(outline?.shadowRoot?.textContent).toContain("Acting");
};
