if (typeof globalThis !== "undefined") {
  globalThis.litIssuedWarnings ??= new Set();
  globalThis.litIssuedWarnings.add("dev-mode");
}
