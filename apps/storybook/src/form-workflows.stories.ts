import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import "@jflamb/fdic-ds-components/register-all";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_STACK_STYLE,
} from "./docs-overview";

type FdInputHost = HTMLElement & {
  value: string;
  checkValidity(): boolean;
  reportValidity(): boolean;
  shadowRoot: ShadowRoot | null;
};

type FdMessageHost = HTMLElement & {
  state?: string;
  message?: string;
  live?: string;
};

type FdErrorSummaryHost = HTMLElement & {
  items: Array<{ href: string; text: string }>;
  open: boolean;
};

type FdRadioGroupHost = HTMLElement & {
  checkValidity(): boolean;
  reportValidity(): boolean;
};

const WORKFLOW_FORM_STYLE =
  "display: grid; gap: var(--fdic-spacing-lg, 1rem); max-width: 42rem;";

const ACTION_ROW_STYLE =
  "display: flex; gap: var(--fdic-spacing-sm, 0.75rem); align-items: center; flex-wrap: wrap;";

const SECONDARY_LINK_STYLE = "font: inherit;";

const meta = {
  title: "Patterns/Form Workflows",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "Workflow composition examples for high-stakes public-service forms. These stories intentionally use existing primitives and native HTML only; they do not imply approval of new workflow components.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function getNativeInput(host: FdInputHost | null) {
  return host?.shadowRoot?.querySelector("[part=native]") as HTMLInputElement | null;
}

function setRoutingMessage(
  message: FdMessageHost | null,
  {
    state,
    text,
    live,
  }: { state: "default" | "error"; text: string; live?: "polite" | "off" },
) {
  if (!message) return;
  message.state = state;
  message.message = text;
  message.live = live;
}

export const MinimumViableRecipe: Story = {
  render: () => html`
    <section style=${DOCS_OVERVIEW_STACK_STYLE} aria-labelledby="minimum-viable-form-title">
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Minimum viable recipe</strong>
        <h2 id="minimum-viable-form-title" style="margin: 0;">
          Canonical form composition
        </h2>
        <p style="margin: 0;">
          This is the narrow supported path: native form semantics, <code>fd-field</code> for
          direct-child text-entry composition, and a submit-capable <code>fd-button</code>.
        </p>
      </div>

      <form
        novalidate
        style=${WORKFLOW_FORM_STYLE}
        @submit=${(event: SubmitEvent) => event.preventDefault()}
      >
        <fd-field>
          <fd-label label="Institution name" required></fd-label>
          <fd-input name="institution-name" required></fd-input>
          <fd-message message="Enter the full legal name as it appears on the charter."></fd-message>
        </fd-field>

        <fd-field>
          <fd-label label="Certificate number" required></fd-label>
          <fd-input
            name="certificate-number"
            type="text"
            inputmode="numeric"
            pattern="[0-9]{5}"
            required
          ></fd-input>
          <fd-message message="Enter the 5-digit FDIC certificate number."></fd-message>
        </fd-field>

        <fd-field>
          <fd-label label="Additional notes"></fd-label>
          <fd-textarea name="additional-notes"></fd-textarea>
        </fd-field>

        <div style=${ACTION_ROW_STYLE}>
          <fd-button variant="primary" type="submit">Submit filing</fd-button>
          <fd-button variant="subtle" type="button">Cancel</fd-button>
        </div>
      </form>
    </section>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "The canonical form recipe uses `fd-field` only for direct-child text-entry composition and uses `fd-button type=\"submit\"` for the primary submit action.",
      },
    },
  },
};

