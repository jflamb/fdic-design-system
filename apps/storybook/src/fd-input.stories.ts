import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, userEvent, waitFor } from "storybook/test";
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

type InputArgs = {
  id: string;
  label: string;
  description: string;
  type: string;
  name: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  maxlength: number | undefined;
  autocomplete: string;
  inputmode: string;
  messageState: string;
  messageText: string;
};

type FdInputHost = HTMLElement & {
  type?: string;
  value?: string;
  updateComplete?: Promise<unknown>;
};
type FdMessageHost = HTMLElement & {
  state?: string;
  message?: string;
  live?: string;
};

function updateValidationMessage(
  input: FdInputHost,
  {
    isValid,
    errorMessage,
    live = "polite",
  }: {
    isValid: (value: string) => boolean;
    errorMessage: string;
    live?: string;
  },
) {
  const message = input.parentElement?.querySelector("fd-message") as
    | FdMessageHost
    | null;

  if (!message) return;

  const value = input.value ?? "";

  if (!value.trim()) {
    message.state = "default";
    message.message = "";
    return;
  }

  if (isValid(value)) {
    message.state = "default";
    message.message = "";
    return;
  }

  message.live = live;
  message.state = "error";
  message.message = errorMessage;
}

const renderInput = (args: InputArgs) => html`
  <div style="max-width: 328px;">
    <fd-label
      for=${args.id}
      label=${args.label}
      ?required=${args.required}
      description=${ifDefined(args.description || undefined)}
    ></fd-label>
    <fd-input
      id=${args.id}
      type=${ifDefined(args.type || undefined)}
      name=${ifDefined(args.name || undefined)}
      value=${ifDefined(args.value || undefined)}
      placeholder=${ifDefined(args.placeholder || undefined)}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      maxlength=${ifDefined(args.maxlength ?? undefined)}
      autocomplete=${ifDefined(args.autocomplete || undefined)}
      inputmode=${ifDefined(args.inputmode || undefined)}
    ></fd-input>
    ${args.messageText
      ? html`<fd-message
          for=${args.id}
          state=${args.messageState}
          message=${args.messageText}
        ></fd-message>`
      : ""}
  </div>
`;

const meta = {
  title: "Components/Input",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    ...getComponentArgTypes("fd-input"),
    messageState: {
      control: "select",
      options: ["default", "error", "warning", "success"],
    },
    messageText: { control: "text" },
  },
  args: {
    ...getComponentArgs("fd-input"),
    id: "account-number",
    label: "Account number",
    description: "",
    name: "account-number",
    messageState: "default",
    messageText: "",
  },
  render: renderInput,
} satisfies Meta<InputArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-input") as HTMLElement | null;
  expect(host).toBeDefined();
  // [part=base] is the visual container div; [part=native] is the actual input
  expect(host?.shadowRoot?.querySelector("[part=base]")?.tagName).toBe("DIV");
  expect(host?.shadowRoot?.querySelector("[part=native]")?.tagName).toBe(
    "INPUT",
  );
};

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    id: "full-name",
    label: "Full name",
    name: "full-name",
    placeholder: "e.g. Jane Smith",
  },
};

export const WithLabelAndDescription: Story = {
  args: {
    id: "routing-number",
    label: "Routing number",
    name: "routing-number",
    description: "9-digit number on the bottom of your check",
    placeholder: "e.g. 021000021",
  },
};

export const Required: Story = {
  args: {
    id: "email-required",
    label: "Email address",
    name: "email",
    type: "email",
    required: true,
    placeholder: "you@example.com",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Validation contract: `checkValidity()` updates validity without showing an error. Submit, `reportValidity()`, or blur after interaction can add `data-user-invalid`; the inner input gets `aria-invalid` only while that visible invalid state is active.",
      },
    },
  },
};

export const WithError: Story = {
  args: {
    id: "routing-error",
    label: "Routing number",
    name: "routing-number",
    required: true,
    value: "12345",
    messageState: "error",
    messageText: "Enter a valid 9-digit routing number",
  },
};

export const WithWarning: Story = {
  args: {
    id: "amount-warning",
    label: "Transfer amount",
    name: "amount",
    value: "50000",
    messageState: "warning",
    messageText: "Transfers over $10,000 require additional verification",
  },
};

export const WithSuccess: Story = {
  args: {
    id: "routing-success",
    label: "Routing number",
    name: "routing-number",
    value: "021000021",
    messageState: "success",
    messageText: "Routing number verified",
  },
};

