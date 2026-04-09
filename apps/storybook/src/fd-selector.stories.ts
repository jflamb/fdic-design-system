import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, nothing } from "lit";
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

type SelectorArgs = {
  variant: "simple" | "single" | "multiple";
  label: string;
  placeholder: string;
  required: boolean;
  disabled: boolean;
  description: string;
  error: string;
};

const ACCOUNT_OPTIONS = html`
  <fd-option value="checking">Checking</fd-option>
  <fd-option value="savings">Savings</fd-option>
  <fd-option value="cd" description="Fixed-term deposit with guaranteed rate"
    >Certificate of Deposit</fd-option
  >
  <fd-option value="mma">Money Market Account</fd-option>
  <fd-option value="ira" description="Tax-advantaged retirement account"
    >Individual Retirement Account</fd-option
  >
`;

const renderSelector = (args: SelectorArgs) => html`
  <fd-selector
    variant=${args.variant}
    label=${ifDefined(args.label || undefined)}
    placeholder=${ifDefined(args.placeholder || undefined)}
    ?required=${args.required}
    ?disabled=${args.disabled}
  >
    ${args.description
      ? html`<span slot="description">${args.description}</span>`
      : nothing}
    ${ACCOUNT_OPTIONS}
    ${args.error ? html`<span slot="error">${args.error}</span>` : nothing}
  </fd-selector>
`;

const meta = {
  title: "Components/Selector",
  tags: ["autodocs"],
  argTypes: {
    ...getComponentArgTypes("fd-selector"),
    label: { control: "text" },
    description: { control: "text" },
    error: { control: "text" },
  },
  args: {
    ...getComponentArgs("fd-selector"),
    label: "Account type",
    placeholder: "Select\u2026",
    description: "",
    error: "",
  },
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "Public event contract: `fd-selector-change` emits `{ value, values }` for every variant; in single-select, `values` contains the current single selection when present. Open-state changes use `fd-selector-open-change` with `{ open }`. Deprecated `fd-selector-open` and `fd-selector-close` still fire during the transition window. Validation contract: `checkValidity()` updates validity without showing an error; submit, `reportValidity()`, popup close, or focus leaving the widget after interaction can reveal `data-user-invalid` and trigger `aria-invalid` on the button.",
      },
    },
  },
  render: renderSelector,
} satisfies Meta<SelectorArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

function getSelectorTrigger(host: Element | null) {
  return host?.shadowRoot?.querySelector("[part=trigger]") as HTMLButtonElement | null;
}

function getSelectorListbox(host: Element | null) {
  return host?.shadowRoot?.querySelector("[part=listbox]") as HTMLElement | null;
}

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-selector") as HTMLElement | null;
  const trigger = host?.shadowRoot?.querySelector(
    "[part=trigger]",
  ) as HTMLElement | null;

  expect(host).toBeDefined();
  expect(trigger?.tagName).toBe("BUTTON");
};

export const Simple: Story = {
  args: {
    variant: "simple",
    description: "Choose from a basic dropdown list.",
  },
};

export const SingleSelect: Story = {
  args: {
    variant: "single",
    label: "Primary account",
    description: "Radio indicators show only one option can be selected.",
  },
};

SingleSelect.play = async ({ canvasElement, userEvent }) => {
  const host = canvasElement.querySelector("fd-selector");
  const trigger = getSelectorTrigger(host);
  const option = canvasElement.querySelector('fd-option[value="savings"]') as HTMLElement | null;
  const openEvents: boolean[] = [];
  const changeValues: string[] = [];

  host?.addEventListener("fd-selector-open-change", (event: Event) => {
    openEvents.push((event as CustomEvent<{ open: boolean }>).detail.open);
  });
  host?.addEventListener("fd-selector-change", (event: Event) => {
    changeValues.push((event as CustomEvent<{ value: string }>).detail.value);
  });

  await userEvent.click(trigger!);

  await waitFor(() => {
    expect(host?.hasAttribute("open")).toBe(true);
  });

  await userEvent.click(option!);

  await waitFor(() => {
    expect(host?.hasAttribute("open")).toBe(false);
    expect(trigger?.textContent).toContain("Savings");
  });

  expect(changeValues.at(-1)).toBe("savings");
  expect(openEvents).toEqual([true, false]);
};

export const MultipleSelect: Story = {
  args: {
    variant: "multiple",
    label: "Report categories",
    placeholder: "Select one or more\u2026",
    description: "Checkbox indicators show multiple options can be selected.",
  },
};

MultipleSelect.play = async ({ canvasElement, userEvent }) => {
  const host = canvasElement.querySelector("fd-selector");
  const trigger = getSelectorTrigger(host);
  const optionChecking = canvasElement.querySelector(
    'fd-option[value="checking"]',
  ) as HTMLElement | null;
  const optionSavings = canvasElement.querySelector(
    'fd-option[value="savings"]',
  ) as HTMLElement | null;

  await userEvent.click(trigger!);

  await waitFor(() => {
    expect(host?.hasAttribute("open")).toBe(true);
  });

  await userEvent.click(optionChecking!);
  await userEvent.click(optionSavings!);
  await userEvent.click(trigger!);

  await waitFor(() => {
    expect(host?.hasAttribute("open")).toBe(false);
    expect(trigger?.textContent).toContain("Checking");
    expect(trigger?.textContent).toContain("Savings");
  });
};

