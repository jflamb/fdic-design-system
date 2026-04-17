export const tokenSource = {
  metadata: {
    schema: "https://www.designtokens.org/schemas/2025.10/format.json",
    description:
      "FDIC Design System tokens in DTCG format. This file is generated from the repository token sources.",
  },
  propertyRegistrations: [
    { name: "--fdic-color-bg-hovered", syntax: "<color>", inherits: true, initialValue: "oklch(0 0 0 / 0.04)" },
    { name: "--fdic-color-bg-pressed", syntax: "<color>", inherits: true, initialValue: "oklch(0 0 0 / 0.08)" },
    { name: "--fdic-color-overlay-hover", syntax: "<color>", inherits: true, initialValue: "oklch(0 0 0 / 0.04)" },
    { name: "--fdic-color-overlay-pressed", syntax: "<color>", inherits: true, initialValue: "oklch(0 0 0 / 0.08)" },
  ],
  runtime: {
    root: {
      colorScheme: "light",
      accentColor: "{core.color.primary.primary-500}",
    },
  },
  coreColors: {
    neutral: {
      "neutral-000": "oklch(1 0 0)",
      "neutral-050": "oklch(0.9857 0.0026 286.35)",
      "neutral-100": "oklch(0.9707 0.0027 286.35)",
      "neutral-150": "oklch(0.9324 0.0067 286.27)",
      "neutral-200": "oklch(0.9073 0.0027 286.35)",
      "neutral-300": "oklch(0.8767 0.0027 286.34)",
      "neutral-400": "oklch(0.799 0.0028 286.34)",
      "neutral-500": "oklch(0.6999 0.0029 286.33)",
      "neutral-700": "oklch(0.4668 0.0128 285.89)",
      "neutral-800": "oklch(0.3798 0.0034 286.24)",
      "neutral-850": "oklch(0.3218 0.0035 286.2)",
      "neutral-900": "oklch(0.2486 0.0037 286.12)",
      "neutral-1000": "oklch(0 0 0)",
    },
    primary: {
      "primary-050": "oklch(0.9585 0.0169 225.19)",
      "primary-100": "oklch(0.9193 0.0412 223.97)",
      "primary-200": "oklch(0.8495 0.0978 226.58)",
      "primary-400": "oklch(0.741 0.1499 239.59)",
      "primary-500": "oklch(0.4716 0.1061 241.57)",
      "primary-700": "oklch(0.3874 0.0849 240.69)",
      "primary-800": "oklch(0.3408 0.0748 241.24)",
      "primary-900": "oklch(0.3084 0.0809 246.91)",
    },
    secondary: {
      "secondary-050": "oklch(0.9536 0.0293 87.55)",
      "secondary-300": "oklch(0.8756 0.0778 88.57)",
      "secondary-400": "oklch(0.8212 0.1089 88.87)",
      "secondary-500": "oklch(0.7727 0.1309 86.96)",
      "secondary-600": "oklch(0.538 0.099 85.44)",
      "secondary-800": "oklch(0.538 0.099 85.44)",
      "secondary-900": "oklch(0.4387 0.0744 93.45)",
    },
    success: {
      "success-050": "oklch(0.9571 0.021 147.64)",
      "success-200": "oklch(0.8292 0.0827 145.82)",
      "success-300": "oklch(0.7852 0.1737 146.79)",
      "success-500": "oklch(0.5234 0.1347 144.17)",
      "success-600": "oklch(0.4254 0.1159 144.31)",
      "success-800": "oklch(0.3524 0.0751 143.78)",
      "success-900": "oklch(0.3154 0.0651 143.84)",
    },
    warning: {
      "warning-050": "oklch(0.9775 0.013 82.4)",
      "warning-200": "oklch(0.8741 0.1102 76.47)",
      "warning-300": "oklch(0.843 0.15 79.47)",
      "warning-500": "oklch(0.5172 0.1085 76.33)",
      "warning-600": "oklch(0.4369 0.0912 77.67)",
      "warning-800": "oklch(0.4 0.0877 68.06)",
      "warning-900": "oklch(0.3319 0.072 69.83)",
    },
    error: {
      "error-050": "oklch(0.9579 0.0179 30.27)",
      "error-150": "oklch(0.8897 0.058 18.3)",
      "error-200": "oklch(0.7959 0.0978 19.46)",
      "error-300": "oklch(0.711 0.1668 9.43)",
      "error-500": "oklch(0.4844 0.1897 20.37)",
      "error-600": "oklch(0.5616 0.2207 19.98)",
      "error-800": "oklch(0.2959 0.0538 20.82)",
      "error-900": "oklch(0.2499 0.0417 20.45)",
    },
    info: {
      "info-050": "oklch(0.9756 0.011 243.65)",
      "info-200": "oklch(0.8163 0.0896 243.62)",
      "info-300": "oklch(0.7282 0.1409 244.66)",
      "info-500": "oklch(0.4167 0.1054 247.79)",
      "info-600": "oklch(0.4016 0.0987 247.42)",
      "info-800": "oklch(0.3462 0.0736 256.04)",
      "info-900": "oklch(0.2943 0.0607 255.12)",
    },
    link: {
      default: "oklch(0.4716 0.1061 241.57)",
      visited: "oklch(0.5447 0.1216 309.32)",
      "300": "oklch(0.8562 0.0489 219.65)",
      "visited-300": "oklch(0.7329 0.0895 299.99)",
    },
  },
  semanticColors: {
    background: {
      none: { light: { from: "{core.color.neutral.neutral-000}", alpha: 0.2 }, dark: { from: "{core.color.neutral.neutral-1000}", alpha: 0.2 } },
      base: { light: "{core.color.neutral.neutral-000}", dark: "{core.color.neutral.neutral-1000}" },
      surface: { light: "{core.color.neutral.neutral-000}", dark: "{core.color.neutral.neutral-900}" },
      container: { light: "{core.color.neutral.neutral-100}", dark: "{core.color.neutral.neutral-900}" },
      overlay: { light: "{core.color.neutral.neutral-000}", dark: "{core.color.neutral.neutral-900}" },
      modal: { light: "{core.color.neutral.neutral-100}", dark: "{core.color.neutral.neutral-800}" },
      input: { light: "{core.color.neutral.neutral-000}", dark: "{core.color.neutral.neutral-900}" },
      interactive: { light: "{core.color.neutral.neutral-100}", dark: "{core.color.neutral.neutral-900}" },
      inverted: { light: "{core.color.neutral.neutral-900}", dark: "{core.color.neutral.neutral-100}" },
      brand: { light: "{core.color.primary.primary-900}", dark: "{core.color.primary.primary-050}" },
      highlight: "{core.color.primary.primary-400}",
      selected: { light: "{core.color.primary.primary-100}", dark: "{core.color.primary.primary-900}" },
      active: { light: "{core.color.primary.primary-500}", dark: "{core.color.primary.primary-200}" },
      hovered: { light: { from: "{core.color.neutral.neutral-1000}", alpha: 0.04 }, dark: { from: "{core.color.neutral.neutral-000}", alpha: 0.08 } },
      pressed: { light: { from: "{core.color.neutral.neutral-1000}", alpha: 0.08 }, dark: { from: "{core.color.neutral.neutral-000}", alpha: 0.14 } },
      destructive: { light: "{core.color.error.error-600}", dark: "{core.color.error.error-800}" },
      readonly: { light: "{core.color.neutral.neutral-100}", dark: "{core.color.neutral.neutral-800}" },
    },
    text: {
      primary: { light: "{core.color.neutral.neutral-900}", dark: "{core.color.neutral.neutral-000}" },
      secondary: { light: "{core.color.neutral.neutral-700}", dark: "{core.color.neutral.neutral-200}" },
      placeholder: "{core.color.neutral.neutral-500}",
      disabled: { light: "{core.color.neutral.neutral-500}", dark: "{core.color.neutral.neutral-400}" },
      inverted: { light: "{core.color.neutral.neutral-000}", dark: "{core.color.neutral.neutral-1000}" },
      brand: { light: "{core.color.primary.primary-500}", dark: "{core.color.primary.primary-200}" },
      warm: { light: "{core.color.secondary.secondary-900}", dark: "{core.color.secondary.secondary-050}" },
      link: { light: "{core.color.link.default}", dark: "{core.color.link.300}" },
      "link-visited": { light: "{core.color.link.visited}", dark: "{core.color.link.visited-300}" },
      error: { light: "{core.color.error.error-600}", dark: "{core.color.error.error-150}" },
      wordmark: { light: "{core.color.primary.primary-900}", dark: "{core.color.neutral.neutral-000}" },
    },
    icon: {
      primary: { light: "{core.color.neutral.neutral-900}", dark: "{core.color.neutral.neutral-200}" },
      secondary: { light: "{core.color.neutral.neutral-700}", dark: "{core.color.neutral.neutral-400}" },
      placeholder: { light: "{core.color.neutral.neutral-700}", dark: "{core.color.neutral.neutral-500}" },
      disabled: { light: "{core.color.neutral.neutral-400}", dark: "{core.color.neutral.neutral-700}" },
      inverted: { light: "{core.color.neutral.neutral-000}", dark: "{core.color.neutral.neutral-1000}" },
      warm: { light: "{core.color.secondary.secondary-900}", dark: "{core.color.secondary.secondary-050}" },
      active: { light: "{core.color.link.default}", dark: "{core.color.link.300}" },
      link: { light: "{core.color.link.default}", dark: "{core.color.link.300}" },
    },
    border: {
      divider: { light: "{core.color.neutral.neutral-400}", dark: "{core.color.neutral.neutral-700}" },
      subtle: { light: "{core.color.neutral.neutral-200}", dark: "{core.color.neutral.neutral-700}" },
      image: "{core.color.neutral.neutral-000}",
      input: { light: "{core.color.neutral.neutral-400}", dark: "{core.color.neutral.neutral-700}" },
      "input-hover": "{core.color.neutral.neutral-500}",
      "input-focus": { light: "{core.color.primary.primary-400}", dark: "{core.color.primary.primary-500}" },
      "input-active": { light: "{core.color.neutral.neutral-800}", dark: "{core.color.neutral.neutral-200}" },
      "input-readonly": { light: "{core.color.neutral.neutral-200}", dark: "{core.color.neutral.neutral-400}" },
      "input-interactive": { light: "{core.color.neutral.neutral-150}", dark: "{core.color.neutral.neutral-850}" },
      "input-disabled": { light: "{core.color.neutral.neutral-300}", dark: "{core.color.neutral.neutral-500}" },
      glass: { light: { from: "{core.color.neutral.neutral-000}", alpha: 0.55 }, dark: { from: "{core.color.neutral.neutral-000}", alpha: 0.2 } },
      "glass-soft": { light: { from: "{core.color.primary.primary-900}", alpha: 0.14 }, dark: { from: "{core.color.neutral.neutral-000}", alpha: 0.14 } },
      "focus-inner": { light: { from: "{core.color.primary.primary-500}", alpha: 0.35 }, dark: { from: "{core.color.primary.primary-200}", alpha: 0.35 } },
    },
    semantic: {
      "bg-success": { light: "{core.color.success.success-050}", dark: "{core.color.success.success-800}" },
      "bg-warning": { light: "oklch(0.9717 0.0231 75.86)", dark: "{core.color.warning.warning-800}" },
      "bg-error": { light: "{core.color.error.error-050}", dark: "{core.color.error.error-800}" },
      "bg-info": { light: "oklch(0.9532 0.0218 239.43)", dark: "{core.color.info.info-800}" },
      "bg-warm": { light: "{core.color.secondary.secondary-050}", dark: "{core.color.secondary.secondary-900}" },
      "fg-success": { light: "{core.color.success.success-500}", dark: "{core.color.success.success-300}" },
      "fg-warning": { light: "{core.color.warning.warning-500}", dark: "{core.color.warning.warning-300}" },
      "fg-error": { light: "{core.color.error.error-500}", dark: "{core.color.error.error-300}" },
      "fg-info": { light: "{core.color.info.info-500}", dark: "{core.color.info.info-300}" },
      "border-success": { light: "{core.color.success.success-500}", dark: "{core.color.success.success-300}" },
      "border-warning": { light: "{core.color.warning.warning-500}", dark: "{core.color.warning.warning-300}" },
      "border-error": { light: "{core.color.error.error-500}", dark: "{core.color.error.error-300}" },
      "border-info": { light: "{core.color.info.info-500}", dark: "{core.color.info.info-300}" },
    },
    overlay: {
      hover: { light: { from: "{core.color.neutral.neutral-1000}", alpha: 0.04 }, dark: { from: "{core.color.neutral.neutral-000}", alpha: 0.08 } },
      pressed: { light: { from: "{core.color.neutral.neutral-1000}", alpha: 0.08 }, dark: { from: "{core.color.neutral.neutral-000}", alpha: 0.14 } },
      scrim: { light: { from: "{core.color.neutral.neutral-1000}", alpha: 0.48 }, dark: { from: "{core.color.neutral.neutral-1000}", alpha: 0.72 } },
      "brand-hover": { light: { from: "{core.color.primary.primary-500}", alpha: 0.08 }, dark: { from: "{core.color.primary.primary-200}", alpha: 0.14 } },
      "brand-selected": { light: { from: "{core.color.primary.primary-500}", alpha: 0.14 }, dark: { from: "{core.color.primary.primary-200}", alpha: 0.18 } },
      "brand-pressed": { light: { from: "{core.color.primary.primary-500}", alpha: 0.16 }, dark: { from: "{core.color.primary.primary-200}", alpha: 0.22 } },
      "scrim-soft": { light: { from: "{core.color.neutral.neutral-1000}", alpha: 0.08 }, dark: { from: "{core.color.neutral.neutral-1000}", alpha: 0.24 } },
      "scrim-strong": { light: { from: "{core.color.neutral.neutral-1000}", alpha: 0.45 }, dark: { from: "{core.color.neutral.neutral-1000}", alpha: 0.64 } },
    },
    effect: {
      shadow: { light: { from: "{core.color.neutral.neutral-1000}", alpha: 0.08 }, dark: { from: "{core.color.neutral.neutral-1000}", alpha: 0.36 } },
      "shadow-panel": { light: { from: "{core.color.neutral.neutral-1000}", alpha: 0.22 }, dark: { from: "{core.color.neutral.neutral-1000}", alpha: 0.48 } },
    },
    surface: {
      "glass-1": { from: "{core.color.neutral.neutral-000}", alpha: 0.84 },
      "glass-2": { from: "{core.color.primary.primary-050}", alpha: 0.5 },
      "glass-2-muted": { from: "{core.color.primary.primary-050}", alpha: 0.4 },
      "glass-3": { from: "{core.color.primary.primary-050}", alpha: 0.24 },
      "glass-3-muted-1": { from: "{core.color.primary.primary-050}", alpha: 0.14 },
      "glass-3-muted-2": { from: "{core.color.primary.primary-050}", alpha: 0.16 },
    },
  },
  interaction: {
    focus: {
      color: {
        gap: "{semantic.color.background.input}",
        ring: "{semantic.color.border.input-focus}",
      },
      width: {
        gap: "2px",
        ring: "4px",
      },
    },
    motion: {
      duration: {
        fast: "120ms",
        normal: "150ms",
        slow: "240ms",
      },
      easing: {
        default: "ease",
      },
    },
  },
  typography: {
    fontFamily: {
      "sans-serif": '"Source Sans 3", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
    },
    fontSize: {
      h1: "2.53125rem",   // 40.5px
      h2: "1.6875rem",    // 27px
      h3: "1.40625rem",   // 22.5px
      h4: "1.125rem",     // 18px
      h5: "0.984375rem",  // 15.75px
      h6: "0.84375rem",   // 13.5px
      body: "1.125rem",   // 18px
      "body-big": "1.25rem",  // 20px
      "body-small": "1rem",   // 16px
      "body-smaller": "0.8125rem", // 13px
      lg: "1.375rem",     // 22px
    },
    fontWeight: {
      regular: "400",
      medium: "450",
      semibold: "600",
      bold: "700",
    },
    lineHeight: {
      h1: "1.15",
      h2: "1.2",
      h3: "1.25",
      h4: "1.25",
      h5: "1.25",
      h6: "1.25",
      body: "1.375",
      tight: "1.25",
    },
    letterSpacing: {
      h1: "-0.025em",
      h2: "-0.019em",
      h6: "0.148em",
      none: "0",
    },
    headingPadding: {
      "h1-top": "3.796875rem",
      "h1-bottom": "1.265625rem",
      "h2-top": "3rem",
      "h2-bottom": "1rem",
      "h3-top": "2.109375rem",
      "h3-bottom": "0.703125rem",
      "h4-top": "1.6875rem",
      "h4-bottom": "0.5625rem",
      "h5-top": "1.4765625rem",
      "h5-bottom": "0.4921875rem",
      "h6-top": "1.265625rem",
      "h6-bottom": "0.421875rem",
    },
  },
  spacing: {
    "3xs": "0.125rem",  // 2px
    "2xs": "0.25rem",   // 4px
    xs: "0.5rem",       // 8px
    sm: "0.75rem",      // 12px
    md: "1rem",         // 16px
    lg: "1.25rem",      // 20px
    xl: "1.5rem",       // 24px
    "2xl": "2rem",      // 32px
    "3xl": "3rem",      // 48px
    "5xl": "5rem",      // 80px
    none: "0",
  },
  cornerRadius: {
    sm: "3px",
    md: "5px",
    lg: "7px",
    xl: "9px",
    full: "9999px",
  },
  layout: {
    "max-width": "1440px",
    "shell-max-width": "1312px",
    gutter: "64px",
    "gutter-tablet": "32px",
    "gutter-mobile": "16px",
    "content-max-width": "calc(var(--fdic-layout-max-width) - 2 * var(--fdic-layout-gutter))",
    "paragraph-max-width": "720px",
    "section-block-padding": "3rem",
    "section-block-padding-compact": "1.5rem",
    "content-gap": "1.5rem",
    "split-gap": "2rem",
    "stack-gap": "1rem",
    "sidebar-width": "18rem",
    "col-2-min": "384px",
    "col-2-max": "688px",
    "col-2-gap": "48px",
    "col-3-min": "360px",
    "col-3-max": "440px",
    "col-3-gap": "48px",
    "col-4-min": "256px",
    "col-4-max": "320px",
    "col-4-gap": "48px",
    "col-2-min-narrow": "320px",
    "col-2-gap-narrow": "16px",
    "col-3-min-narrow": "200px",
    "col-3-gap-narrow": "16px",
    "col-4-min-narrow": "160px",
    "col-4-max-narrow": "180px",
    "col-4-gap-narrow": "16px",
  },
  cssEffects: {
    shadow: {
      raised: [
        "0 1px 1px var(--fdic-color-effect-shadow)",
        "0 2px 2px var(--fdic-color-effect-shadow)",
        "0 4px 4px var(--fdic-color-effect-shadow)",
        "0 6px 8px var(--fdic-color-effect-shadow)",
      ],
      "raised-hover": [
        "0 1px 1px var(--fdic-color-effect-shadow)",
        "0 2px 2px var(--fdic-color-effect-shadow)",
        "0 4px 4px var(--fdic-color-effect-shadow)",
        "0 8px 8px var(--fdic-color-effect-shadow)",
        "0 16px 16px var(--fdic-color-effect-shadow)",
      ],
      dropdown: [
        "0 1px 2px var(--fdic-color-effect-shadow)",
        "0 2px 12px var(--fdic-color-effect-shadow)",
      ],
      menu: "0 4px 12px var(--fdic-color-effect-shadow)",
      panel: "0 18px 48px var(--fdic-color-effect-shadow-panel)",
    },
    gradient: {
      "brand-core": {
        angle: "135deg in oklch",
        stops: ["var(--fdic-color-primary-500)", "var(--fdic-color-primary-400)"],
      },
      "hero-overlay-cool": {
        angle: "180deg in oklch",
        stops: [
          "oklch(from var(--fdic-color-primary-500) l c h / 0.1) 0%",
          "oklch(from var(--fdic-color-primary-800) l c h / 0.7) 100%",
        ],
      },
      "hero-overlay-warm": {
        angle: "180deg in oklch",
        stops: [
          "oklch(from var(--fdic-color-secondary-800) l c h / 0.1) 0%",
          "oklch(from var(--fdic-color-secondary-800) l c h / 0.7) 100%",
        ],
      },
      "hero-overlay-neutral": {
        angle: "180deg in oklch",
        stops: [
          "oklch(from var(--fdic-color-neutral-800) l c h / 0.1) 0%",
          "oklch(from var(--fdic-color-neutral-800) l c h / 0.7) 100%",
        ],
      },
      "glass-button": {
        angle: "180deg in oklch",
        stops: [
          "oklch(from var(--fdic-color-neutral-000) l c h / 0.12)",
          "oklch(from var(--fdic-color-neutral-000) l c h / 0.16)",
        ],
      },
      "glass-sheen": {
        angle: "180deg in oklch",
        stops: [
          "oklch(from var(--fdic-color-neutral-000) l c h / 0.24) 0%",
          "oklch(from var(--fdic-color-neutral-000) l c h / 0.08) 15%",
          "oklch(from var(--fdic-color-neutral-000) l c h / 0) 38%",
        ],
      },
    },
  },
};
