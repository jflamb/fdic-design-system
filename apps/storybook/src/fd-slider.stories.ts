import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, waitFor } from "storybook/test";
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

type SliderArgs = {
  name: string;
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  value: number;
  disabled: boolean;
  showInput: boolean;
};

let storyCounter = 0;

const renderSlider = (
  args: SliderArgs,
  interaction: "none" | "hover" | "focus" = "none",
) => {
  const storyId = `fd-slider-story-${storyCounter++}`;

  queueMicrotask(async () => {
    const host = document.getElementById(storyId) as HTMLElement | null;
    const range = host?.shadowRoot?.querySelector("[part=range]") as
      | HTMLInputElement
      | null;

    if (!host || !range || args.disabled) {
      return;
    }

    if (interaction === "hover") {
      range.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }));
      return;
    }

    if (interaction === "focus") {
      host.focus();
    }
  });

  return html`
    <div style="max-width: 428px;">
      <fd-slider
        id=${storyId}
        name=${ifDefined(args.name || undefined)}
        label=${ifDefined(args.label || undefined)}
        hint=${ifDefined(args.hint || undefined)}
        min=${args.min}
        max=${args.max}
        step=${args.step}
        value=${args.value}
        ?disabled=${args.disabled}
        ?show-input=${args.showInput}
      ></fd-slider>
    </div>
  `;
};

const meta = {
  title: "Components/Slider",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "A self-contained, form-associated single-value slider built on a native `<input type=\"range\">`, with an optional inline exact-value helper input.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-slider"),
  },
  args: {
    ...getComponentArgs("fd-slider"),
    name: "term",
    label: "Field name",
    hint: "",
    min: 0,
    max: 25,
    step: 1,
    value: 6,
    disabled: false,
    showInput: false,
  },
  render: (args: SliderArgs) => renderSlider(args),
} satisfies Meta<SliderArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-slider") as HTMLElement | null;
  const range = host?.shadowRoot?.querySelector("[part=range]");

  expect(host).toBeDefined();
  expect(range?.tagName).toBe("INPUT");
};

export const Default: Story = {};

export const WithInput: Story = {
  args: {
    showInput: true,
    value: 25,
  },
};

WithInput.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-slider") as HTMLElement | null;
  const input = host?.shadowRoot?.querySelector("[part=input]") as
    | HTMLInputElement
    | null;
  const range = host?.shadowRoot?.querySelector("[part=range]") as
    | HTMLInputElement
    | null;

  expect(input).toBeDefined();

  input!.value = "20";
  input!.dispatchEvent(new Event("input", { bubbles: true }));

  await waitFor(() => {
    expect(range?.value).toBe("20");
  });
};

export const HoverState: Story = {
  render: (args) => renderSlider(args),
};

HoverState.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-slider") as HTMLElement | null;
  const range = host?.shadowRoot?.querySelector("[part=range]") as
    | HTMLInputElement
    | null;

  range?.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }));

  await waitFor(() => {
    expect(host?.shadowRoot?.querySelector("[part=value-bubble]")?.hasAttribute("hidden")).toBe(
      false,
    );
  });
};

export const FocusVisible: Story = {
  render: (args) => renderSlider(args),
};

FocusVisible.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-slider") as HTMLElement | null;
  const range = host?.shadowRoot?.querySelector("[part=range]") as
    | HTMLInputElement
    | null;

  host?.focus();
  range?.dispatchEvent(new FocusEvent("focus"));

  await waitFor(() => {
    expect(host?.hasAttribute("data-range-focus")).toBe(true);
    expect(host?.shadowRoot?.querySelector("[part=value-bubble]")?.hasAttribute("hidden")).toBe(
      false,
    );
  });
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 25,
    showInput: true,
  },
};

Disabled.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-slider") as HTMLElement | null;
  const range = host?.shadowRoot?.querySelector("[part=range]") as
    | HTMLInputElement
    | null;
  const input = host?.shadowRoot?.querySelector("[part=input]") as
    | HTMLInputElement
    | null;

  expect(range?.disabled).toBe(true);
  expect(input?.disabled).toBe(true);
};

export const DocsOverview: Story = {
  render: (args) => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Default</strong>
        ${renderSlider(args)}
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>With exact-value input</strong>
        ${renderSlider({ ...args, showInput: true, value: 25 })}
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Keyboard focus</strong>
        ${renderSlider(args, "focus")}
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Disabled</strong>
        ${renderSlider({ ...args, disabled: true, showInput: true, value: 25 })}
      </section>
    </div>
  `,
};