MinimumViableRecipe.play = async ({ canvasElement }) => {
  const fields = Array.from(canvasElement.querySelectorAll("fd-field"));
  const submit = canvasElement.querySelector(
    'fd-button[type="submit"]',
  ) as HTMLElement | null;
  const cancel = canvasElement.querySelector(
    'fd-button[type="button"]',
  ) as HTMLElement | null;

  expect(fields).toHaveLength(3);
  expect(submit).toBeTruthy();
  expect(cancel?.getAttribute("type")).toBe("button");

  for (const field of fields.slice(0, 2)) {
    const label = field.querySelector("fd-label");
    const control = field.querySelector("fd-input");
    const message = field.querySelector("fd-message");

    await waitFor(() => {
      expect(control?.id.startsWith("fd-field-")).toBe(true);
      expect(label?.getAttribute("for")).toBe(control?.id);
      expect(message?.getAttribute("for")).toBe(control?.id);
    });
  }

  const textareaField = fields[2];
  const textareaLabel = textareaField.querySelector("fd-label");
  const textarea = textareaField.querySelector("fd-textarea");

  await waitFor(() => {
    expect(textarea?.id.startsWith("fd-field-")).toBe(true);
    expect(textareaLabel?.getAttribute("for")).toBe(textarea?.id);
  });
};

export const SingleQuestion: Story = {
  render: () => html`
    <section style=${DOCS_OVERVIEW_STACK_STYLE} aria-labelledby="single-question-title">
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Single-question workflow</strong>
        <h2 id="single-question-title" style="margin: 0;">
          Report the routing number used for this transfer
        </h2>
        <p style="margin: 0;">
          We use this number to match the report to the institution on file.
        </p>
      </div>

      <form
        novalidate
        style=${WORKFLOW_FORM_STYLE}
        @submit=${(event: SubmitEvent) => event.preventDefault()}
      >
        <div>
          <fd-label
            for="single-question-routing"
            label="Routing number"
            description="Enter the 9-digit number from the bottom of the check."
            required
          ></fd-label>
          <fd-input
            id="single-question-routing"
            name="routing-number"
            type="text"
            inputmode="numeric"
            pattern="[0-9]{9}"
            placeholder="e.g. 021000021"
            required
          ></fd-input>
          <fd-message
            for="single-question-routing"
            message="We only use this number to identify the institution tied to this report."
          ></fd-message>
        </div>

        <div style=${ACTION_ROW_STYLE}>
          <fd-button variant="primary" type="submit">Continue</fd-button>
          <a href="https://www.fdic.gov" style=${SECONDARY_LINK_STYLE}>
            See why we ask for this information
          </a>
        </div>
      </form>
    </section>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Use a single-question page when the answer is consequential, needs supporting explanation, or changes routing or eligibility. Keep the page narrow, left-aligned, and explicit.",
      },
    },
  },
};

export const GroupedSection: Story = {
  render: () => html`
    <section style=${DOCS_OVERVIEW_STACK_STYLE} aria-labelledby="grouped-section-title">
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Grouped sections</strong>
        <h2 id="grouped-section-title" style="margin: 0;">
          Update the contact information for this filing
        </h2>
        <p style="margin: 0;">
          Keep related questions together when they share the same context, instructions, or review needs.
        </p>
      </div>

      <form
        novalidate
        style=${WORKFLOW_FORM_STYLE}
        @submit=${(event: SubmitEvent) => event.preventDefault()}
      >
        <section aria-labelledby="institution-details-title" style=${DOCS_OVERVIEW_SECTION_STYLE}>
          <h3 id="institution-details-title" style="margin: 0;">Institution details</h3>
          <div>
            <fd-label
              for="grouped-cert-number"
              label="Certificate number"
              description="Use the FDIC certificate number assigned to the institution."
              required
            ></fd-label>
            <fd-input
              id="grouped-cert-number"
              name="certificate-number"
              required
            ></fd-input>
          </div>
          <div>
            <fd-label
              for="grouped-contact-name"
              label="Primary filing contact"
              description="Provide the person who can answer follow-up questions about this update."
              required
            ></fd-label>
            <fd-input id="grouped-contact-name" name="contact-name" required></fd-input>
          </div>
        </section>

        <section aria-labelledby="follow-up-title" style=${DOCS_OVERVIEW_SECTION_STYLE}>
          <h3 id="follow-up-title" style="margin: 0;">Follow-up preference</h3>
          <fd-radio-group required>
            <span slot="legend">How should we contact you if a reviewer needs clarification?</span>
            <span slot="description">
              Choose the contact method you monitor during the filing window.
            </span>
            <fd-radio name="follow-up-method" value="email">Email</fd-radio>
            <fd-radio name="follow-up-method" value="phone">Phone</fd-radio>
            <fd-radio name="follow-up-method" value="secure-message">
              Secure message
            </fd-radio>
            <span slot="error">Select one contact method.</span>
          </fd-radio-group>
        </section>

        <p style="margin: 0;">
          We use this information only to review and process this filing update.
        </p>

        <div style=${ACTION_ROW_STYLE}>
          <fd-button variant="primary" type="submit">Continue to review</fd-button>
        </div>
      </form>
    </section>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Group related inputs when they form one logical unit and benefit from shared instructions or trust language. Use semantic section headings and native grouping rather than inventing a wrapper component.",
      },
    },
  },
};

