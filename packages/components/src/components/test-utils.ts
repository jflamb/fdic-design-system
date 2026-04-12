export function clearTestDom() {
  document.body.innerHTML = "";
}

export async function waitForComponentUpdate(
  element: Element & { updateComplete?: Promise<unknown> },
) {
  if ("updateComplete" in element && element.updateComplete) {
    await element.updateComplete;
  }
}

export async function createTestElement<T extends HTMLElement>(
  tagName: string,
  options: {
    attrs?: Record<string, string>;
    innerHTML?: string;
  } = {},
) {
  const element = document.createElement(tagName) as T & {
    updateComplete?: Promise<unknown>;
  };
  for (const [key, value] of Object.entries(options.attrs ?? {})) {
    element.setAttribute(key, value);
  }
  if (options.innerHTML !== undefined) {
    element.innerHTML = options.innerHTML;
  }
  document.body.appendChild(element);
  await waitForComponentUpdate(element);
  return element;
}

export function queryShadow<T extends Element>(
  element: Element & { shadowRoot?: ShadowRoot | null },
  selector: string,
) {
  return element.shadowRoot?.querySelector<T>(selector) ?? null;
}

export async function nextFrame() {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}
