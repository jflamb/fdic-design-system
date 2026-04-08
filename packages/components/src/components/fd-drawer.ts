import { LitElement, css, html, nothing } from "lit";

export type FdDrawerPlacement = "top";

export interface FdDrawerCloseRequestDetail {
  source: "backdrop" | "escape";
}

export class FdDrawer extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    label: { reflect: true },
    modal: { type: Boolean, reflect: true },
    placement: { reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
      z-index: 0;
    }

    :host([hidden]) {
      display: none;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .base {
      margin: 0;
      padding: 0;
      border: none;
      background: transparent;
      max-width: none;
      width: 100%;
    }

    dialog.base {
      position: fixed;
      inset: 0;
      z-index: 0;
      opacity: 0;
      overflow: visible;
      transition:
        opacity 240ms ease,
        overlay 240ms allow-discrete,
        display 240ms allow-discrete;
      transition-behavior: allow-discrete;
    }

    dialog.base[open] {
      opacity: 1;
    }

    dialog.base::backdrop {
      background: var(
        --fd-drawer-backdrop,
        var(
          --ds-color-overlay-scrim,
          light-dark(rgba(0, 18, 32, 0.34), rgba(0, 0, 0, 0.64))
        )
      );
      opacity: 0;
      transition:
        opacity 240ms ease,
        overlay 240ms allow-discrete,
        display 240ms allow-discrete;
      transition-behavior: allow-discrete;
    }

    dialog.base[open]::backdrop {
      opacity: 1;
    }

    .surface {
      position: relative;
      z-index: 1;
      display: grid;
      gap: 0.875rem;
      width: 100%;
      background: var(--fd-drawer-surface, var(--ds-color-bg-surface, light-dark(#ffffff, #212123)));
      color: var(--fd-drawer-color, inherit);
      border-block-end: 1px solid
        var(
          --fd-drawer-border-color,
          var(
            --ds-color-border-divider,
            light-dark(rgba(9, 53, 84, 0.14), rgba(255, 255, 255, 0.16))
          )
        );
      box-shadow: var(
        --fd-drawer-shadow,
        0 18px 48px
          light-dark(rgba(0, 18, 32, 0.22), rgba(0, 0, 0, 0.48))
      );
      transform: translateY(-1.25rem);
      opacity: 0;
      transition:
        transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 240ms ease;
      will-change: transform, opacity;
    }

    .surface[data-placement="top"] {
      transform-origin: top center;
    }

    dialog.base[open] .surface,
    .base--inline .surface {
      transform: translateY(0);
      opacity: 1;
    }

    @starting-style {
      dialog.base[open] {
        opacity: 0;
      }

      dialog.base[open]::backdrop {
        opacity: 0;
      }

      dialog.base[open] .surface {
        transform: translateY(-1.25rem);
        opacity: 0;
      }
    }

    .header {
      display: block;
    }

    .header[hidden] {
      display: none;
    }

    .body {
      display: block;
      min-width: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      dialog.base,
      dialog.base::backdrop,
      .surface {
        transition: none;
      }
    }

    @media (forced-colors: active) {
      .surface {
        border-color: CanvasText;
        box-shadow: none;
      }

      dialog.base::backdrop {
        background: Canvas;
        opacity: 0.65;
      }
    }

    @media print {
      dialog.base,
      dialog.base::backdrop {
        display: none;
      }

      .base--inline .surface {
        box-shadow: none;
        border: 1px solid #000;
        transform: none;
        opacity: 1;
      }
    }
  `;

  declare open: boolean;
  declare label: string;
  declare modal: boolean;
  declare placement: FdDrawerPlacement;

  private _previouslyFocused: Element | null = null;

  constructor() {
    super();
    this.open = false;
    this.label = "";
    this.modal = false;
    this.placement = "top";
  }

  override updated(changed: Map<PropertyKey, unknown>) {
    if ((changed.has("open") || changed.has("modal")) && this.modal) {
      this._syncDialog();
    }
  }

  override focus(options?: FocusOptions) {
    const target = this.modal
      ? this._getDialog()
      : (this.shadowRoot?.querySelector<HTMLElement>(".surface") ?? null);

    if (target) {
      target.focus(options);
      return;
    }

    super.focus(options);
  }

  private _getDialog() {
    return this.shadowRoot?.querySelector<HTMLDialogElement>("dialog.base") ?? null;
  }

  private _syncDialog() {
    const dialog = this._getDialog();
    if (!dialog) {
      return;
    }

    if (this.open) {
      if (!dialog.hasAttribute("open")) {
        this._previouslyFocused = document.activeElement;
        dialog.showModal();
      }
      return;
    }

    if (dialog.hasAttribute("open")) {
      dialog.close();
      if (this._previouslyFocused instanceof HTMLElement) {
        this._previouslyFocused.focus();
      }
      this._previouslyFocused = null;
    }
  }

  private _onDialogClick(event: MouseEvent) {
    const dialog = this._getDialog();
    if (!dialog || event.target !== dialog) {
      return;
    }

    this._requestClose("backdrop");
  }

  private _onDialogCancel(event: Event) {
    event.preventDefault();
    this._requestClose("escape");
  }

  private _requestClose(source: FdDrawerCloseRequestDetail["source"]) {
    const closeRequest = new CustomEvent<FdDrawerCloseRequestDetail>("fd-drawer-close-request", {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: { source },
    });

    this.dispatchEvent(closeRequest);
  }

  override render() {
    const hasHeaderSlot = this.querySelector("[slot='header']");
    const regionRole = !this.modal && this.open ? "region" : nothing;
    const content = html`
      <div
        class="surface"
        part="surface"
        data-placement=${this.placement}
        role=${regionRole}
        aria-label=${!this.modal && this.label ? this.label : nothing}
        tabindex="-1"
      >
        <div
          class="header"
          part="header"
          ?hidden=${!hasHeaderSlot}
        >
          <slot name="header"></slot>
        </div>
        <div class="body" part="body">
          <slot></slot>
        </div>
      </div>
    `;

    if (!this.modal) {
      return this.open
        ? html`
            <div class="base base--inline" part="base">
              ${content}
            </div>
          `
        : nothing;
    }

    return html`
      <dialog
        class="base"
        part="base"
        aria-label=${this.label || nothing}
        @cancel=${this._onDialogCancel}
        @click=${this._onDialogClick}
      >
        ${content}
      </dialog>
    `;
  }
}
