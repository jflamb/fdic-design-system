import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";

export const PAGE_FEEDBACK_VIEWS = [
  "prompt",
  "survey",
  "report",
  "thanks",
] as const;

export type PageFeedbackView = (typeof PAGE_FEEDBACK_VIEWS)[number];
export type PageFeedbackViewChangeReason =
  | "yes"
  | "no"
  | "report"
  | "cancel-survey"
  | "cancel-report"
  | "submit-report"
  | "external";

export interface PageFeedbackViewChangeDetail {
  view: PageFeedbackView;
  previousView: PageFeedbackView;
  reason: PageFeedbackViewChangeReason;
}

export interface PageFeedbackReportSubmitDetail {
  tryingToDo: string;
  wentWrong: string;
}

const VIEW_SET = new Set<PageFeedbackView>(PAGE_FEEDBACK_VIEWS);
const STAR_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z"/></svg>';
const ARROW_SQUARE_OUT_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z"/></svg>';

function normalizeView(value: string | undefined): PageFeedbackView {
  return value && VIEW_SET.has(value as PageFeedbackView)
    ? (value as PageFeedbackView)
    : "prompt";
}

type FocusTarget =
  | "survey-link"
  | "survey-cancel"
  | "report-trigger"
  | "report-field"
  | "no-button"
  | "thanks";

/**
 * `fd-page-feedback` — Inline page feedback pattern with usefulness, survey,
 * report, and acknowledgement states.
 */
export class FdPageFeedback extends LitElement {
  static properties = {
    view: { reflect: true },
    surveyHref: { attribute: "survey-href", reflect: true },
    surveyTarget: { attribute: "survey-target", reflect: true },
    surveyRel: { attribute: "survey-rel", reflect: true },
    _tryingToDo: { state: true },
    _wentWrong: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      font-family: var(
        --fdic-font-family-sans-serif,
        "Source Sans 3",
        "Source Sans Pro",
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        "Helvetica Neue",
        Arial,
        sans-serif
      );
      color: var(--ds-color-text-primary);
    }

    :host([hidden]) {
      display: none;
    }

    .base {
      position: relative;
      display: block;
      box-sizing: border-box;
      padding-block: var(--fd-page-feedback-block-padding, 24px);
      padding-inline: var(--fd-page-feedback-inline-padding, 64px);
      background: var(
        --fd-page-feedback-background,
        var(--ds-color-bg-base)
      );
    }

    .base::before {
      content: "";
      position: absolute;
      inset-block-start: 0;
      inset-inline: var(--fd-page-feedback-inline-padding, 64px);
      block-size: 4px;
      background: var(
        --fd-page-feedback-border-image,
        var(
          --ds-gradient-brand-core,
          linear-gradient(
            135deg in oklch,
            var(--ds-color-primary-500),
            var(--ds-color-primary-400)
          )
        )
      );
      pointer-events: none;
    }

    .panel {
      display: flex;
      flex-direction: column;
      gap: var(--fd-page-feedback-gap, 16px);
      min-inline-size: 0;
    }

    .panel--prompt {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      flex-wrap: wrap;
    }

    .prompt-shell {
      display: flex;
      align-items: center;
      gap: 24px;
      flex: 1 1 auto;
      min-inline-size: 0;
    }

    [part="prompt"] {
      margin: 0;
      color: inherit;
      overflow-wrap: anywhere;
    }

    .prompt-copy {
      font-size: var(--fdic-font-size-body, 1.125rem);
      font-weight: 400;
      line-height: 1.375;
      overflow-wrap: anywhere;
      max-inline-size: var(--fd-page-feedback-prompt-max-width, 344px);
    }

    .prompt-copy--heading {
      font-size: var(--fd-page-feedback-heading-size, 22.5px);
      font-weight: 600;
      line-height: 1.25;
      max-inline-size: none;
    }

    .survey-body {
      margin: 0;
      font-size: var(--fdic-font-size-body, 1.125rem);
      font-weight: 400;
      line-height: 1.375;
      max-inline-size: 45rem;
      overflow-wrap: anywhere;
    }

