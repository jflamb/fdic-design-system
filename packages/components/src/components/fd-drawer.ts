import { LitElement, css, html, nothing } from "lit";
import { reducedMotion } from "./reduced-motion.js";

export const DRAWER_PLACEMENTS = ["top", "right", "bottom", "left"] as const;
export type FdDrawerPlacement = (typeof DRAWER_PLACEMENTS)[number];

const DRAWER_PLACEMENT_SET = new Set<string>(DRAWER_PLACEMENTS);

function normalizeDrawerPlacement(value: string | undefined): FdDrawerPlacement {
  return value && DRAWER_PLACEMENT_SET.has(value) ? (value as FdDrawerPlacement) : "top";
}

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
      max-height: none;
      max-inline-size: none;
      max-block-size: none;
      width: 100%;
    }

    dialog.base {
      position: fixed;
      inset: 0;
      z-index: 0;
      inline-size: 100%;
      block-size: 100%;
      opacity: 0;
      overflow: visible;
      transition:
        opacity var(--fdic-motion-duration-slow, 240ms) var(--fdic-motion-easing-default, ease),
        overlay var(--fdic-motion-duration-slow, 240ms) allow-discrete,
        display var(--fdic-motion-duration-slow, 240ms) allow-discrete;
      transition-behavior: allow-discrete;
    }

    dialog.base[open] {
      opacity: 1;
    }

    dialog.base::backdrop {
      background: var(
        --fd-drawer-backdrop,
        var(--fdic-color-overlay-scrim)
      );
      opacity: 0;
      transition:
        opacity var(--fdic-motion-duration-slow, 240ms) var(--fdic-motion-easing-default, ease),
        overlay var(--fdic-motion-duration-slow, 240ms) allow-discrete,
        display var(--fdic-motion-duration-slow, 240ms) allow-discrete;
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
      background: var(--fd-drawer-surface, var(--fdic-color-bg-surface));
      color: var(--fd-drawer-color, inherit);
      box-shadow: var(--fd-drawer-shadow, var(--fdic-shadow-panel));
      opacity: 0;
      transition:
        transform var(--fdic-motion-duration-slow, 240ms) cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity var(--fdic-motion-duration-slow, 240ms) var(--fdic-motion-easing-default, ease);
      will-change: transform, opacity;
    }

    dialog.base .surface {
      position: absolute;
      max-inline-size: 100%;
      max-block-size: 100%;
      overflow: auto;
    }

    .surface[data-placement="top"] {
      transform-origin: top center;
      border-block-end: 1px solid
        var(
          --fd-drawer-border-color,
          var(--fdic-color-border-divider)
        );
      transform: translateY(-1.25rem);
    }

    dialog.base .surface[data-placement="top"] {
      inset-block-start: 0;
      inset-inline: 0;
      inline-size: 100%;
    }

    .surface[data-placement="bottom"] {
      transform-origin: bottom center;
      border-block-start: 1px solid
        var(
          --fd-drawer-border-color,
          var(--fdic-color-border-divider)
        );
      transform: translateY(1.25rem);
    }

    dialog.base .surface[data-placement="bottom"] {
      inset-block-end: 0;
      inset-inline: 0;
      inline-size: 100%;
    }

    .surface[data-placement="left"] {
      transform-origin: center left;
      border-inline-end: 1px solid
        var(
          --fd-drawer-border-color,
          var(--fdic-color-border-divider)
        );
      transform: translateX(-1.25rem);
    }

    dialog.base .surface[data-placement="left"] {
      inset-block: 0;
      inset-inline-start: 0;
      inline-size: min(var(--fd-drawer-inline-size, 22rem), 100vw);
      block-size: 100%;
    }

    .base--inline .surface[data-placement="left"] {
      inline-size: min(var(--fd-drawer-inline-size, 22rem), 100%);
    }

    .surface[data-placement="right"] {
      transform-origin: center right;
      border-inline-start: 1px solid
        var(
          --fd-drawer-border-color,
          var(--fdic-color-border-divider)
        );
      transform: translateX(1.25rem);
    }

    dialog.base .surface[data-placement="right"] {
      inset-block: 0;
      inset-inline-end: 0;
      inline-size: min(var(--fd-drawer-inline-size, 22rem), 100vw);
      block-size: 100%;
    }

    .base--inline .surface[data-placement="right"] {
      inline-size: min(var(--fd-drawer-inline-size, 22rem), 100%);
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

      dialog.base[open] .surface[data-placement="bottom"] {
        transform: translateY(1.25rem);
      }

      dialog.base[open] .surface[data-placement="left"] {
        transform: translateX(-1.25rem);
      }

      dialog.base[open] .surface[data-placement="right"] {
        transform: translateX(1.25rem);
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

    ${reducedMotion`
      dialog.base,
      dialog.base::backdrop,
      .surface {
        transition: none;
      }
    `}

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
    const placement = normalizeDrawerPlacement(this.placement);
    const regionRole = !this.modal && this.open ? "region" : nothing;
    const content = html`
      <div
        class="surface"
        part="surface"
        data-placement=${placement}
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
