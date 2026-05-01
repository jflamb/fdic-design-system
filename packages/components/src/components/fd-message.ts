import { LitElement, html, nothing } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { iconRegistry } from "../icons/registry.js";
import {
  REGULAR_CHECK_CIRCLE_ICON_SVG,
  REGULAR_WARNING_CIRCLE_ICON_SVG,
  REGULAR_WARNING_ICON_SVG,
} from "./regular-icons.js";

export type MessageState = "default" | "error" | "warning" | "success";
export type LiveMode = "polite" | "off";

const MESSAGE_ICON_NAMES: Record<Exclude<MessageState, "default">, string> = {
  error: "warning-circle",
  warning: "warning",
  success: "check-circle",
};

const MESSAGE_FALLBACK_ICON_SVG: Record<
  Exclude<MessageState, "default">,
  string
> = {
  error: REGULAR_WARNING_CIRCLE_ICON_SVG,
  warning: REGULAR_WARNING_ICON_SVG,
  success: REGULAR_CHECK_CIRCLE_ICON_SVG,
};

function decorateMessageIcon(svg: string): string {
  return svg.replace("<svg ", '<svg class="fd-message__icon" aria-hidden="true" ');
}

/**
 * `fd-message` — A validation/helper message component for form fields.
 *
 * Renders in **light DOM** (no shadow root) so sibling components like
 * `fd-input` can read the message element's ID for `aria-describedby`
 * wiring across the same DOM tree.
 *
 * `fd-message` itself does not mutate any sibling attributes. It renders
 * a message element with a deterministic ID and exposes stable public
 * getters (`messageId`, `state`) for sibling discovery.
 *
 * @example
 * ```html
 * <fd-label for="routing" label="Routing number" required></fd-label>
 * <fd-input id="routing" name="routing" required></fd-input>
 * <fd-message for="routing" state="error"
 *   message="Enter a valid 9-digit routing number"></fd-message>
 * ```
 */
export class FdMessage extends LitElement {
  static properties = {
    for: { reflect: true },
    state: { reflect: true },
    message: { reflect: true },
    live: { reflect: true },
  };

  declare for: string | undefined;
  declare state: MessageState;
  declare message: string;
  declare live: LiveMode | undefined;

  private static _instanceCounter = 0;
  private _instanceId: number;

  constructor() {
    super();
    this.for = undefined;
    this.state = "default";
    this.message = "";
    this.live = undefined;
    this._instanceId = FdMessage._instanceCounter++;
  }

  /** Render into light DOM — no shadow root. */
  override createRenderRoot() {
    return this;
  }

  /**
   * Stable public getter for the message element's ID.
   * Used by sibling `fd-input` to wire `aria-describedby`.
   */
  get messageId(): string {
    return `fdm-${this._instanceId}`;
  }

  private get _hasMessage(): boolean {
    return Boolean(this.message?.trim());
  }

  private _renderIcon() {
    if (this.state === "default" || !this._hasMessage) return nothing;

    const state = this.state as Exclude<MessageState, "default">;
    const svg =
      iconRegistry.get(MESSAGE_ICON_NAMES[state]) ??
      MESSAGE_FALLBACK_ICON_SVG[state];

    return html`${unsafeSVG(decorateMessageIcon(svg))}`;
  }

  // --- Styles ---

  private _renderStyles() {
    return html`<style>
      fd-message {
        display: block;
        font-family: var(--fdic-font-family-sans-serif, "Source Sans 3", sans-serif);
        font-size: var(--fdic-font-size-body-small, 1rem);
        line-height: 1.375;
        color: var(--fdic-color-text-secondary, #595961);
      }

      fd-message[hidden] {
        display: none;
      }

      fd-message [part="message"] {
        display: inline-flex;
        align-items: flex-start;
        gap: var(--fdic-spacing-2xs, 0.25rem);
        margin-top: 6px;
      }

      fd-message .fd-message__icon {
        display: block;
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        /* Align with first line of text */
        margin-top: 1px;
      }

      /* --- State colors --- */

      fd-message[state="error"] [part="message"] {
        color: var(--fdic-color-semantic-fg-error, #d80e3a);
      }

      fd-message[state="warning"] [part="message"] {
        color: var(--fdic-color-semantic-fg-warning, #8a6100);
      }

      fd-message[state="success"] [part="message"] {
        color: var(--fdic-color-semantic-fg-success, #1e8232);
      }

      /* --- Forced colors --- */
      @media (forced-colors: active) {
        fd-message[state="error"] [part="message"],
        fd-message[state="warning"] [part="message"],
        fd-message[state="success"] [part="message"] {
          forced-color-adjust: none;
        }

        fd-message[state="error"] [part="message"] {
          color: LinkText;
        }

        fd-message[state="warning"] [part="message"],
        fd-message[state="success"] [part="message"] {
          color: ButtonText;
        }
      }

      /* --- Print --- */
      @media print {
        fd-message .fd-message__icon {
          display: none;
        }
      }
    </style>`;
  }

  render() {
    if (!this._hasMessage) return nothing;

    const isError = this.state === "error";

    // Determine role and aria-live based on `live` override or internal defaults.
    // Default: error → role="alert" (assertive), others → aria-live="polite".
    // live="polite": always polite, even for errors (suppresses role="alert").
    // live="off": no live region behavior at all.
    let role: string | typeof nothing = nothing;
    let ariaLive: string | typeof nothing = nothing;

    if (this.live === "off") {
      // No announcements
    } else if (this.live === "polite") {
      ariaLive = "polite";
    } else {
      // Default internal behavior
      if (isError) {
        role = "alert";
      } else {
        ariaLive = "polite";
      }
    }

    return html`
      ${this._renderStyles()}
      <span
        part="message"
        id=${this.messageId}
        role=${role}
        aria-live=${ariaLive}
      >
        ${this._renderIcon()}
        <span part="message-text">${this.message}</span>
      </span>
    `;
  }
}
