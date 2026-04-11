import { LitElement, css, html, nothing } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";

export const VISUAL_TYPES = ["neutral", "cool", "warm", "avatar"] as const;
export type VisualType = (typeof VISUAL_TYPES)[number];

export const VISUAL_SIZES = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;
export type VisualSize = (typeof VISUAL_SIZES)[number];

const VISUAL_TYPE_SET = new Set<string>(VISUAL_TYPES);
const VISUAL_SIZE_SET = new Set<string>(VISUAL_SIZES);

const ARCHIVE_GLYPH_SVG = `
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect
      x="4"
      y="6.25"
      width="16"
      height="11.5"
      rx="1.75"
      stroke="currentColor"
      stroke-width="1.75"
    />
    <path
      d="M8.25 11.5H15.75"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
    />
    <path
      d="M7.25 6.25V4.75C7.25 4.05964 7.80964 3.5 8.5 3.5H15.5C16.1904 3.5 16.75 4.05964 16.75 4.75V6.25"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
    />
  </svg>
`;

const AVATAR_PLACEHOLDER_SVG = `
  <svg viewBox="0 0 72 72" fill="none" aria-hidden="true">
    <circle cx="36" cy="23" r="14" fill="currentColor" />
    <path
      d="M13 68C13 52.535 23.0736 42 36 42C48.9264 42 59 52.535 59 68"
      fill="currentColor"
    />
  </svg>
`;

function normalizeVisualType(value: string | undefined): VisualType {
  return value && VISUAL_TYPE_SET.has(value) ? (value as VisualType) : "neutral";
}

function normalizeVisualSize(value: string | undefined): VisualSize {
  return value && VISUAL_SIZE_SET.has(value) ? (value as VisualSize) : "md";
}

/**
 * `fd-visual` — Static circular visual for decorative icon or avatar cues.
 */
export class FdVisual extends LitElement {
  static properties = {
    type: { reflect: true },
    size: { reflect: true },
    _hasAssignedContent: { state: true },
  };