    fd-button-group.responses {
      inline-size: 100%;
      min-inline-size: 0;
      flex: 1 1 auto;
      --fd-button-group-gap: var(
        --fd-page-feedback-action-gap,
        var(--fdic-spacing-sm, 0.75rem)
      );
    }

    fd-button.choice-button {
      inline-size: 80px;
      min-inline-size: 80px;
      flex: none;
    }

    fd-button.report-trigger {
      inline-size: min(100%, 292px);
      flex: none;
    }

    fd-button.send-button {
      flex: none;
    }

    .survey-link-row {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      min-inline-size: 0;
      color: var(--ds-color-text-link, #1278b0);
    }

    .survey-link-icon {
      display: inline-grid;
      place-content: center;
      inline-size: 18px;
      block-size: 18px;
      flex: none;
      color: currentColor;
    }

    .report-fields {
      display: grid;
      gap: 16px;
      inline-size: min(100%, 45rem);
    }

    .report-field {
      display: grid;
      gap: 6px;
    }

    .report-field fd-textarea {
      --fd-textarea-min-height: 84px;
      inline-size: 100%;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: var(
        --fd-page-feedback-action-gap,
        var(--fd-button-group-gap, var(--fdic-spacing-sm, 0.75rem))
      );
      flex-wrap: wrap;
      min-inline-size: 0;
    }

    [part="actions"] {
      display: block;
    }

    fd-button-group.actions {
      inline-size: 100%;
      min-inline-size: 0;
      flex: 1 1 auto;
      --fd-button-group-gap: var(
        --fd-page-feedback-action-gap,
        var(--fdic-spacing-sm, 0.75rem)
      );
    }

    [part="thank-you"] {
      margin: 0;
      display: inline-block;
      color: var(--fd-page-feedback-thank-you-color, inherit);
      font-size: var(--fdic-font-size-body-big, 1.25rem);
      font-weight: 450;
      overflow-wrap: anywhere;
      line-height: 1.25;
      outline-color: transparent;
    }

    @media (max-width: 640px) {
      .base {
        padding-block: var(--fd-page-feedback-block-padding-mobile, 20px);
        padding-inline: var(--fd-page-feedback-inline-padding-mobile, 16px);
      }

      .base::before {
        inset-inline: var(--fd-page-feedback-inline-padding-mobile, 16px);
      }

      .panel--prompt,
      .prompt-shell {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .prompt-shell {
        inline-size: 100%;
      }

      .prompt-copy {
        font-size: var(--fdic-font-size-body-small, 1rem);
      }

      .prompt-copy--heading {
        font-size: 18px;
      }

      .survey-body {
        font-size: var(--fdic-font-size-body-small, 1rem);
      }

      fd-button.choice-button {
        inline-size: 64px;
        min-inline-size: 64px;
        --fd-button-font-size: var(--fdic-font-size-body-small, 1rem);
      }

      fd-button.report-trigger,
      fd-button.send-button {
        inline-size: 100%;
        min-inline-size: 64px;
        --fd-button-font-size: var(--fdic-font-size-body-small, 1rem);
      }

      .survey-link-icon {
        inline-size: 16px;
        block-size: 16px;
      }

      [part="thank-you"] {
        font-size: var(--fdic-font-size-body, 1.125rem);
      }
    }

    @media (forced-colors: active) {
      .base::before {
        background: Highlight;
      }
    }
  `;

  declare view: PageFeedbackView;
  declare surveyHref: string | undefined;
  declare surveyTarget: string | undefined;
  declare surveyRel: string | undefined;
  declare _tryingToDo: string;
  declare _wentWrong: string;

  private static _instanceCount = 0;
  private readonly _ids: Record<string, string>;
  private _pendingViewChangeReason: PageFeedbackViewChangeReason | null = null;
  private _pendingFocusTarget: FocusTarget | null = null;

  constructor() {
    super();
    this.view = "prompt";
    this.surveyHref = undefined;
    this.surveyTarget = undefined;
    this.surveyRel = undefined;
    this._tryingToDo = "";
    this._wentWrong = "";

    const suffix = FdPageFeedback._instanceCount++;
    this._ids = {
      prompt: `fd-page-feedback-prompt-${suffix}`,
      survey: `fd-page-feedback-survey-${suffix}`,
      report: `fd-page-feedback-report-${suffix}`,
      thanks: `fd-page-feedback-thanks-${suffix}`,
      trying: `fd-page-feedback-trying-${suffix}`,
      wrong: `fd-page-feedback-wrong-${suffix}`,
    };
  }

  override willUpdate(changed: PropertyValues<this>) {
    if (changed.has("view")) {
      const normalized = normalizeView(this.view);
      if (normalized !== this.view) {
        this.view = normalized;
      }
    }
  }

  override updated(changed: PropertyValues<this>) {
    if (!changed.has("view")) {
      return;
    }

    const previousView = normalizeView(changed.get("view") as string | undefined);
    const reason = this._pendingViewChangeReason ?? "external";
    const focusTarget = this._pendingFocusTarget;

    this._pendingViewChangeReason = null;
    this._pendingFocusTarget = null;

    this.dispatchEvent(
      new CustomEvent<PageFeedbackViewChangeDetail>("fd-page-feedback-view-change", {
        bubbles: true,
        composed: true,
        detail: {
          view: this.view,
          previousView,
          reason,
        },
      }),
    );

    if (focusTarget) {
      this.updateComplete.then(() => {
        requestAnimationFrame(() => this._focusByTarget(focusTarget));
      });
    }
  }

  private get _activeLabelId() {
    switch (this.view) {
      case "survey":
        return this._ids.survey;
      case "report":
        return this._ids.report;
      case "thanks":
        return this._ids.thanks;
      case "prompt":
      default:
        return this._ids.prompt;
    }
  }

  private _setView(
    view: PageFeedbackView,
    reason: PageFeedbackViewChangeReason,
    focusTarget?: FocusTarget,
  ) {
    if (this.view === view && !focusTarget) {
      return;
    }

    this._pendingViewChangeReason = reason;
    this._pendingFocusTarget = focusTarget ?? null;
    this.view = view;
  }

  private _focusByTarget(target: FocusTarget) {
    const lookup: Record<FocusTarget, string> = {
      "survey-link": '[data-focus-target="survey-link"]',
      "survey-cancel": '[data-focus-target="survey-cancel"]',
      "report-trigger": '[data-focus-target="report-trigger"]',
      "report-field": '[data-focus-target="report-field"]',
      "no-button": '[data-focus-target="no-button"]',
      thanks: '[data-focus-target="thanks"]',
    };

    this.shadowRoot
      ?.querySelector<HTMLElement>(lookup[target])
      ?.focus();
  }

  private _resetDraftValues() {
    this._tryingToDo = "";
    this._wentWrong = "";
  }

  private _onYes() {
    this._setView("thanks", "yes", "thanks");
  }

  private _onNo() {
    this._setView(
      "survey",
      "no",
      this.surveyHref ? "survey-link" : "survey-cancel",
    );
  }

  private _onReportOpen() {
    this._setView("report", "report", "report-field");
  }

  private _onSurveyCancel() {
    this._setView("prompt", "cancel-survey", "no-button");
  }

  private _onReportCancel() {
    this._resetDraftValues();
    this._setView("prompt", "cancel-report", "report-trigger");
  }

  private _onTryingInput(event: Event) {
    const target = event.target as HTMLElement & { value?: string };
    this._tryingToDo = target.value ?? "";
  }

  private _onWrongInput(event: Event) {
    const target = event.target as HTMLElement & { value?: string };
    this._wentWrong = target.value ?? "";
  }

  private _onReportSubmit() {
    const submitEvent =
      new CustomEvent<PageFeedbackReportSubmitDetail>("fd-page-feedback-report-submit", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          tryingToDo: this._tryingToDo.trim(),
          wentWrong: this._wentWrong.trim(),
        },
      });

    const shouldContinue = this.dispatchEvent(submitEvent);
    if (!shouldContinue) {
      return;
    }

    this._resetDraftValues();
    this._setView("thanks", "submit-report", "thanks");
  }

  private _renderPromptView() {
    return html`
      <div class="panel panel--prompt">
        <div class="prompt-shell">
          <p
            id=${this._ids.prompt}
            part="prompt"
            class="prompt-copy"
          >
            Is this page useful?
          </p>
          <fd-button-group part="responses" class="responses" label="Page feedback responses">
            <fd-button
              class="choice-button"
              variant="neutral"
              @click=${this._onYes}
            >
              Yes
            </fd-button>
            <fd-button
              class="choice-button"
              variant="neutral"
              data-focus-target="no-button"
              @click=${this._onNo}
            >
              No
            </fd-button>
          </fd-button-group>
        </div>
        <div part="actions" class="actions">
          <fd-button
            class="report-trigger"
            variant="neutral"
            data-focus-target="report-trigger"
            @click=${this._onReportOpen}
          >
            <span slot="icon-start" aria-hidden="true">${unsafeSVG(STAR_ICON)}</span>
            Report a problem with this page
          </fd-button>
        </div>
      </div>
    `;
  }

  private _renderSurveyLink(): TemplateResult | typeof nothing {
    if (!this.surveyHref) {
      return nothing;
    }

    return html`
      <div part="survey-link" class="survey-link-row">
        <fd-link
          href=${this.surveyHref}
          target=${ifDefined(this.surveyTarget)}
          rel=${ifDefined(this.surveyRel)}
          data-focus-target="survey-link"
        >
          Please complete this survey
        </fd-link>
        <span class="survey-link-icon" aria-hidden="true">
          ${unsafeSVG(ARROW_SQUARE_OUT_ICON)}
        </span>
      </div>
    `;
  }

  private _renderSurveyView() {
    return html`
      <div class="panel">
        <p
          id=${this._ids.survey}
          part="prompt"
          class="prompt-copy prompt-copy--heading"
        >
          Help us improve FDICnet
        </p>
        <p class="survey-body">
          To help us improve FDICnet, we’d like to know more about your visit today.
        </p>
        ${this._renderSurveyLink()}
        <div part="actions" class="actions">
          <fd-button
            variant="neutral"
            data-focus-target="survey-cancel"
            @click=${this._onSurveyCancel}
          >
            Cancel
          </fd-button>
        </div>
      </div>
    `;
  }

  private _renderReportField(
    id: string,
    label: string,
    value: string,
    onInput: (event: Event) => void,
    focusTarget?: FocusTarget,
  ) {
    return html`
      <div class="report-field">
        <fd-label for=${id} label=${label}></fd-label>
        <fd-textarea
          id=${id}
          rows="3"
          .value=${value}
          data-focus-target=${ifDefined(focusTarget)}
          @input=${onInput}
        ></fd-textarea>
      </div>
    `;
  }

  private _renderReportView() {
    return html`
      <div class="panel">
        <p
          id=${this._ids.report}
          part="prompt"
          class="prompt-copy prompt-copy--heading"
        >
          Report a problem with this page
        </p>
        <div part="report-fields" class="report-fields">
          ${this._renderReportField(
            this._ids.trying,
            "What were you trying to do?",
            this._tryingToDo,
            this._onTryingInput,
            "report-field",
          )}
          ${this._renderReportField(
            this._ids.wrong,
            "What went wrong?",
            this._wentWrong,
            this._onWrongInput,
          )}
        </div>
        <fd-button-group part="actions" class="actions" label="Report actions">
          <fd-button
            class="send-button"
            variant="primary"
            @click=${this._onReportSubmit}
          >
            <span slot="icon-start" aria-hidden="true">${unsafeSVG(STAR_ICON)}</span>
            Send report
          </fd-button>
          <fd-button
            variant="neutral"
            data-focus-target="report-cancel"
            @click=${this._onReportCancel}
          >
            Cancel
          </fd-button>
        </fd-button-group>
      </div>
    `;
  }

  private _renderThanksView() {
    return html`
      <p
        id=${this._ids.thanks}
        part="thank-you"
        role="status"
        aria-live="polite"
        tabindex="-1"
        data-focus-target="thanks"
      >
        Thank you for your feedback
      </p>
    `;
  }

  render() {
    const view = normalizeView(this.view);

    return html`
      <div
        part="base"
        class="base"
        role="group"
        aria-labelledby=${this._activeLabelId}
      >
        ${view === "survey"
          ? this._renderSurveyView()
          : view === "report"
            ? this._renderReportView()
            : view === "thanks"
              ? this._renderThanksView()
              : this._renderPromptView()}
      </div>
    `;
  }
}
