import { LitElement, html, nothing } from "lit";

export type MessageState = "default" | "error" | "warning" | "success";
export type LiveMode = "polite" | "off";

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

  // --- Icon SVGs (Phosphor Regular) ---

  private _renderIcon() {
    if (this.state === "default" || !this._hasMessage) return nothing;

    const icons: Record<string, string> = {
      error:
        'M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z',
      warning:
        'M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z',
      success:
        'M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm45.66-109.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,145.37l50.34-50.35a8,8,0,0,1,11.32,11.32Z',
    };

    const path = icons[this.state];
    if (!path) return nothing;

    return html`<svg
      class="fd-message__icon"
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d=${path} />
    </svg>`;
  }

  // --- Styles ---

  private _renderStyles() {
    return html`<style>
      fd-message {
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
        font-size: var(--fdic-font-size-body-small, 1rem);
        line-height: 1.375;
        color: var(--fdic-text-secondary, #595961);
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
        color: var(--fdic-status-error, #d80e3a);
      }

      fd-message[state="warning"] [part="message"] {
        color: var(--fdic-status-warning, #8a6100);
      }

      fd-message[state="success"] [part="message"] {
        color: var(--fdic-status-success, #1e8232);
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