export const Disabled: Story = {
  args: {
    id: "disabled-input",
    label: "Institution name",
    name: "institution",
    value: "Federal Deposit Insurance Corporation",
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    id: "readonly-input",
    label: "Certificate number",
    name: "cert-number",
    value: "CERT-2024-00847",
    readonly: true,
  },
};

export const WithCharacterCount: Story = {
  args: {
    id: "comments",
    label: "Additional comments",
    name: "comments",
    maxlength: 250,
    placeholder: "Describe your concern",
    description: "Provide any additional details about your inquiry",
  },
};

export const WithCharacterCountNearLimit: Story = {
  args: {
    id: "comments-near",
    label: "Additional comments",
    name: "comments",
    maxlength: 50,
    value: "This text is getting close to the character",
  },
};

export const HelperText: Story = {
  args: {
    id: "helper-input",
    label: "Phone number",
    name: "phone",
    type: "tel",
    inputmode: "tel",
    placeholder: "(555) 123-4567",
    messageState: "default",
    messageText: "We may call this number to verify your identity",
  },
};

export const EmailAddress: Story = {
  render: () => html`
    <form novalidate style="max-width: 328px;">
      <fd-label
        for="email-address"
        label="Email address"
        required
        description="We will use this email for updates about your submission."
      ></fd-label>
      <fd-input
        id="email-address"
        name="email"
        type="email"
        autocomplete="email"
        required
        placeholder="name@example.gov"
      ></fd-input>
      <fd-message
        for="email-address"
        state="default"
        message="Use the format name@example.gov"
        live="off"
      ></fd-message>
    </form>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Use `type=\"email\"` with `autocomplete=\"email\"` for contact email fields. Keep validation copy specific to the missing or malformed email value.",
      },
    },
  },
};

EmailAddress.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-input") as FdInputHost | null;
  const input = host?.shadowRoot?.querySelector("[part=native]") as HTMLInputElement | null;

  expect(input?.type).toBe("email");
  expect(input?.autocomplete).toBe("email");
  expect(input?.required).toBe(true);
};

export const UrlField: Story = {
  render: () => html`
    <form novalidate style="max-width: 328px;">
      <fd-label
        for="bank-website"
        label="Bank website"
        required
        description="Enter the public website for the institution."
      ></fd-label>
      <fd-input
        id="bank-website"
        name="website"
        type="url"
        autocomplete="url"
        required
        placeholder="https://www.examplebank.com"
      ></fd-input>
      <fd-message
        for="bank-website"
        state="default"
        message="Include http:// or https://"
        live="off"
      ></fd-message>
    </form>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Use `type=\"url\"` for web addresses and label the field by the URL being requested, such as bank website or agency website.",
      },
    },
  },
};

UrlField.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-input") as FdInputHost | null;
  const input = host?.shadowRoot?.querySelector("[part=native]") as HTMLInputElement | null;

  expect(input?.type).toBe("url");
  expect(input?.autocomplete).toBe("url");
  expect(input?.placeholder).toBe("https://www.examplebank.com");
};

// --- Fast-follow stories (pattern, minlength, live, numeric identifier) ---

export const PatternValidation: Story = {
  render: () => html`
    <form novalidate style="max-width: 328px;">
      <fd-label
        for="routing-pattern"
        label="Routing number"
        required
        description="9-digit number on the bottom of your check"
      ></fd-label>
      <fd-input
        id="routing-pattern"
        name="routing"
        required
        pattern="[0-9]{9}"
        inputmode="numeric"
        placeholder="e.g. 021000021"
        @input=${(e: Event) =>
          updateValidationMessage(e.currentTarget as FdInputHost, {
            isValid: (value) => /^[0-9]{9}$/.test(value),
            errorMessage: "Enter a valid 9-digit routing number",
          })}
      ></fd-input>
      <fd-message
        for="routing-pattern"
        state="default"
        message=""
        live="polite"
      ></fd-message>
    </form>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Validation lifecycle: the field can be internally invalid before it is visibly invalid. Blur after interaction or explicit reportValidity reveals the invalid state; correcting the value clears it. The authored `fd-message` remains the user-facing error copy.",
      },
    },
  },
};

export const ValidationLifecycle: Story = {
  render: () => html`
    <form style="display: grid; gap: 12px; max-width: 328px;">
      <fd-label
        for="lifecycle-routing"
        label="Routing number"
        required
        description="Enter a 9-digit routing number."
      ></fd-label>
      <fd-input
        id="lifecycle-routing"
        name="routing"
        required
        pattern="[0-9]{9}"
        inputmode="numeric"
        placeholder="e.g. 021000021"
      ></fd-input>
      <button type="submit">Submit</button>
    </form>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Lifecycle example: the field starts internally invalid but not visibly invalid. Submit reveals `data-user-invalid`, and entering a valid routing number clears both the styling and `aria-invalid`.",
      },
    },
  },
};

