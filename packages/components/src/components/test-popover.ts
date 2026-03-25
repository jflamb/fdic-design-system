function createToggleEvent(newState: "open" | "closed", oldState: "open" | "closed") {
  const event = new Event("toggle");
  Object.defineProperties(event, {
    newState: {
      configurable: true,
      value: newState,
    },
    oldState: {
      configurable: true,
      value: oldState,
    },
  });
  return event as Event & { newState: "open" | "closed"; oldState: "open" | "closed" };
}

export function installPopoverShim() {
  if (typeof HTMLElement.prototype.showPopover !== "function") {
    Object.defineProperty(HTMLElement.prototype, "showPopover", {
      configurable: true,
      value(this: HTMLElement) {
        this.setAttribute("open", "");
        this.dispatchEvent(createToggleEvent("open", "closed"));
      },
    });
  }

  if (typeof HTMLElement.prototype.hidePopover !== "function") {
    Object.defineProperty(HTMLElement.prototype, "hidePopover", {
      configurable: true,
      value(this: HTMLElement) {
        this.removeAttribute("open");
        this.dispatchEvent(createToggleEvent("closed", "open"));
      },
    });
  }
}

export { createToggleEvent };
