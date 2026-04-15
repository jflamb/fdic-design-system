import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, waitFor } from "storybook/test";
import "@jflamb/fdic-ds-components/register-all";
import type { FileInputItem } from "@jflamb/fdic-ds-components/fd-file-input";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_SPACIOUS_STACK_STYLE,
} from "./docs-overview";

type FileInputArgs = {
  name: string;
  label: string;
  hint: string;
  buttonText: string;
  dropText: string;
  errorMessage: string;
  limitText: string;
  required: boolean;
  disabled: boolean;
  multiple: boolean;
  accept: string;
  maxFiles: number | undefined;
  maxFileSize: number | undefined;
  items: FileInputItem[];
};

const makeFile = (name: string, type: string, content = "test") =>
  new File([content], name, { type });

const completeFiles = [
  makeFile("Statement.pdf", "application/pdf"),
  makeFile("Evidence.png", "image/png"),
];

const partialItems: FileInputItem[] = [
  {
    id: "statement",
    fileName: "Statement.pdf",
    state: "success",
    message: "Upload successful",
    file: completeFiles[0],
  },
  {
    id: "evidence",
    fileName: "Evidence.png",
    state: "success",
    message: "Upload successful",
    file: completeFiles[1],
  },
];

const mixedItems: FileInputItem[] = [
  {
    id: "uploading",
    fileName: "Identity.pdf",
    state: "uploading",
    message: "Uploading…",
    progress: 24,
    file: makeFile("Identity.pdf", "application/pdf"),
  },
  {
    id: "failed",
    fileName: "BankStatement.pdf",
    state: "error",
    message: "Upload failed",
    file: makeFile("BankStatement.pdf", "application/pdf"),
  },
  {
    id: "invalid",
    fileName: "Archive.zip",
    state: "invalid",
    message: "Invalid file type",
  },
];

let storyCounter = 0;

const renderFileInput = (
  args: FileInputArgs,
  {
    acceptedFiles = [],
    dragActive = false,
    revealInvalid = false,
  }: {
    acceptedFiles?: File[];
    dragActive?: boolean;
    revealInvalid?: boolean;
  } = {},
) => {
  const storyId = `fd-file-input-story-${storyCounter++}`;

  queueMicrotask(async () => {
    const host = document.getElementById(storyId) as any;
    if (!host) return;

    if (acceptedFiles.length > 0) {
      host._acceptedFiles = acceptedFiles;
      host._formController?.sync();
      host.requestUpdate();
      await host.updateComplete;
    }

    if (dragActive) {
      host.setAttribute("data-drag-active", "");
    }

    if (revealInvalid) {
      host.reportValidity();
      await host.updateComplete;
    }
  });

  return html`
    <div style="max-width: 780px;">
      <fd-file-input
        id=${storyId}
        name=${ifDefined(args.name || undefined)}
        label=${ifDefined(args.label || undefined)}
        hint=${ifDefined(args.hint || undefined)}
        button-text=${ifDefined(args.buttonText || undefined)}
        drop-text=${ifDefined(args.dropText || undefined)}
        error-message=${ifDefined(args.errorMessage || undefined)}
        limit-text=${ifDefined(args.limitText || undefined)}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?multiple=${args.multiple}
        accept=${ifDefined(args.accept || undefined)}
        max-files=${ifDefined(args.maxFiles ?? undefined)}
        max-file-size=${ifDefined(args.maxFileSize ?? undefined)}
        .items=${args.items}
      ></fd-file-input>
    </div>
  `;
};

const meta = {
  title: "Components/File Input",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "A self-contained, form-associated file input that keeps a native `<input type=\"file\">` under the hood, adds progressive drag-and-drop enhancement, and renders authored per-file upload states without taking ownership of network transport.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-file-input"),
    items: {
      control: "object",
      description:
        "Property-only row model for authored upload states. Set from JavaScript rather than markup.",
    },
  },
  args: {
    ...getComponentArgs("fd-file-input"),
    name: "attachments",
    label: "Upload files",
    hint: "Upload up to 2 PDF, JPG, or PNG files with a maximum file size of 10 MB.",
    buttonText: "Select file",
    dropText: "or drop here",
    errorMessage: "Select a file before continuing.",
    limitText: "All set! You’ve reached the file upload limit.",
    multiple: true,
    accept: ".pdf,.jpg,.jpeg,.png",
    maxFiles: 2,
    maxFileSize: 10 * 1024 * 1024,
    items: [],
  },
  render: (args: FileInputArgs) => renderFileInput(args),
} satisfies Meta<FileInputArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-file-input") as HTMLElement | null;
  const input = host?.shadowRoot?.querySelector("[part=native]");

  expect(host).toBeDefined();
  expect(input?.tagName).toBe("INPUT");
};

export const RequiredInvalid: Story = {
  args: {
    required: true,
  },
  render: (args) => renderFileInput(args, { revealInvalid: true }),
};

RequiredInvalid.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-file-input") as HTMLElement | null;

  await waitFor(() => {
    expect(host?.hasAttribute("data-user-invalid")).toBe(true);
    expect(host?.shadowRoot?.querySelector("[part=error]")?.textContent).toContain(
      "Select a file before continuing.",
    );
  });
};

export const DragTarget: Story = {
  render: (args) => renderFileInput(args, { dragActive: true }),
};

export const WithCompletedFiles: Story = {
  args: {
    maxFiles: 3,
    items: partialItems,
  },
  render: (args) => renderFileInput(args, { acceptedFiles: completeFiles }),
};

export const MixedFileStates: Story = {
  args: {
    maxFiles: 4,
    items: mixedItems,
  },
  render: (args) =>
    renderFileInput(args, {
      acceptedFiles: mixedItems
        .map((item) => item.file)
        .filter((file): file is File => Boolean(file)),
    }),
};

export const AtLimit: Story = {
  args: {
    items: partialItems,
  },
  render: (args) => renderFileInput(args, { acceptedFiles: completeFiles }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    items: partialItems,
  },
  render: (args) => renderFileInput(args, { acceptedFiles: completeFiles }),
};

export const DocsOverview: Story = {
  render: (args) => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Empty state</strong>
        ${renderFileInput(args)}
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Drag target</strong>
        ${renderFileInput(args, { dragActive: true })}
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Files attached</strong>
        ${renderFileInput(
          { ...args, maxFiles: 3, items: partialItems },
          { acceptedFiles: completeFiles },
        )}
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Mixed row states</strong>
        ${renderFileInput(
          { ...args, maxFiles: 4, items: mixedItems },
          {
            acceptedFiles: mixedItems
              .map((item) => item.file)
              .filter((file): file is File => Boolean(file)),
          },
        )}
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Limit reached</strong>
        ${renderFileInput({ ...args, items: partialItems }, { acceptedFiles: completeFiles })}
      </section>
    </div>
  `,
};