ValidationLifecycle.play = async ({ canvasElement }) => {
  const form = canvasElement.querySelector("form") as HTMLFormElement | null;
  const inputHost = form?.querySelector("fd-input") as FdInputHost | null;
  const input = inputHost?.shadowRoot?.querySelector("[part=native]") as HTMLInputElement | null;

  expect(inputHost?.hasAttribute("data-user-invalid")).toBe(false);

  form?.requestSubmit();

  await waitFor(() => {
    expect(inputHost?.hasAttribute("data-user-invalid")).toBe(true);
    expect(input?.getAttribute("aria-invalid")).toBe("true");
  });

  await userEvent.type(input!, "021000021");

  await waitFor(() => {
    expect(inputHost?.hasAttribute("data-user-invalid")).toBe(false);
    expect(input?.getAttribute("aria-invalid")).toBeNull();
  });
};

export const MinlengthWithHint: Story = {
  render: () => html`
    <form novalidate style="max-width: 328px;">
      <fd-label
        for="cert-minlen"
        label="Certificate number"
        required
        description="Must be at least 6 characters"
      ></fd-label>
      <fd-input
        id="cert-minlen"
        name="cert-number"
        required
        minlength="6"
        placeholder="e.g. CERT-001234"
        @input=${(e: Event) =>
          updateValidationMessage(e.currentTarget as FdInputHost, {
            isValid: (value) => value.length >= 6,
            errorMessage: "Certificate number must be at least 6 characters",
          })}
      ></fd-input>
      <fd-message
        for="cert-minlen"
        state="default"
        message=""
        live="polite"
      ></fd-message>
    </form>
  `,
};

export const NumericIdentifier: Story = {
  render: () => html`
    <div style="max-width: 328px;">
      <fd-label
        for="zip-numeric"
        label="ZIP code"
        required
        description="5-digit ZIP code"
      ></fd-label>
      <fd-input
        id="zip-numeric"
        name="zip"
        type="text"
        inputmode="numeric"
        pattern="[0-9]{5}"
        required
        maxlength="5"
        placeholder="e.g. 01234"
      ></fd-input>
      <fd-message
        for="zip-numeric"
        state="default"
        message="Use type=&quot;text&quot; with inputmode=&quot;numeric&quot; for numeric identifiers"
        live="off"
      ></fd-message>
    </div>
  `,
};

export const MessageLiveOff: Story = {
  render: () => html`
    <div style="max-width: 328px;">
      <fd-label
        for="static-hint"
        label="Phone number"
        description="We may call to verify your identity"
      ></fd-label>
      <fd-input
        id="static-hint"
        name="phone"
        type="tel"
        inputmode="tel"
        placeholder="(555) 123-4567"
      ></fd-input>
      <fd-message
        for="static-hint"
        state="default"
        message="Format: (XXX) XXX-XXXX"
        live="off"
      ></fd-message>
    </div>
  `,
};

export const MessageLivePolite: Story = {
  render: () => html`
    <div style="max-width: 328px;">
      <fd-label
        for="inline-val"
        label="Routing number"
        required
        description="9-digit number"
      ></fd-label>
      <fd-input
        id="inline-val"
        name="routing"
        required
        pattern="[0-9]{9}"
        inputmode="numeric"
        @input=${(e: Event) =>
          updateValidationMessage(e.currentTarget as FdInputHost, {
            isValid: (value) => /^[0-9]{9}$/.test(value),
            errorMessage: "Enter a valid 9-digit routing number",
          })}
      ></fd-input>
      <fd-message
        for="inline-val"
        state="default"
        message=""
        live="polite"
      ></fd-message>
    </div>
  `,
};

// --- Prefix/suffix slot stories ---

