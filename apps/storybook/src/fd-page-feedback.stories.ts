import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
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
import { expect, waitFor } from "storybook/test";

type PageFeedbackArgs = {
  view: "prompt" | "survey" | "report" | "thanks";
  surveyHref: string;
  surveyTarget: string;
  surveyRel: string;
};

type PageFeedbackHost = HTMLElement & {
  view: PageFeedbackArgs["view"];
  updateComplete?: Promise<void>;
};

const FRAME_STYLE =
  "display: block; max-width: 1440px; background: var(--fdic-color-bg-base, #ffffff);";
const RECIPE_STATUS_STYLE =
  "margin-block-start: 0.75rem; font: var(--fdic-font-size-body-small, 1rem)/1.375 var(--fdic-font-family-sans-serif, sans-serif); color: var(--fdic-color-text-secondary, #595961);";

const getInnerButton = (
  host: PageFeedbackHost | null,
  selector: string,
): HTMLButtonElement | null =>
  host?.shadowRoot
    ?.querySelector(selector)
    ?.shadowRoot?.querySelector("[part=base]") as HTMLButtonElement | null;

const getNativeTextarea = (host: HTMLElement | undefined) =>
  host?.shadowRoot?.querySelector("[part=native]") as HTMLTextAreaElement | null;

const setReportValue = (host: HTMLElement | undefined, value: string) => {
  const native = getNativeTextarea(host);
  if (!native) {
    return;
  }

  native.value = value;
  native.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
};

const waitForFeedbackUpdate = async (host: PageFeedbackHost | null) => {
  await host?.updateComplete;
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
};

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
    const reportButton = getInnerButton(
      host as PageFeedbackHost | null,
      'fd-button[data-focus-target="report-trigger"]',
    );

    reportButton?.click();

    await waitFor(() => {
      expect(host?.getAttribute("view")).toBe("report");
      expect(host?.shadowRoot?.activeElement).toBe(
        host?.shadowRoot?.querySelector("fd-textarea"),
      );
    });
  },
};

export const ReportSubmitAsync: Story = {
  render: () => {
    const statusId = "page-feedback-async-status";

    const setBusy = (root: HTMLElement, busy: boolean) => {
      const status = root.querySelector<HTMLElement>(`#${statusId}`);

      if (busy) {
        root.setAttribute("aria-busy", "true");
        if (status) {
          status.textContent = "Sending report…";
        }
      } else {
        root.removeAttribute("aria-busy");
      }
    };

    const handleSubmit = (event: Event) => {
      event.preventDefault();

      const feedback = event.currentTarget as PageFeedbackHost;
      const root = feedback.closest("[data-page-feedback-recipe]") as HTMLElement | null;
      const status = root?.querySelector<HTMLElement>(`#${statusId}`);

      if (!root || root.dataset.pending === "true") {
        return;
      }

      root.dataset.submitCanceled = "true";
      root.dataset.pending = "true";
      setBusy(root, true);

      window.setTimeout(() => {
        root.dataset.pending = "false";
        setBusy(root, false);
        if (status) {
          status.textContent = "";
        }
        feedback.view = "thanks";
      }, 500);
    };

    return html`
      <div data-page-feedback-recipe style=${FRAME_STYLE}>
        <fd-page-feedback
          view="report"
          @fd-page-feedback-report-submit=${handleSubmit}
        ></fd-page-feedback>
        <p
          id=${statusId}
          data-recipe-status
          role="status"
          style=${RECIPE_STATUS_STYLE}
        ></p>
      </div>
    `;
  },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector("fd-page-feedback") as PageFeedbackHost | null;
    const root = canvasElement.querySelector(
      "[data-page-feedback-recipe]",
    ) as HTMLElement | null;
    const textareas = Array.from(
      host?.shadowRoot?.querySelectorAll("fd-textarea") ?? [],
    ) as HTMLElement[];
    const [trying, wrong] = textareas;

    setReportValue(trying, "Find deposit insurance guidance");
    setReportValue(wrong, "The page sent me to a broken link.");
    await waitForFeedbackUpdate(host);

    getInnerButton(host, "fd-button.send-button")?.click();

    expect(host?.getAttribute("view")).toBe("report");
    expect(root?.dataset.submitCanceled).toBe("true");
    expect(root?.dataset.pending).toBe("true");
    expect(root?.getAttribute("aria-busy")).toBe("true");
    expect(canvasElement.querySelector("[data-recipe-status]")?.textContent).toBe(
      "Sending report…",
    );

    await waitFor(() => {
      expect(host?.getAttribute("view")).toBe("thanks");
      expect(root?.dataset.pending).toBe("false");
      expect(root?.hasAttribute("aria-busy")).toBe(false);
    });
  },
};

export const ReportSubmitValidationBoundary: Story = {
  render: () => {
    const statusId = "page-feedback-validation-status";

    const handleSubmit = (event: Event) => {
      const submit = event as CustomEvent<{ tryingToDo: string; wentWrong: string }>;
      const feedback = event.currentTarget as PageFeedbackHost;
      const root = feedback.closest("[data-page-feedback-recipe]") as HTMLElement | null;
      const status = root?.querySelector<HTMLElement>(`#${statusId}`);

      event.preventDefault();

      if (!submit.detail.tryingToDo.trim()) {
        if (root) {
          root.dataset.submitCanceled = "true";
        }
        if (status) {
          status.textContent =
            "Enter what you were trying to do, then send the report again.";
        }
        return;
      }

      feedback.view = "thanks";
    };

    return html`
      <div data-page-feedback-recipe style=${FRAME_STYLE}>
        <fd-page-feedback
          view="report"
          @fd-page-feedback-report-submit=${handleSubmit}
        ></fd-page-feedback>
        <p
          id=${statusId}
          data-recipe-status
          role="status"
          style=${RECIPE_STATUS_STYLE}
        ></p>
      </div>
    `;
  },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector("fd-page-feedback") as PageFeedbackHost | null;
    const root = canvasElement.querySelector(
      "[data-page-feedback-recipe]",
    ) as HTMLElement | null;

    getInnerButton(host, "fd-button.send-button")?.click();

    expect(host?.getAttribute("view")).toBe("report");
    expect(root?.dataset.submitCanceled).toBe("true");
    expect(canvasElement.querySelector("[data-recipe-status]")?.textContent).toBe(
      "Enter what you were trying to do, then send the report again.",
    );

    const [trying, wrong] = Array.from(
      host?.shadowRoot?.querySelectorAll("fd-textarea") ?? [],
    ) as HTMLElement[];

    setReportValue(trying, "Find deposit insurance guidance");
    setReportValue(wrong, "The page sent me to a broken link.");
    await waitForFeedbackUpdate(host);

    getInnerButton(host, "fd-button.send-button")?.click();

    await waitFor(() => {
      expect(host?.getAttribute("view")).toBe("thanks");
    });
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div class=${DOCS_OVERVIEW_SPACIOUS_STACK_CLASS}>
      <div class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Prompt</p>
        <fd-page-feedback survey-href="https://www.fdic.gov"></fd-page-feedback>
      </div>

      <div class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Survey follow-up</p>
        <fd-page-feedback
          view="survey"
          survey-href="https://www.fdic.gov"
          survey-target="_blank"
        ></fd-page-feedback>
      </div>

      <div class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Report problem</p>
        <fd-page-feedback view="report"></fd-page-feedback>
      </div>

      <div class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Thank you</p>
        <fd-page-feedback view="thanks"></fd-page-feedback>
      </div>
    </div>
  `,
};