export const BlockedSubmitValidation: Story = {
  render: () => {
    const helperText =
      "We use this number to match the report to the institution on file.";
    const routingErrorText = "Enter a valid 9-digit routing number.";

    const updateSummary = (form: HTMLFormElement) => {
      const summary = form.querySelector("#workflow-error-summary") as HTMLElement | null;
      const routingHost = form.querySelector("#submission-routing") as FdInputHost | null;
      const contactWrapper = form.querySelector(
        "#submission-contact-method",
      ) as HTMLElement | null;
      const routingMessage = form.querySelector(
        'fd-message[for="submission-routing"]',
      ) as FdMessageHost | null;
      const group = form.querySelector("fd-radio-group") as FdRadioGroupHost | null;

      const errors: Array<{ key: string; text: string }> = [];

      if (routingMessage?.state === "error") {
        errors.push({ key: "routing", text: routingErrorText });
      }

      if (group && !group.checkValidity()) {
        errors.push({
          key: "contact",
          text: "Select how we should contact you if a reviewer needs clarification.",
        });
      }

      if (!summary) return errors;

      summary.items = errors.map((error) => ({
        href:
          error.key === "routing"
            ? "#submission-routing"
            : "#submission-contact-method",
        text: error.text,
      }));
      summary.open = errors.length > 0;

      return errors;
    };

    const syncRoutingValidation = (
      form: HTMLFormElement,
      { revealIfInvalid }: { revealIfInvalid: boolean },
    ) => {
      const routingHost = form.querySelector("#submission-routing") as FdInputHost | null;
      const routingMessage = form.querySelector(
        'fd-message[for="submission-routing"]',
      ) as FdMessageHost | null;

      if (!routingHost || !routingMessage) return;

      const value = routingHost.value?.trim() ?? "";
      const isValid = /^[0-9]{9}$/.test(value);

      if (!value) {
        setRoutingMessage(routingMessage, {
          state: revealIfInvalid ? "error" : "default",
          text: revealIfInvalid ? "Enter the routing number." : helperText,
          live: revealIfInvalid ? "polite" : "off",
        });
        if (revealIfInvalid) {
          routingHost.reportValidity();
        }
        updateSummary(form);
        return;
      }

      if (!isValid) {
        setRoutingMessage(routingMessage, {
          state: revealIfInvalid ? "error" : "default",
          text: revealIfInvalid ? routingErrorText : helperText,
          live: revealIfInvalid ? "polite" : "off",
        });
        if (revealIfInvalid) {
          routingHost.reportValidity();
        }
        updateSummary(form);
        return;
      }

      setRoutingMessage(routingMessage, {
        state: "default",
        text: helperText,
        live: "off",
      });
      routingHost.checkValidity();
      updateSummary(form);
    };

    const handleSubmit = (event: SubmitEvent) => {
      event.preventDefault();

      const form = event.currentTarget as HTMLFormElement;
      const routingHost = form.querySelector("#submission-routing") as FdInputHost | null;
      const group = form.querySelector("fd-radio-group") as FdRadioGroupHost | null;
      const summary = form.querySelector(
        "#workflow-error-summary",
      ) as FdErrorSummaryHost | null;

      syncRoutingValidation(form, { revealIfInvalid: true });

      if (group && !group.checkValidity()) {
        group.reportValidity();
      }

      const errors = updateSummary(form);

      if (errors.length > 0) {
        summary?.focus();
        return;
      }

      routingHost?.checkValidity();
    };

    const handleRoutingInput = (event: Event) => {
      const input = event.currentTarget as FdInputHost;
      const form = input.closest("form") as HTMLFormElement | null;

      if (!form) return;

      const message = form.querySelector(
        'fd-message[for="submission-routing"]',
      ) as FdMessageHost | null;
      const shouldReveal = message?.state === "error";

      syncRoutingValidation(form, { revealIfInvalid: Boolean(shouldReveal) });
    };

    const handleRoutingBlur = (event: FocusEvent) => {
      const input = event.currentTarget as FdInputHost;
      const form = input.closest("form") as HTMLFormElement | null;

      if (!form) return;

      syncRoutingValidation(form, { revealIfInvalid: true });
    };

    const handleGroupChange = (event: Event) => {
      const group = event.currentTarget as FdRadioGroupHost;
      const form = group.closest("form") as HTMLFormElement | null;

      if (!form) return;

      updateSummary(form);
    };

    return html`
      <section style=${DOCS_OVERVIEW_STACK_STYLE} aria-labelledby="blocked-submit-title">
        <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
          <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Blocked submit with recovery</strong>
          <h2 id="blocked-submit-title" style="margin: 0;">
            Submit a contact-method update for this filing
          </h2>
          <p style="margin: 0;">
            This example shows submit-scoped error summary behavior working with inline field and group errors.
          </p>
        </div>

        <form novalidate style=${WORKFLOW_FORM_STYLE} @submit=${handleSubmit}>
          <fd-error-summary
            id="workflow-error-summary"
            heading="Fix the following before you continue"
            intro="Review each item and return to the linked field or group."
            autofocus
          ></fd-error-summary>

          <div>
            <fd-label
              for="submission-routing"
              label="Routing number"
              description="Enter the 9-digit number used for this transfer report."
              required
            ></fd-label>
            <fd-input
              id="submission-routing"
              name="routing-number"
              type="text"
              inputmode="numeric"
              value="12345"
              required
              @input=${handleRoutingInput}
              @focusout=${handleRoutingBlur}
            ></fd-input>
            <fd-message
              for="submission-routing"
              message=${helperText}
              live="off"
            ></fd-message>
          </div>

          <section
            id="submission-contact-method"
            tabindex="-1"
            aria-labelledby="submission-contact-method-title"
            style=${DOCS_OVERVIEW_SECTION_STYLE}
          >
            <h3 id="submission-contact-method-title" style="margin: 0;">
              Follow-up preference
            </h3>
            <fd-radio-group required @fd-radio-group-change=${handleGroupChange}>
              <span slot="legend">
                How should we contact you if a reviewer needs clarification?
              </span>
              <span slot="description">
                Choose the method you will monitor during the filing window.
              </span>
              <fd-radio name="contact-method" value="email">Email</fd-radio>
              <fd-radio name="contact-method" value="phone">Phone</fd-radio>
              <fd-radio name="contact-method" value="secure-message">
                Secure message
              </fd-radio>
              <span slot="error">
                Select how we should contact you if a reviewer needs clarification.
              </span>
            </fd-radio-group>
          </section>

          <div style=${ACTION_ROW_STYLE}>
            <fd-button variant="primary" type="submit">Continue</fd-button>
          </div>
        </form>
      </section>
    `;
  },
  parameters: {
    docs: {
      description: {
        story:
          "Submit reveals a top-of-page summary and inline correction surfaces together. The routing value remains intact after failure, and the summary moves focus without replacing inline errors.",
      },
    },
  },
};