export const WithDescriptions: Story = {
  args: {
    variant: "single",
    label: "Account type",
    description: "Options include additional context to help your decision.",
  },
};

export const FormValidation: Story = {
  render: () => html`
    <form
      @submit=${(e: Event) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = new FormData(form);
        const output = form.querySelector("#result") as HTMLElement;
        output.textContent = JSON.stringify(Object.fromEntries(data.entries()));
      }}
      style="display: grid; gap: 1rem; max-width: 20rem;"
    >
      <fd-selector
        label="Account type"
        name="account"
        variant="single"
        required
      >
        <span slot="description">This field is required.</span>
        <span slot="error">Please select an account type.</span>
        <fd-option value="checking">Checking</fd-option>
        <fd-option value="savings">Savings</fd-option>
        <fd-option value="cd">Certificate of Deposit</fd-option>
      </fd-selector>

      <fd-button-group>
        <fd-button type="submit">Submit</fd-button>
        <fd-button type="reset">Reset</fd-button>
      </fd-button-group>
      <pre id="result" style="font-size: 0.875rem; margin: 0;"></pre>
    </form>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Submit the form to reveal invalid state. The authored error slot is the primary visible error surface. For selector-style controls, closing the popup after invalid interaction also reveals the error state; selecting a valid option or resetting clears both `data-user-invalid` and trigger `aria-invalid`.",
      },
    },
  },
};

FormValidation.play = async ({ canvasElement, userEvent }) => {
  const form = canvasElement.querySelector("form");
  const selector = form?.querySelector("fd-selector");
  const trigger = getSelectorTrigger(selector);
  const reset = form?.querySelector('fd-button[type="reset"]');
  const option = form?.querySelector('fd-option[value="checking"]') as HTMLElement | null;

  form?.requestSubmit();

  await waitFor(() => {
    expect(selector?.hasAttribute("data-user-invalid")).toBe(true);
    expect(trigger?.getAttribute("aria-invalid")).toBe("true");
  });

  await userEvent.click(trigger!);
  await waitFor(() => {
    expect(selector?.hasAttribute("open")).toBe(true);
  });
  await userEvent.click(option!);

  await waitFor(() => {
    expect(selector?.hasAttribute("data-user-invalid")).toBe(false);
    expect(trigger?.getAttribute("aria-invalid")).toBeNull();
  });

  await userEvent.click(
    reset?.shadowRoot?.querySelector("[part=base]") as HTMLButtonElement,
  );

  await waitFor(() => {
    expect(selector?.hasAttribute("data-user-invalid")).toBe(false);
    expect(getSelectorListbox(selector)?.hasAttribute("hidden")).toBe(true);
  });
};

export const Disabled: Story = {
  args: {
    variant: "single",
    label: "Account type",
    disabled: true,
  },
};

export const DisabledOptions: Story = {
  render: () => html`
    <fd-selector label="Account type" variant="single">
      <fd-option value="checking">Checking</fd-option>
      <fd-option value="savings" disabled>Savings (unavailable)</fd-option>
      <fd-option value="cd">Certificate of Deposit</fd-option>
    </fd-selector>
  `,
};

export const OptionContract: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Single-select authoring</p>
        <fd-selector label="Account type" variant="single">
          <fd-option value="checking">Checking</fd-option>
          <fd-option value="savings" description="Daily-use savings account">
            Savings
          </fd-option>
          <fd-option value="cd" disabled>Certificate of Deposit</fd-option>
        </fd-selector>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Multi-select authoring</p>
        <fd-selector
          label="Report categories"
          variant="multiple"
          placeholder="Select one or more…"
        >
          <fd-option value="checking">Checking</fd-option>
          <fd-option value="savings" description="Daily-use savings account">
            Savings
          </fd-option>
          <fd-option value="cd" disabled>Certificate of Deposit</fd-option>
        </fd-selector>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Embedded coverage for `fd-option`: authored `value`, optional `description`, and disabled-state behavior are variant-independent, so this story demonstrates the contract in both single-select and multi-select parent contexts.",
      },
    },
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Simple variant</p>
        <fd-selector label="Account type" variant="simple">
          <fd-option value="checking">Checking</fd-option>
          <fd-option value="savings">Savings</fd-option>
          <fd-option value="cd">Certificate of Deposit</fd-option>
        </fd-selector>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Single variant (radio indicators)</p>
        <fd-selector label="Primary account" variant="single">
          <fd-option value="checking">Checking</fd-option>
          <fd-option value="savings">Savings</fd-option>
          <fd-option value="cd">Certificate of Deposit</fd-option>
        </fd-selector>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>
          Multiple variant (checkbox indicators)
        </p>
        <fd-selector
          label="Report categories"
          variant="multiple"
          placeholder="Select one or more\u2026"
        >
          <fd-option value="checking">Checking</fd-option>
          <fd-option value="savings">Savings</fd-option>
          <fd-option value="cd" description="Fixed-term deposit"
            >Certificate of Deposit</fd-option
          >
        </fd-selector>
      </div>
    </div>
  `,
};