export const WithPrefixIcon: Story = {
  render: () => html`
    <div style="max-width: 328px;">
      <fd-label for="search-prefix" label="Search accounts"></fd-label>
      <fd-input
        id="search-prefix"
        name="account-search"
        type="search"
        autocomplete="off"
        placeholder="Search by name or number"
      >
        <fd-icon slot="prefix" name="magnifying-glass" aria-hidden="true"></fd-icon>
      </fd-input>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Use `type=\"search\"` when the field submits a query or filters a known set of results. The prefix icon is decorative because the visible label carries the purpose.",
      },
    },
  },
};

export const WithClearButton: Story = {
  render: () => html`
    <div style="max-width: 328px;">
      <fd-label for="search-clear" label="Search accounts"></fd-label>
      <fd-input
        id="search-clear"
        name="account-search"
        type="search"
        autocomplete="off"
        value="FDIC-insured banks"
      >
        <fd-icon slot="prefix" name="magnifying-glass" aria-hidden="true"></fd-icon>
        <button slot="suffix" type="button"
          aria-label="Clear search field"
          @click=${(e: Event) => {
            const input = (e.currentTarget as HTMLElement).closest("fd-input") as any;
            if (input) {
              input.value = "";
              input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
              input.focus();
            }
          }}>
          <fd-icon name="x" aria-hidden="true"></fd-icon>
        </button>
      </fd-input>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Clear buttons are suffix actions. After clearing, dispatch a standard `input` event and return focus to the input.",
      },
    },
  },
};

WithClearButton.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-input") as FdInputHost | null;
  const input = host?.shadowRoot?.querySelector("[part=native]") as HTMLInputElement | null;
  const clearButton = canvasElement.querySelector(
    'button[slot="suffix"]',
  ) as HTMLButtonElement | null;

  expect(input?.type).toBe("search");
  expect(host?.value).toBe("FDIC-insured banks");

  let inputEventCount = 0;
  host?.addEventListener("input", () => {
    inputEventCount += 1;
  });

  await userEvent.click(clearButton!);

  await waitFor(() => {
    expect(host?.value).toBe("");
    expect(input?.value).toBe("");
    expect(inputEventCount).toBe(1);
    expect(host?.shadowRoot?.activeElement).toBe(input);
  });
};

export const WithPasswordReveal: Story = {
  render: () => html`
    <div style="max-width: 328px;">
      <fd-label for="pw-reveal" label="Password" required></fd-label>
      <fd-input
        id="pw-reveal"
        type="password"
        name="password"
        autocomplete="current-password"
        required
      >
        <button slot="suffix" type="button"
          aria-label="Toggle password visibility"
          aria-pressed="false"
          @click=${(e: Event) => {
            const btn = e.currentTarget as HTMLButtonElement;
            const input = btn.closest("fd-input") as any;
            const isPressed = btn.getAttribute("aria-pressed") === "true";
            btn.setAttribute("aria-pressed", String(!isPressed));
            if (input) input.type = isPressed ? "password" : "text";
            const icon = btn.querySelector("fd-icon") as any;
            if (icon) icon.name = isPressed ? "eye" : "eye-slash";
          }}>
          <fd-icon name="eye" aria-hidden="true"></fd-icon>
        </button>
      </fd-input>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Password reveal uses a stable accessible label and `aria-pressed`. Use `autocomplete=\"current-password\"` for sign-in and `new-password` for create or reset flows.",
      },
    },
  },
};

WithPasswordReveal.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-input") as FdInputHost | null;
  const input = host?.shadowRoot?.querySelector("[part=native]") as HTMLInputElement | null;
  const toggle = canvasElement.querySelector(
    'button[slot="suffix"]',
  ) as HTMLButtonElement | null;

  expect(input?.type).toBe("password");
  expect(input?.autocomplete).toBe("current-password");
  expect(toggle?.getAttribute("aria-pressed")).toBe("false");

  await userEvent.click(toggle!);

  await waitFor(() => {
    expect(host?.type).toBe("text");
    expect(input?.type).toBe("text");
    expect(toggle?.getAttribute("aria-pressed")).toBe("true");
  });

  await userEvent.click(toggle!);

  await waitFor(() => {
    expect(host?.type).toBe("password");
    expect(input?.type).toBe("password");
    expect(toggle?.getAttribute("aria-pressed")).toBe("false");
  });
};