BlockedSubmitValidation.play = async ({ canvasElement }) => {
  const form = canvasElement.querySelector("form") as HTMLFormElement | null;
  const routingHost = canvasElement.querySelector("#submission-routing") as
    | FdInputHost
    | null;
  const group = canvasElement.querySelector("fd-radio-group") as FdRadioGroupHost | null;
  const summary = canvasElement.querySelector(
    "#workflow-error-summary",
  ) as FdErrorSummaryHost | null;
  const routingMessage = canvasElement.querySelector(
    'fd-message[for="submission-routing"]',
  ) as FdMessageHost | null;

  form?.requestSubmit();

  await waitFor(() => {
    expect(summary?.open).toBe(true);
    expect(routingMessage?.state).toBe("error");
    expect(group?.hasAttribute("data-user-invalid")).toBe(true);
  });

  expect(routingHost?.value).toBe("12345");
};

export const ReviewBeforeSubmit: Story = {
  render: () => html`
    <section style=${DOCS_OVERVIEW_STACK_STYLE} aria-labelledby="review-title">
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Review before submit</strong>
        <h2 id="review-title" style="margin: 0;">
          Review the information before you submit this filing update
        </h2>
        <p style="margin: 0;">
          Use a review state when the submission creates an official record or carries legal or financial consequences.
        </p>
      </div>

      <form
        novalidate
        style=${WORKFLOW_FORM_STYLE}
        @submit=${(event: SubmitEvent) => event.preventDefault()}
      >
        <fd-review-list
          heading="Submission summary"
          dividers
          .items=${[
            {
              label: "Certificate number",
              value: "12345",
              href: "#grouped-cert-number",
            },
            {
              label: "Primary filing contact",
              value: "Jordan Avery",
              href: "#grouped-contact-name",
            },
            {
              label: "Follow-up method",
              value: "Email",
              href: "#follow-up-title",
            },
          ]}
        ></fd-review-list>

        <div>
          <fd-checkbox name="attestation" value="confirmed">
            I confirm that this update is accurate to the best of my knowledge.
          </fd-checkbox>
        </div>

        <p style="margin: 0;">
          After submission, you will receive a confirmation number for your records.
        </p>

        <div style=${ACTION_ROW_STYLE}>
          <fd-button variant="primary" type="submit">Submit update</fd-button>
          <a href="https://www.fdic.gov" style=${SECONDARY_LINK_STYLE}>
            Return to the draft
          </a>
        </div>
      </form>
    </section>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Review uses `fd-review-list` for the repeated label, value, and change-action shell while keeping attestation and submit behavior outside the component.",
      },
    },
  },
};

export const ConfirmationKeepRecord: Story = {
  render: () => html`
    <section style=${DOCS_OVERVIEW_STACK_STYLE} aria-labelledby="confirmation-title">
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Confirmation and record-keeping</strong>
        <h2 id="confirmation-title" style="margin: 0;">
          Submission complete
        </h2>
      </div>

      <fd-confirmation-record
        heading="Your filing update was submitted"
        summary="We recorded your request and sent a confirmation email to the filing contact on file."
        reference-label="Confirmation number"
        reference-value="FDIC-2026-004182"
        next-steps="A reviewer will examine the update within 2 business days. If clarification is needed, we will use the contact method you selected."
        record-note="Keep the confirmation number until the review is complete."
      >
        <a slot="actions" href="https://www.fdic.gov">Return to filing dashboard</a>
        <a slot="actions" href="https://www.fdic.gov">Print confirmation</a>
      </fd-confirmation-record>
    </section>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Confirmation uses `fd-confirmation-record` for completion, next steps, and record-keeping content while keeping routing and follow-up actions authored by the page.",
      },
    },
  },
};
