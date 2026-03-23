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

type FdInputHost = HTMLElement & { value?: string };
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
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    type: {
      control: "select",
      options: ["text", "email", "password", "tel", "url", "search"],
    },
    name: { control: "text" },
    value: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
    maxlength: { control: "number" },
    autocomplete: { control: "text" },
    inputmode: { control: "text" },
    messageState: {
      control: "select",
      options: ["default", "error", "warning", "success"],
    },
    messageText: { control: "text" },
  },
  args: {
    id: "account-number",
    label: "Account number",
    description: "",
    type: "text",
    name: "account-number",
    value: "",
    placeholder: "",
    disabled: false,
    readonly: false,
    required: false,
    maxlength: undefined,
    autocomplete: "",
    inputmode: "",
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
      <fd-input id="search-prefix" placeholder="Search by name or number">
        <fd-icon slot="prefix" name="magnifying-glass" aria-hidden="true"></fd-icon>
      </fd-input>
    </div>
  `,
};

export const WithClearButton: Story = {
  render: () => html`
    <div style="max-width: 328px;">
      <fd-label for="search-clear" label="Search accounts"></fd-label>
      <fd-input id="search-clear" value="FDIC-insured banks">
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
};

export const WithPasswordReveal: Story = {
  render: () => html`
    <div style="max-width: 328px;">
      <fd-label for="pw-reveal" label="Password" required></fd-label>
      <fd-input id="pw-reveal" type="password" name="password" required>
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

// --- fd-field composition stories ---

export const FieldComposition: Story = {
  args: {
    messageState: "error",
    messageText: "This is a test"
  },

  render: () => html`
    <fd-field style="max-width: 328px;">
      <fd-label label="Email address" required
        description="We'll never share your email"></fd-label>
      <fd-input name="email" type="email" required
        placeholder="you@example.com"
        @input=${(e: Event) =>
          updateValidationMessage(e.currentTarget as FdInputHost, {
            isValid: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            errorMessage: "Enter a valid email address",
          })}
      ></fd-input>
      <fd-message state="default" message="" live="polite"></fd-message>
    </fd-field>
  `
};

export const FieldWithPrefixSuffix: Story = {
  render: () => html`
    <fd-field style="max-width: 328px;">
      <fd-label label="Search institutions"></fd-label>
      <fd-input value="Community banks">
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
    </fd-field>
  `,
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_STACK_STYLE}>
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p style=${DOCS_OVERVIEW_HEADING_STYLE}>Default</p>
        <div style="max-width: 328px;">
          <fd-label for="docs-default" label="Account number"></fd-label>
          <fd-input
            id="docs-default"
            name="account"
            placeholder="e.g. 1234567890"
          ></fd-input>
        </div>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p style=${DOCS_OVERVIEW_HEADING_STYLE}>With description</p>
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

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p style=${DOCS_OVERVIEW_HEADING_STYLE}>Error state</p>
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

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p style=${DOCS_OVERVIEW_HEADING_STYLE}>Character count</p>
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

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p style=${DOCS_OVERVIEW_HEADING_STYLE}>Disabled</p>
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

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p style=${DOCS_OVERVIEW_HEADING_STYLE}>Read-only</p>
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

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p style=${DOCS_OVERVIEW_HEADING_STYLE}>With prefix icon</p>
        <div style="max-width: 328px;">
          <fd-label for="docs-prefix" label="Search institutions"></fd-label>
          <fd-input
            id="docs-prefix"
            placeholder="Bank name or CERT number"
          >
            <fd-icon slot="prefix" name="magnifying-glass" aria-hidden="true"></fd-icon>
          </fd-input>
        </div>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p style=${DOCS_OVERVIEW_HEADING_STYLE}>fd-field composition</p>
        <fd-field style="max-width: 328px;">
          <fd-label label="Account number" required
            description="Found on your bank statement"></fd-label>
          <fd-input name="account" required
            placeholder="e.g. 1234567890"></fd-input>
          <fd-message state="error"
            message="Enter a valid account number"></fd-message>
        </fd-field>
      </div>
    </div>
  `,
};