export const PrefixSuffixDisabled: Story = {
  render: () => html`
    <div style="max-width: 328px;">
      <fd-label for="disabled-slots" label="Search accounts"></fd-label>
      <fd-input id="disabled-slots" value="Previous search" disabled>
        <fd-icon slot="prefix" name="magnifying-glass" aria-hidden="true"></fd-icon>
        <button slot="suffix" type="button" aria-label="Clear search field" disabled>
          <fd-icon name="x" aria-hidden="true"></fd-icon>
        </button>
      </fd-input>
    </div>
  `,
};

export const PrefixSuffixError: Story = {
  render: () => html`
    <div style="max-width: 328px;">
      <fd-label for="error-slots" label="Search accounts" required></fd-label>
      <fd-input id="error-slots" value="invalid query" required>
        <fd-icon slot="prefix" name="magnifying-glass" aria-hidden="true"></fd-icon>
        <fd-icon slot="suffix" name="warning-circle" aria-hidden="true"></fd-icon>
      </fd-input>
      <fd-message for="error-slots" state="error" message="No results found for this query"></fd-message>
    </div>
  `,
};

export const DocsOverview: Story = {
  render: () => html`
    <div class=${DOCS_OVERVIEW_SPACIOUS_STACK_CLASS}>
      <div class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Default</p>
        <div style="max-width: 328px;">
          <fd-label for="docs-default" label="Account number"></fd-label>
          <fd-input
            id="docs-default"
            name="account"
            placeholder="e.g. 1234567890"
          ></fd-input>
        </div>
      </div>

      <div class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>With description</p>
        <div style="max-width: 328px;">
          <fd-label
            for="docs-desc"
            label="Routing number"
            required
            description="9-digit number on the bottom of your check"
          ></fd-label>
          <fd-input
            id="docs-desc"
            name="routing"
            required
            placeholder="e.g. 021000021"
          ></fd-input>
        </div>
      </div>

      <div class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Error state</p>
        <div style="max-width: 328px;">
          <fd-label
            for="docs-error"
            label="Routing number"
            required
          ></fd-label>
          <fd-input
            id="docs-error"
            name="routing"
            required
            value="12345"
          ></fd-input>
          <fd-message
            for="docs-error"
            state="error"
            message="Enter a valid 9-digit routing number"
          ></fd-message>
        </div>
      </div>

      <div class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Character count</p>
        <div style="max-width: 328px;">
          <fd-label
            for="docs-charcount"
            label="Additional comments"
          ></fd-label>
          <fd-input
            id="docs-charcount"
            name="comments"
            maxlength="250"
            placeholder="Describe your concern"
          ></fd-input>
        </div>
      </div>

      <div class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Disabled</p>
        <div style="max-width: 328px;">
          <fd-label for="docs-disabled" label="Institution name"></fd-label>
          <fd-input
            id="docs-disabled"
            name="institution"
            value="Federal Deposit Insurance Corporation"
            disabled
          ></fd-input>
        </div>
      </div>

      <div class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Read-only</p>
        <div style="max-width: 328px;">
          <fd-label for="docs-readonly" label="Certificate number"></fd-label>
          <fd-input
            id="docs-readonly"
            name="cert"
            value="CERT-2024-00847"
            readonly
          ></fd-input>
        </div>
      </div>

      <div class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>With prefix icon</p>
        <div style="max-width: 328px;">
          <fd-label for="docs-prefix" label="Search institutions"></fd-label>
          <fd-input
            id="docs-prefix"
            type="search"
            autocomplete="off"
            placeholder="Bank name or CERT number"
          >
            <fd-icon slot="prefix" name="magnifying-glass" aria-hidden="true"></fd-icon>
          </fd-input>
        </div>
      </div>

      <div class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Email</p>
        <div style="max-width: 328px;">
          <fd-label
            for="docs-email"
            label="Email address"
            required
            description="We will use this email for updates about your submission."
          ></fd-label>
          <fd-input
            id="docs-email"
            name="email"
            type="email"
            autocomplete="email"
            required
            placeholder="name@example.gov"
          ></fd-input>
        </div>
      </div>

      <div class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>URL</p>
        <div style="max-width: 328px;">
          <fd-label
            for="docs-url"
            label="Bank website"
            required
            description="Enter the public website for the institution."
          ></fd-label>
          <fd-input
            id="docs-url"
            name="website"
            type="url"
            autocomplete="url"
            required
            placeholder="https://www.examplebank.com"
          ></fd-input>
        </div>
      </div>

    </div>
  `,
};
