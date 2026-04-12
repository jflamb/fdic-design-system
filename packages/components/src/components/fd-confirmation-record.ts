import { LitElement, css, html, nothing } from "lit";

export type ConfirmationRecordVariant = "confirmation" | "receipt";
export type ConfirmationRecordStatus = "success" | "pending";

/**
 * `fd-confirmation-record` — Completion and receipt summary for consequential
 * submissions.
 */
export class FdConfirmationRecord extends LitElement {
  static properties = {
    heading: { reflect: true },
    summary: { reflect: true },
    referenceLabel: { attribute: "reference-label", reflect: true },
    referenceValue: { attribute: "reference-value", reflect: true },
    nextSteps: { attribute: "next-steps", reflect: true },
    recordNote: { attribute: "record-note", reflect: true },
    variant: { reflect: true },
    status: { reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      font-family: var(--fdic-font-family-sans-serif, "Source Sans 3", sans-serif);
      color: var(--fdic-color-text-primary, #212123);
    }

    [part="base"] {
      display: grid;
      gap: var(--fdic-spacing-lg, 20px);
      padding: var(--fdic-spacing-xl, 24px);
      border: 1px solid var(--fdic-color-border-divider, #d6d6d8);
      border-radius: var(--fdic-corner-radius-md, 5px);
      background: var(--fdic-color-bg-base, #ffffff);
    }

    :host([status="success"]) [part="base"] {
      border-inline-start: 4px solid var(--fdic-color-semantic-border-success, #1e8232);
    }

    :host([status="pending"]) [part="base"] {
      border-inline-start: 4px solid var(--fdic-color-semantic-border-warning, #8a6100);
    }

    [part="heading"] {
      margin: 0;
      font-size: var(--fdic-font-size-h3, 1.5rem);
      line-height: 1.2;
    }

    [part="summary"],
    [part="next-steps"],
    [part="record-note"] {
      margin: 0;
      line-height: 1.375;
    }

    [part="reference"] {
      display: grid;
      gap: var(--fdic-spacing-2xs, 4px);
      padding: var(--fdic-spacing-md, 16px);
      background: var(--fdic-color-bg-container, #f5f5f7);
      border-radius: var(--fdic-corner-radius-sm, 3px);
    }

    [part="reference-label"] {
      margin: 0;
      font-size: var(--fdic-font-size-body-small, 1rem);
      color: var(--fdic-color-text-secondary, #595961);
    }

    [part="reference-value"] {
      margin: 0;
      font-size: var(--fdic-font-size-h4, 1.25rem);
      font-weight: 700;
      line-height: 1.2;
    }

    [part="actions"] {
      display: flex;
      flex-wrap: wrap;
      gap: var(--fdic-spacing-sm, 12px);
    }

    [part="record-note"] {
      color: var(--fdic-color-text-secondary, #595961);
    }
  `;

  declare heading: string;
  declare summary: string | undefined;
  declare referenceLabel: string;
  declare referenceValue: string | undefined;
  declare nextSteps: string | undefined;
  declare recordNote: string | undefined;
  declare variant: ConfirmationRecordVariant;
  declare status: ConfirmationRecordStatus;

  constructor() {
    super();
    this.heading = "Submission complete";
    this.summary = undefined;
    this.referenceLabel = "Confirmation number";
    this.referenceValue = undefined;
    this.nextSteps = undefined;
    this.recordNote = undefined;
    this.variant = "confirmation";
    this.status = "success";
  }

  render() {
    return html`
      <section part="base" aria-label=${this.variant}>
        <div part="header">
          <h2 part="heading">${this.heading}</h2>
          ${this.summary
            ? html`<p part="summary">${this.summary}</p>`
            : nothing}
        </div>

        ${this.referenceValue
          ? html`
              <section part="reference">
                <p part="reference-label">${this.referenceLabel}</p>
                <p part="reference-value">${this.referenceValue}</p>
              </section>
            `
          : nothing}

        ${this.nextSteps
          ? html`<p part="next-steps">${this.nextSteps}</p>`
          : nothing}

        <div part="actions">
          <slot name="actions"></slot>
        </div>

        ${this.recordNote
          ? html`<p part="record-note">${this.recordNote}</p>`
          : nothing}
      </section>
    `;
  }
}
