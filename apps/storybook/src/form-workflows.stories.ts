import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import "@fdic-ds/components/register-all";
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

type FdRadioGroupHost = HTMLElement & {
  checkValidity(): boolean;
  reportValidity(): boolean;
};

const WORKFLOW_FORM_STYLE =
  "display: grid; gap: var(--fdic-spacing-lg, 1rem); max-width: 42rem;";

const ACTION_ROW_STYLE =
  "display: flex; gap: var(--fdic-spacing-sm, 0.75rem); align-items: center; flex-wrap: wrap;";

const NATIVE_BUTTON_STYLE =
  "font: inherit; padding: 0.625rem 1rem; border: 1px solid currentColor; background: transparent; cursor: pointer;";

const SECONDARY_LINK_STYLE = "font: inherit;";

const SUMMARY_SECTION_STYLE =
  "display: grid; gap: var(--fdic-spacing-sm, 0.75rem);";

const REVIEW_ROW_STYLE =
  "display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: var(--fdic-spacing-xs, 0.5rem) var(--fdic-spacing-md, 1rem); align-items: start;";

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
          direct-child text-entry composition, and a native submit button.
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
          <button type="submit" style=${NATIVE_BUTTON_STYLE}>Submit filing</button>
          <fd-button variant="subtle" type="button">Cancel</fd-button>
        </div>
      </form>
    </section>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "The canonical form recipe uses `fd-field` only for direct-child text-entry composition and keeps native submit behavior on a plain HTML button.",
      },
    },
  },
};

MinimumViableRecipe.play = async ({ canvasElement }) => {
  const fields = Array.from(canvasElement.querySelectorAll("fd-field"));
  const submit = canvasElement.querySelector('button[type="submit"]') as HTMLButtonElement | null;
  const cancel = canvasElement.querySelector("fd-button") as HTMLElement | null;

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
          <button type="submit" style=${NATIVE_BUTTON_STYLE}>Continue</button>
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
          <button type="submit" style=${NATIVE_BUTTON_STYLE}>Continue to review</button>
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

      summary.hidden = errors.length === 0;
      summary.innerHTML = errors.length
        ? `
          <h2 id="workflow-error-summary-title" style="margin: 0;">Fix the following before you continue</h2>
          <ul style="margin: 0; padding-inline-start: 1.25rem;">
            ${errors
              .map((error) => {
                const href =
                  error.key === "routing"
                    ? "#submission-routing"
                    : "#submission-contact-method";
                return `<li><a href="${href}">${error.text}</a></li>`;
              })
              .join("")}
          </ul>
        `
        : "";

      summary.onclick = (event) => {
        const target = event.target as HTMLElement | null;
        const link = target?.closest("a");

        if (!link) return;

        event.preventDefault();

        if (link.getAttribute("href") === "#submission-routing") {
          const control = getNativeInput(routingHost);
          control?.focus();
          control?.scrollIntoView({ block: "center" });
          return;
        }

        contactWrapper?.focus();
        contactWrapper?.scrollIntoView({ block: "center" });
      };

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
      const summary = form.querySelector("#workflow-error-summary") as HTMLElement | null;

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
          <section
            id="workflow-error-summary"
            tabindex="-1"
            aria-labelledby="workflow-error-summary-title"
            style=${SUMMARY_SECTION_STYLE}
            hidden
          ></section>

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
            <button type="submit" style=${NATIVE_BUTTON_STYLE}>Continue</button>
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
  ) as HTMLElement | null;
  const routingMessage = canvasElement.querySelector(
    'fd-message[for="submission-routing"]',
  ) as FdMessageHost | null;

  form?.requestSubmit();

  await waitFor(() => {
    expect(summary?.hidden).toBe(false);
    expect(routingMessage?.state).toBe("error");
    expect(group?.hasAttribute("data-user-invalid")).toBe(true);
  });

  expect(document.activeElement).toBe(summary);
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
        <section aria-labelledby="review-summary-title" style=${DOCS_OVERVIEW_SECTION_STYLE}>
          <h3 id="review-summary-title" style="margin: 0;">Submission summary</h3>

          <div style=${REVIEW_ROW_STYLE}>
            <div>
              <strong>Certificate number</strong>
              <div>12345</div>
            </div>
            <a href="#grouped-cert-number">Change</a>
          </div>

          <div style=${REVIEW_ROW_STYLE}>
            <div>
              <strong>Primary filing contact</strong>
              <div>Jordan Avery</div>
            </div>
            <a href="#grouped-contact-name">Change</a>
          </div>

          <div style=${REVIEW_ROW_STYLE}>
            <div>
              <strong>Follow-up method</strong>
              <div>Email</div>
            </div>
            <a href="#follow-up-title">Change</a>
          </div>
        </section>

        <div>
          <fd-checkbox name="attestation" value="confirmed">
            I confirm that this update is accurate to the best of my knowledge.
          </fd-checkbox>
        </div>

        <p style="margin: 0;">
          After submission, you will receive a confirmation number for your records.
        </p>

        <div style=${ACTION_ROW_STYLE}>
          <button type="submit" style=${NATIVE_BUTTON_STYLE}>Submit update</button>
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
          "Review is shown as a workflow state, not as a specialized component. Use explicit change paths and attestation where the submission creates a consequential record.",
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

      <fd-alert type="success" title="Your filing update was submitted">
        We recorded your request and sent a confirmation email to the filing contact on file.
      </fd-alert>

      <section aria-labelledby="record-title" style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <h3 id="record-title" style="margin: 0;">Keep this record</h3>
        <dl style="display: grid; grid-template-columns: max-content 1fr; gap: 0.5rem 1rem; margin: 0;">
          <dt><strong>Confirmation number</strong></dt>
          <dd style="margin: 0;">FDIC-2026-004182</dd>
          <dt><strong>Date submitted</strong></dt>
          <dd style="margin: 0;">March 26, 2026</dd>
          <dt><strong>Contact email</strong></dt>
          <dd style="margin: 0;">jordan.avery@example.gov</dd>
        </dl>
      </section>

      <section aria-labelledby="next-steps-title" style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <h3 id="next-steps-title" style="margin: 0;">What happens next</h3>
        <ul style="margin: 0; padding-inline-start: 1.25rem;">
          <li>A reviewer will examine the update within 2 business days.</li>
          <li>If clarification is needed, we will use the contact method you selected.</li>
          <li>Keep the confirmation number until the review is complete.</li>
        </ul>
      </section>
    </section>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Confirmation should state completion clearly, explain what happens next, and tell the person what record to keep.",
      },
    },
  },
};
