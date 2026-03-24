import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/fd-file-input.js";
import { expectNoAxeViolations } from "./test-a11y.js";
import type { FileInputItem } from "./fd-file-input.js";

async function createFileInput(
  attrs: Record<string, string | boolean> = {},
  items?: FileInputItem[],
) {
  const el = document.createElement("fd-file-input") as any;
  for (const [key, value] of Object.entries(attrs)) {
    if (typeof value === "boolean") {
      if (value) {
        el.setAttribute(key, "");
      }
      continue;
    }

    el.setAttribute(key, value);
  }

  if (items) {
    el.items = items;
  }

  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getInput(el: any): HTMLInputElement {
  return el.shadowRoot?.querySelector("[part=native]");
}

function getContainer(el: any): HTMLElement {
  return el.shadowRoot?.querySelector("[part=container]");
}

function createFile(name: string, type: string, content = "test") {
  return new File([content], name, { type });
}

function setInputFiles(input: HTMLInputElement, files: File[]) {
  const fileList = {
    length: files.length,
    item: (index: number) => files[index] ?? null,
    [Symbol.iterator]: function* iterator() {
      yield* files;
    },
    ...files.reduce<Record<number, File>>((acc, file, index) => {
      acc[index] = file;
      return acc;
    }, {}),
  };

  Object.defineProperty(input, "files", {
    configurable: true,
    get: () => fileList as FileList,
  });
}

async function selectFiles(el: any, files: File[]) {
  const input = getInput(el);
  setInputFiles(input, files);
  input.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  await el.updateComplete;
}

function createDropEvent(files: File[]) {
  const event = new Event("drop", { bubbles: true, cancelable: true }) as DragEvent;
  Object.defineProperty(event, "dataTransfer", {
    configurable: true,
    value: {
      files,
      items: files.map((file) => ({
        kind: "file",
        type: file.type,
        getAsFile: () => file,
      })),
      dropEffect: "copy",
    },
  });
  return event;
}

describe("fd-file-input", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-file-input")).toBeDefined();
  });

  it("is form-associated", () => {
    expect((customElements.get("fd-file-input") as any).formAssociated).toBe(true);
  });

  it("renders a native file input in shadow DOM", async () => {
    const el = await createFileInput({
      label: "Upload files",
      hint: "Upload PDF or JPG files.",
    });

    expect(getInput(el).tagName).toBe("INPUT");
    expect(getInput(el).type).toBe("file");
  });

  it("forwards reflected attributes to the internal input", async () => {
    const el = await createFileInput({
      label: "Upload files",
      accept: ".pdf,image/png",
      multiple: true,
      required: true,
      disabled: true,
      name: "attachments",
    });
    const input = getInput(el);

    expect(input.accept).toBe(".pdf,image/png");
    expect(input.multiple).toBe(true);
    expect(input.required).toBe(true);
    expect(input.disabled).toBe(true);
    expect(input.getAttribute("aria-required")).toBe("true");
  });

  it("assembles aria-describedby from hint text", async () => {
    const el = await createFileInput({
      label: "Upload files",
      hint: "Upload PDF or JPG files.",
    });

    expect(getInput(el).getAttribute("aria-describedby")).toContain(
      "fd-file-input-hint-",
    );
  });

  it("reveals invalid state for a required empty field", async () => {
    const el = await createFileInput({
      label: "Upload files",
      required: true,
      "error-message": "Select a file before continuing.",
    });

    expect(el.reportValidity()).toBe(false);
    await el.updateComplete;

    expect(el.validationMessage).toBe("Select a file before continuing.");
    expect(el.hasAttribute("data-user-invalid")).toBe(true);
    expect(getInput(el).getAttribute("aria-invalid")).toBe("true");
    expect(el.shadowRoot?.querySelector("[part=error]")?.textContent).toContain(
      "Select a file before continuing.",
    );
  });

  it("clears visible invalid state after a valid selection", async () => {
    const el = await createFileInput({
      label: "Upload files",
      required: true,
      "error-message": "Select a file before continuing.",
    });

    el.reportValidity();
    await el.updateComplete;
    expect(getInput(el).getAttribute("aria-invalid")).toBe("true");

    await selectFiles(el, [createFile("statement.pdf", "application/pdf")]);

    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(getInput(el).getAttribute("aria-invalid")).toBeNull();
    expect(el.files).toHaveLength(1);
  });

  it("stores a single selected file as the submitted form value", async () => {
    const el = await createFileInput({
      label: "Upload files",
      name: "attachment",
    });
    const file = createFile("statement.pdf", "application/pdf");

    await selectFiles(el, [file]);

    const controller = (el as any)._formController;
    const formValue = controller.internals.getFormValue();
    expect(formValue).toBe(file);
  });

  it("stores multiple selected files in FormData", async () => {
    const el = await createFileInput({
      label: "Upload files",
      name: "attachment",
      multiple: true,
    });

    const fileA = createFile("statement.pdf", "application/pdf");
    const fileB = createFile("photo.png", "image/png");

    await selectFiles(el, [fileA, fileB]);

    const controller = (el as any)._formController;
    const formValue = controller.internals.getFormValue() as FormData;
    expect(formValue).toBeInstanceOf(FormData);
    expect(formValue.getAll("attachment")).toHaveLength(2);
  });

  it("rejects files that do not match accept", async () => {
    const el = await createFileInput({
      label: "Upload files",
      accept: ".pdf",
      "error-message": "Choose a valid file.",
    });

    const handler = vi.fn();
    el.addEventListener("fd-file-input-change", handler);

    await selectFiles(el, [createFile("photo.png", "image/png")]);

    expect(el.validationMessage).toBe("Choose a valid file.");
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].detail.files).toHaveLength(0);
    expect(handler.mock.calls[0][0].detail.rejectedFiles[0].reason).toBe("type");
  });

  it("rejects files that exceed the file-size limit", async () => {
    const el = await createFileInput({
      label: "Upload files",
      "max-file-size": "4",
      "error-message": "Choose a valid file.",
    });
    const bigFile = createFile("large.pdf", "application/pdf", "12345");
    const handler = vi.fn();
    el.addEventListener("fd-file-input-change", handler);

    await selectFiles(el, [bigFile]);

    expect(handler.mock.calls[0][0].detail.rejectedFiles[0].reason).toBe("size");
  });

  it("enforces max-files across repeated selections", async () => {
    const el = await createFileInput({
      label: "Upload files",
      multiple: true,
      "max-files": "2",
    });
    const handler = vi.fn();
    el.addEventListener("fd-file-input-change", handler);

    await selectFiles(el, [createFile("a.pdf", "application/pdf")]);
    await selectFiles(el, [
      createFile("b.pdf", "application/pdf"),
      createFile("c.pdf", "application/pdf"),
    ]);

    expect(el.files).toHaveLength(2);
    expect(handler.mock.calls[1][0].detail.rejectedFiles[0].reason).toBe("count");
    expect(el.shadowRoot?.querySelector("[part=limit]")?.textContent).toContain(
      "You’ve reached the file upload limit.",
    );
  });

  it("handles dropped files through the same validation path", async () => {
    const el = await createFileInput({
      label: "Upload files",
      multiple: true,
    });
    const handler = vi.fn();
    el.addEventListener("fd-file-input-change", handler);
    const container = getContainer(el);

    container.dispatchEvent(
      createDropEvent([createFile("drop.pdf", "application/pdf")]),
    );
    await el.updateComplete;

    expect(handler).toHaveBeenCalledTimes(1);
    expect(el.files).toHaveLength(1);
  });

  it("renders authored item rows and dispatches row actions", async () => {
    const file = createFile("statement.pdf", "application/pdf");
    const item: FileInputItem = {
      id: "file-1",
      fileName: "statement.pdf",
      state: "success",
      file,
    };
    const el = await createFileInput(
      {
        label: "Upload files",
        name: "attachment",
      },
      [item],
    );
    await selectFiles(el, [file]);

    const handler = vi.fn();
    el.addEventListener("fd-file-input-action", handler);

    const actionButton = el.shadowRoot?.querySelector(
      "[part=item-action]",
    ) as HTMLButtonElement | null;

    actionButton?.click();
    await el.updateComplete;

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].detail).toEqual({
      action: "remove",
      itemId: "file-1",
    });
    expect(el.files).toHaveLength(0);
  });

  it("shows a fallback summary when files are selected without authored rows", async () => {
    const el = await createFileInput({
      label: "Upload files",
    });

    await selectFiles(el, [createFile("statement.pdf", "application/pdf")]);

    expect(el.shadowRoot?.querySelector("[part=summary]")?.textContent).toContain(
      "1 file selected.",
    );
  });

  it("supports clear()", async () => {
    const el = await createFileInput({
      label: "Upload files",
      required: true,
    });

    await selectFiles(el, [createFile("statement.pdf", "application/pdf")]);
    expect(el.files).toHaveLength(1);

    el.clear();
    await el.updateComplete;

    expect(el.files).toHaveLength(0);
    expect(el.hasAttribute("data-user-invalid")).toBe(false);
  });

  it("has no axe violations in the default accessible configuration", async () => {
    const el = await createFileInput({
      label: "Upload files",
      hint: "Upload PDF or JPG files.",
    });

    await expectNoAxeViolations(el.shadowRoot!);
  });
});
