const REQUIRED_RUNTIME_TOKENS = [
  "--fdic-color-text-primary",
  "--fdic-spacing-md",
  "--fdic-font-size-body",
];

const RUNTIME_WARNING = [
  "FDIC Design System components require the token runtime stylesheet.",
  'Import "@jflamb/fdic-ds-components/styles.css" or "@jflamb/fdic-ds-tokens/styles.css" before registering components.',
].join(" ");

let hasWarnedAboutMissingRuntime = false;

export function warnIfDesignSystemRuntimeMissing(): void {
  if (hasWarnedAboutMissingRuntime || typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const computedStyle = window.getComputedStyle(document.documentElement);
  const runtimeMissing = REQUIRED_RUNTIME_TOKENS.some((tokenName) => computedStyle.getPropertyValue(tokenName).trim().length === 0);

  if (!runtimeMissing) {
    return;
  }

  hasWarnedAboutMissingRuntime = true;
  console.warn(RUNTIME_WARNING);
}

export function resetDesignSystemRuntimeWarningForTests(): void {
  hasWarnedAboutMissingRuntime = false;
}
