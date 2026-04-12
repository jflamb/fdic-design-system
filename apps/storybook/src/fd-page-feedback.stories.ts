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
import { expect, waitFor } from "storybook/test";

type PageFeedbackArgs = {
  view: "prompt" | "survey" | "report" | "thanks";
  surveyHref: string;
  surveyTarget: string;
  surveyRel: string;
};

const FRAME_STYLE =
  "display: block; max-width: 1440px; background: var(--fdic-color-bg-base, #ffffff);";

const renderFeedback = (args: PageFeedbackArgs) => html`
  <div style=${FRAME_STYLE}>
    <fd-page-feedback
      view=${args.view}
      survey-href=${ifDefined(args.surveyHref || undefined)}
      survey-target=${ifDefined(args.surveyTarget || undefined)}
      survey-rel=${ifDefined(args.surveyRel || undefined)}
    ></fd-page-feedback>
  </div>
`;

const meta = {
  title: "Components/Page Feedback",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-page-feedback"),
  },
  args: {
    ...getComponentArgs("fd-page-feedback"),
    surveyHref: "https://www.fdic.gov",
    surveyTarget: "_blank",
    surveyRel: "",
  },
  render: renderFeedback,
} satisfies Meta<PageFeedbackArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-page-feedback") as HTMLElement | null;
  const base = host?.shadowRoot?.querySelector("[part=base]") as HTMLElement | null;

  expect(host).toBeDefined();
  expect(base?.getAttribute("role")).toBe("group");
  expect(host?.getAttribute("view")).toBe("prompt");
};

export const Prompt: Story = {};

export const Survey: Story = {
  args: {
    view: "survey",
  },
};

export const Report: Story = {
  args: {
    view: "report",
  },
};

export const Thanks: Story = {
  args: {
    view: "thanks",
  },
};

export const PromptToSurvey: Story = {
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector("fd-page-feedback") as HTMLElement | null;
    const noButton = host?.shadowRoot
      ?.querySelector('fd-button[data-focus-target="no-button"]')
      ?.shadowRoot?.querySelector("[part=base]") as HTMLButtonElement | null;

    noButton?.click();

    await waitFor(() => {
      expect(host?.getAttribute("view")).toBe("survey");
      expect(host?.shadowRoot?.activeElement).toBe(
        host?.shadowRoot?.querySelector('fd-link[data-focus-target="survey-link"]'),
      );
    });
  },
};

export const PromptToReport: Story = {
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector("fd-page-feedback") as HTMLElement | null;
    const reportButton = host?.shadowRoot
      ?.querySelector('fd-button[data-focus-target="report-trigger"]')
      ?.shadowRoot?.querySelector("[part=base]") as HTMLButtonElement | null;

    reportButton?.click();

    await waitFor(() => {
      expect(host?.getAttribute("view")).toBe("report");
      expect(host?.shadowRoot?.activeElement).toBe(
        host?.shadowRoot?.querySelector("fd-textarea"),
      );
    });
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Prompt</p>
        <fd-page-feedback survey-href="https://www.fdic.gov"></fd-page-feedback>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Survey follow-up</p>
        <fd-page-feedback
          view="survey"
          survey-href="https://www.fdic.gov"
          survey-target="_blank"
        ></fd-page-feedback>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Report problem</p>
        <fd-page-feedback view="report"></fd-page-feedback>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Thank you</p>
        <fd-page-feedback view="thanks"></fd-page-feedback>
      </div>
    </div>
  `,
};