  static styles = css`
    :host {
      display: inline-flex;
      vertical-align: middle;
      line-height: 0;
    }

    .surface {
      --_fd-visual-size: 40px;
      --_fd-visual-padding: var(--ds-spacing-xs, 8px);
      --_fd-visual-content-size: 18px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: var(--fd-visual-size, var(--_fd-visual-size));
      block-size: var(--fd-visual-size, var(--_fd-visual-size));
      box-sizing: border-box;
      overflow: hidden;
      position: relative;
      border-radius: var(--fd-visual-radius, var(--ds-corner-radius-full, 9999px));
      background: var(
        --fd-visual-bg-neutral,
        var(--ds-color-bg-interactive)
      );
      color: var(
        --fd-visual-fg-neutral,
        var(--ds-color-text-primary)
      );
    }

    .icon-surface {
      padding: var(--fd-visual-padding, var(--_fd-visual-padding));
    }

    .avatar-surface {
      padding: 0;
      background: var(--fd-visual-bg-avatar, transparent);
      color: var(--fd-visual-avatar-placeholder-color, var(--ds-color-icon-disabled));
    }

    .type-cool {
      background: var(--fd-visual-bg-cool, var(--ds-color-info-100));
      color: var(
        --fd-visual-fg-cool,
        var(--ds-color-text-inverted)
      );
    }

    .type-warm {
      background: var(
        --fd-visual-bg-warm,
        var(--ds-color-secondary-200)
      );
      color: var(
        --fd-visual-fg-warm,
        var(--ds-color-text-primary)
      );
    }

    .size-xs {
      --_fd-visual-size: 24px;
      --_fd-visual-padding: var(--ds-spacing-2xs, 4px);
      --_fd-visual-content-size: 13px;
    }

    .size-sm {
      --_fd-visual-size: 32px;
      --_fd-visual-padding: 7px;
      --_fd-visual-content-size: 16px;
    }

    .size-md {
      --_fd-visual-size: 40px;
      --_fd-visual-padding: var(--ds-spacing-xs, 8px);
      --_fd-visual-content-size: 18px;
    }

    .size-lg {
      --_fd-visual-size: 48px;
      --_fd-visual-padding: var(--ds-spacing-xs, 8px);
      --_fd-visual-content-size: 22px;
    }

    .size-xl {
      --_fd-visual-size: 60px;
      --_fd-visual-padding: 10px;
      --_fd-visual-content-size: 28px;
    }

    .size-2xl {
      --_fd-visual-size: 72px;
      --_fd-visual-padding: var(--ds-spacing-sm, 12px);
      --_fd-visual-content-size: 36px;
    }

    .content {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-inline-size: 0;
      min-block-size: 0;
      position: relative;
      line-height: 0;
      pointer-events: none;
    }

    .content-icon {
      inline-size: var(
        --fd-visual-content-size,
        var(--_fd-visual-content-size)
      );
      block-size: var(
        --fd-visual-content-size,
        var(--_fd-visual-content-size)
      );
    }

    .content-avatar {
      inline-size: 100%;
      block-size: 100%;
      border-radius: inherit;
      overflow: hidden;
    }

    slot {
      display: contents;
    }

    .fallback {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 100%;
      block-size: 100%;
      color: inherit;
    }

    .fallback svg {
      inline-size: 100%;
      block-size: 100%;
    }

    ::slotted(*) {
      box-sizing: border-box;
      max-inline-size: 100%;
      max-block-size: 100%;
      pointer-events: none;
    }

    ::slotted(fd-icon),
    ::slotted(svg),
    ::slotted(img),
    ::slotted(video),
    ::slotted(canvas) {
      inline-size: 100%;
      block-size: 100%;
    }

    ::slotted(fd-icon) {
      --fd-icon-size: 100%;
      color: inherit;
    }

    ::slotted(img),
    ::slotted(video) {
      object-fit: cover;
    }

    @media (forced-colors: active) {
      .surface {
        background: Canvas;
        color: ButtonText;
        border: 1px solid ButtonText;
        forced-color-adjust: none;
      }
    }
  `;

  declare type: string;
  declare size: string;
  declare _hasAssignedContent: boolean;

  constructor() {
    super();
    this.type = "neutral";
    this.size = "md";
    this._hasAssignedContent = false;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.setAttribute("aria-hidden", "true");
  }

  override firstUpdated() {
    this._syncAssignedContent();
  }

  private _syncAssignedContent() {
    const slot = this.shadowRoot?.querySelector("slot") ?? null;
    this._hasAssignedContent = this._hasRenderableSlotContent(slot);
  }

  private _hasRenderableSlotContent(slot: HTMLSlotElement | null) {
    if (!slot) {
      return false;
    }

    return slot.assignedNodes({ flatten: true }).some((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return true;
      }

      return node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim());
    });
  }

  private _onSlotChange = (event: Event) => {
    this._hasAssignedContent = this._hasRenderableSlotContent(
      event.currentTarget as HTMLSlotElement,
    );
  };

  private _renderFallback(type: VisualType) {
    const svg = type === "avatar" ? AVATAR_PLACEHOLDER_SVG : ARCHIVE_GLYPH_SVG;

    return html`<span part="fallback" class="fallback" aria-hidden="true">
      ${unsafeSVG(svg)}
    </span>`;
  }

  render() {
    const type = normalizeVisualType(this.type);
    const size = normalizeVisualSize(this.size);
    const isAvatar = type === "avatar";

    return html`
      <span part="surface" class=${`surface type-${type} size-${size} ${isAvatar ? "avatar-surface" : "icon-surface"}`}>
        <span
          part="content"
          class=${`content ${isAvatar ? "content-avatar" : "content-icon"}`}
        >
          <slot @slotchange=${this._onSlotChange}></slot>
          ${this._hasAssignedContent ? nothing : this._renderFallback(type)}
        </span>
      </span>
    `;
  }
}
