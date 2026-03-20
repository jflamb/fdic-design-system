# Storybook Prose Stories Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create Storybook stories for all 8 documented prose components so that `<StoryEmbed>` references in the VitePress docs resolve to interactive stories.

**Architecture:** Each prose component gets a story file under `apps/storybook/src/` with a `Prose/` title prefix. A global decorator in `preview.ts` imports the prose CSS and wraps stories in `<div class="prose">`. Stories render raw HTML via Lit's `html` tagged template, with args for Storybook controls.

**Tech Stack:** Storybook 10, `@storybook/web-components-vite`, Lit `html` tag, prose.css

**Design doc:** `docs/plans/2026-03-20-storybook-prose-stories-design.md`

---

### Task 1: Update preview.ts — prose CSS + global decorator

**Files:**
- Modify: `apps/storybook/.storybook/preview.ts`

**Step 1: Update preview.ts**

Replace the contents of `apps/storybook/.storybook/preview.ts` with:

```ts
import type { Preview } from "@storybook/web-components-vite";
import { html } from "lit";
import "../../docs/.vitepress/theme/prose.css";

const preview: Preview = {
  decorators: [
    (story) => html`<div class="prose">${story()}</div>`
  ],
  parameters: {
    options: {
      storySort: {
        order: ["Prose", "Components"]
      }
    }
  }
};

export default preview;
```

**Step 2: Verify Storybook starts**

Run: `npm run dev:storybook` (from repo root)
Expected: Storybook launches on port 6006, existing Placeholder story renders, prose CSS is loaded (visible via inspecting the page — Source Sans 3 font, prose tokens in `:root`).

**Step 3: Commit**

```bash
git add apps/storybook/.storybook/preview.ts
git commit -m "feat(storybook): add prose CSS import and global .prose decorator"
```

---

### Task 2: Callout stories

**Files:**
- Create: `apps/storybook/src/callout.stories.ts`

**Step 1: Create the story file**

```ts
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

type CalloutArgs = {
  variant: "default" | "info" | "warning" | "success" | "danger";
  content: string;
  label: string;
};

const variantClass = (v: string) =>
  v === "default" ? "" : ` prose-callout-${v}`;

const variantRole = (v: string) =>
  v === "danger" ? "status" : "note";

const meta = {
  title: "Prose/Callout",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "info", "warning", "success", "danger"]
    },
    content: { control: "text" },
    label: { control: "text" }
  },
  args: {
    variant: "default",
    content:
      "Deposit insurance coverage is determined by the ownership category of the depositor's accounts, not by the number of accounts held.",
    label: "Tip"
  },
  render: (args: CalloutArgs) => html`
    <div
      class=${`prose-callout${variantClass(args.variant)}`}
      role=${variantRole(args.variant)}
      aria-label=${args.label}
    >
      <span class="prose-callout-icon" aria-hidden="true"></span>
      <div class="prose-callout-content">
        <p>${args.content}</p>
      </div>
    </div>
  `
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Info: Story = {
  args: {
    variant: "info",
    content:
      "The standard maximum deposit insurance amount is $250,000 per depositor, per insured bank, for each account ownership category.",
    label: "Information"
  }
};

export const Warning: Story = {
  args: {
    variant: "warning",
    content:
      "If your combined deposits at a single institution exceed $250,000, amounts above the limit may not be insured. Review your account ownership categories before the reporting deadline.",
    label: "Warning"
  }
};

export const Success: Story = {
  args: {
    variant: "success",
    content:
      "Your Call Report has been submitted and accepted. A confirmation number has been sent to the contact email on file.",
    label: "Success"
  }
};

export const Danger: Story = {
  args: {
    variant: "danger",
    content:
      "This action will permanently close the account and cannot be reversed. All associated records will be archived according to retention policy.",
    label: "Critical alert"
  }
};
```

**Step 2: Verify in Storybook**

Run: `npm run dev:storybook`
Expected: "Prose / Callout" appears in sidebar with 5 stories. Each renders with correct icon, colors, and ARIA attributes. Controls panel lets you switch variant, edit content, and edit label.

**Step 3: Commit**

```bash
git add apps/storybook/src/callout.stories.ts
git commit -m "feat(storybook): add callout stories with all 5 variants"
```

---

### Task 3: Table stories

**Files:**
- Create: `apps/storybook/src/table.stories.ts`

**Step 1: Create the story file**

```ts
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

type TableArgs = {
  caption: string;
  showNumeric: boolean;
  showFooter: boolean;
};

const meta = {
  title: "Prose/Table",
  tags: ["autodocs"],
  argTypes: {
    caption: { control: "text" },
    showNumeric: { control: "boolean" },
    showFooter: { control: "boolean" }
  },
  args: {
    caption: "FDIC-insured deposit balances, Q4 2025",
    showNumeric: true,
    showFooter: true
  },
  render: (args: TableArgs) => {
    const nc = args.showNumeric ? "prose-td-numeric" : "";
    return html`
      <div class="prose-table-wrapper" role="region"
        aria-label="Quarterly deposit summary by account type" tabindex="0">
        <table>
          <caption>${args.caption}</caption>
          <thead>
            <tr>
              <th>Account type</th>
              <th>Interest rate</th>
              <th>Total deposits</th>
              <th>Change from Q3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Checking</td>
              <td class=${nc}>0.07%</td>
              <td class=${nc}>$5,842,300,000</td>
              <td class=${nc}>+2.1%</td>
            </tr>
            <tr>
              <td>Savings</td>
              <td class=${nc}>0.46%</td>
              <td class=${nc}>$3,217,600,000</td>
              <td class=${nc}>+1.8%</td>
            </tr>
            <tr>
              <td>Money market</td>
              <td class=${nc}>4.25%</td>
              <td class=${nc}>$1,985,400,000</td>
              <td class=${nc}>+5.3%</td>
            </tr>
            <tr>
              <td>Certificates of deposit</td>
              <td class=${nc}>4.80%</td>
              <td class=${nc}>$2,641,900,000</td>
              <td class=${nc}>+8.7%</td>
            </tr>
          </tbody>
          ${args.showFooter
            ? html`<tfoot>
                <tr>
                  <td><strong>Total</strong></td>
                  <td></td>
                  <td class=${nc}><strong>$13,687,200,000</strong></td>
                  <td class=${nc}><strong>+3.9%</strong></td>
                </tr>
              </tfoot>`
            : ""}
        </table>
      </div>
    `;
  }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Numeric: Story = {
  args: {
    showNumeric: true,
    showFooter: true
  }
};
```

**Step 2: Verify in Storybook**

Expected: "Prose / Table" with 2 stories. Striped rows, hover highlight, numeric right-alignment, footer row visible. Controls toggle numeric alignment and footer.

**Step 3: Commit**

```bash
git add apps/storybook/src/table.stories.ts
git commit -m "feat(storybook): add table stories with numeric and footer controls"
```

---

### Task 4: TOC stories

**Files:**
- Create: `apps/storybook/src/toc.stories.ts`

**Step 1: Create the story file**

```ts
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, nothing } from "lit";

type TocItem = { label: string; href: string };

type TocArgs = {
  items: TocItem[];
  activeIndex: number;
};

const defaultItems: TocItem[] = [
  { label: "When to Use", href: "#when-to-use" },
  { label: "Live Examples", href: "#live-examples" },
  { label: "Best Practices", href: "#best-practices" },
  { label: "Interaction Behavior", href: "#interaction-behavior" },
  { label: "Accessibility", href: "#accessibility" }
];

const meta = {
  title: "Prose/TOC",
  tags: ["autodocs"],
  argTypes: {
    activeIndex: {
      control: { type: "range", min: -1, max: 4, step: 1 },
      description: "Index of the active item (-1 for none)"
    }
  },
  args: {
    items: defaultItems,
    activeIndex: -1
  },
  render: (args: TocArgs) => html`
    <nav class="prose-toc" aria-label="Table of contents">
      <p class="prose-toc-title">On this page</p>
      <ul>
        ${args.items.map(
          (item, i) => html`
            <li>
              <a
                href=${item.href}
                class=${i === args.activeIndex ? "prose-toc-active" : nothing}
              >${item.label}</a>
            </li>
          `
        )}
      </ul>
    </nav>
  `
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ActiveState: Story = {
  args: {
    activeIndex: 2
  }
};
```

**Step 2: Verify in Storybook**

Expected: "Prose / TOC" with 2 stories. Default shows no active link. ActiveState highlights "Best Practices." Range slider in controls changes active item.

**Step 3: Commit**

```bash
git add apps/storybook/src/toc.stories.ts
git commit -m "feat(storybook): add TOC stories with active state control"
```

---

### Task 5: Details stories

**Files:**
- Create: `apps/storybook/src/details.stories.ts`

**Step 1: Create the story file**

```ts
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

type DetailsArgs = {
  summary: string;
  content: string;
  open: boolean;
};

const meta = {
  title: "Prose/Details",
  tags: ["autodocs"],
  argTypes: {
    summary: { control: "text" },
    content: { control: "text" },
    open: { control: "boolean" }
  },
  args: {
    summary: "What is FDIC deposit insurance?",
    content:
      "The Federal Deposit Insurance Corporation (FDIC) insures deposits at member banks up to $250,000 per depositor, per insured bank, for each account ownership category.",
    open: false
  },
  render: (args: DetailsArgs) => html`
    <details ?open=${args.open}>
      <summary>${args.summary}</summary>
      <p>${args.content}</p>
    </details>
  `
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FaqGroup: Story = {
  render: () => html`
    <details>
      <summary>What is FDIC deposit insurance?</summary>
      <p>The Federal Deposit Insurance Corporation (FDIC) insures deposits at member banks up to $250,000 per depositor, per insured bank, for each account ownership category.</p>
    </details>
    <details>
      <summary>What types of accounts are insured?</summary>
      <p>FDIC insurance covers checking accounts, savings accounts, money market deposit accounts, and certificates of deposit (CDs) at insured institutions.</p>
    </details>
    <details>
      <summary>Are joint accounts insured separately?</summary>
      <p>Yes. Joint accounts are insured separately from single-ownership accounts. Each co-owner's share is insured up to $250,000.</p>
    </details>
  `
};
```

**Step 2: Verify in Storybook**

Expected: "Prose / Details" with 2 stories. Default shows single accordion. FaqGroup shows 3 sequential accordions. Click/Enter toggles open/close with chevron rotation.

**Step 3: Commit**

```bash
git add apps/storybook/src/details.stories.ts
git commit -m "feat(storybook): add details/accordion stories with FAQ group"
```

---

### Task 6: Code Block stories

**Files:**
- Create: `apps/storybook/src/code-block.stories.ts`

**Step 1: Create the story file**

```ts
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

type CodeBlockArgs = {
  code: string;
  language: string;
  showCopyButton: boolean;
};

const meta = {
  title: "Prose/Code Block",
  tags: ["autodocs"],
  argTypes: {
    code: { control: "text" },
    language: { control: "text" },
    showCopyButton: { control: "boolean" }
  },
  args: {
    code: `.prose {
  max-width: var(--prose-max-width, 65ch);
  line-height: var(--fdic-line-height-body, 1.5);
  color: var(--fdic-text-primary, #212123);
}`,
    language: "css",
    showCopyButton: false
  },
  render: (args: CodeBlockArgs) => html`
    <pre style=${args.showCopyButton ? "position: relative;" : ""}><code
        class=${`language-${args.language}`}
      >${args.code}</code>${args.showCopyButton
        ? html`<button
            class="prose-copy-btn"
            type="button"
            aria-label="Copy code to clipboard"
          >Copy</button>`
        : ""}</pre>
  `
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCopy: Story = {
  args: {
    showCopyButton: true
  }
};
```

**Step 2: Verify in Storybook**

Expected: "Prose / Code Block" with 2 stories. Default shows code block with monospace font and container styling. WithCopy shows a copy button that appears on hover (button is not wired to clipboard — markup only).

**Step 3: Commit**

```bash
git add apps/storybook/src/code-block.stories.ts
git commit -m "feat(storybook): add code block stories with copy button variant"
```

---

### Task 7: Progress stories

**Files:**
- Create: `apps/storybook/src/progress.stories.ts`

**Step 1: Create the story file**

```ts
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

type ProgressArgs = {
  value: number;
  max: number;
  label: string;
  valueText: string;
};

const meta = {
  title: "Prose/Progress",
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    max: { control: "number" },
    label: { control: "text" },
    valueText: { control: "text" }
  },
  args: {
    value: 3,
    max: 5,
    label: "Application completion",
    valueText: "3 of 5 steps (60%)"
  },
  render: (args: ProgressArgs) => html`
    <div class="prose-progress-group">
      <label for="story-progress">${args.label}</label>
      <progress
        id="story-progress"
        value=${args.value}
        max=${args.max}
        aria-label=${`${args.label}: ${args.valueText}`}
      >${args.valueText}</progress>
      <span class="prose-progress-value">${args.valueText}</span>
    </div>
  `
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Determinate: Story = {};

export const Indeterminate: Story = {
  render: () => html`
    <div class="prose-progress-group">
      <label for="story-progress-ind">Validating filing data</label>
      <progress
        id="story-progress-ind"
        aria-label="Validating filing data"
      >Processing...</progress>
      <span class="prose-progress-value">Processing...</span>
    </div>
  `
};
```

**Step 2: Verify in Storybook**

Expected: "Prose / Progress" with 2 stories. Determinate shows filled bar with label and value. Indeterminate shows animated stripes. Range slider adjusts the determinate value.

**Step 3: Commit**

```bash
git add apps/storybook/src/progress.stories.ts
git commit -m "feat(storybook): add progress stories with determinate and indeterminate variants"
```

---

### Task 8: Meter story

**Files:**
- Create: `apps/storybook/src/meter.stories.ts`

**Step 1: Create the story file**

```ts
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

type MeterArgs = {
  value: number;
  min: number;
  max: number;
  low: number;
  high: number;
  optimum: number;
  label: string;
  valueText: string;
};

const meta = {
  title: "Prose/Meter",
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 20, step: 0.1 } },
    min: { control: "number" },
    max: { control: "number" },
    low: { control: "number" },
    high: { control: "number" },
    optimum: { control: "number" },
    label: { control: "text" },
    valueText: { control: "text" }
  },
  args: {
    value: 12.4,
    min: 0,
    max: 20,
    low: 4,
    high: 5,
    optimum: 10,
    label: "Tier 1 leverage ratio",
    valueText: "12.4% (well-capitalized)"
  },
  render: (args: MeterArgs) => html`
    <div class="prose-progress-group">
      <label for="story-meter">${args.label}</label>
      <meter
        id="story-meter"
        value=${args.value}
        min=${args.min}
        max=${args.max}
        low=${args.low}
        high=${args.high}
        optimum=${args.optimum}
        aria-label=${`${args.label}: ${args.valueText}`}
      >${args.valueText}</meter>
      <span class="prose-progress-value">${args.valueText}</span>
    </div>
  `
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

**Step 2: Verify in Storybook**

Expected: "Prose / Meter" with 1 story. Shows meter bar with label and value text. Range slider adjusts value; meter color changes when value crosses low/high thresholds.

**Step 3: Commit**

```bash
git add apps/storybook/src/meter.stories.ts
git commit -m "feat(storybook): add meter story with range controls"
```

---

### Task 9: Footnotes story

**Files:**
- Create: `apps/storybook/src/footnotes.stories.ts`

**Step 1: Create the story file**

```ts
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta = {
  title: "Prose/Footnotes",
  tags: ["autodocs"],
  args: {},
  render: () => html`
    <p>
      Deposit insurance covers up to $250,000 per depositor, per insured bank,
      for each account ownership category.<sup><a href="#fn1" id="ref1" role="doc-noteref">[1]</a></sup>
      Joint accounts receive separate coverage from single-ownership
      accounts.<sup><a href="#fn2" id="ref2" role="doc-noteref">[2]</a></sup>
    </p>

    <section class="prose-footnotes" role="doc-endnotes" aria-label="Footnotes">
      <hr />
      <ol>
        <li id="fn1" role="doc-footnote">
          Federal Deposit Insurance Corporation. "Deposit Insurance FAQs."
          Coverage limits were last adjusted by the Dodd-Frank Act of 2010.
          <a href="#ref1" role="doc-backlink" title="Back to reference">&#x21a9;</a>
        </li>
        <li id="fn2" role="doc-footnote">
          12 C.F.R. Part 330 governs the general rules for deposit insurance
          coverage.
          <a href="#ref2" role="doc-backlink" title="Back to reference">&#x21a9;</a>
        </li>
      </ol>
    </section>
  `
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

**Step 2: Verify in Storybook**

Expected: "Prose / Footnotes" with 1 story. Body text with superscript references, horizontal rule separator, numbered footnote list with back-links. Clicking [1] scrolls to footnote; clicking ↩ scrolls back.

**Step 3: Commit**

```bash
git add apps/storybook/src/footnotes.stories.ts
git commit -m "feat(storybook): add footnotes story with bidirectional navigation"
```

---

### Task 10: Aside story

**Files:**
- Create: `apps/storybook/src/aside.stories.ts`

**Step 1: Create the story file**

```ts
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

type AsideArgs = {
  content: string;
  label: string;
};

const meta = {
  title: "Prose/Aside",
  tags: ["autodocs"],
  argTypes: {
    content: { control: "text" },
    label: { control: "text" }
  },
  args: {
    content:
      "The standard maximum deposit insurance amount is $250,000 per depositor, per insured bank, for each account ownership category.",
    label: "Key fact about deposit insurance"
  },
  render: (args: AsideArgs) => html`
    <p>
      When evaluating deposit insurance coverage, it is important to understand
      how the FDIC categorizes account ownership. Each ownership category —
      single accounts, joint accounts, revocable trust accounts, and certain
      retirement accounts — is insured separately up to the standard maximum
      amount.
    </p>
    <aside aria-label=${args.label}>
      <p>${args.content}</p>
    </aside>
    <p>
      This means a depositor with accounts in multiple ownership categories at
      the same insured bank can potentially be insured for more than $250,000 in
      total. For example, funds in a single account, a joint account, and an IRA
      at the same bank are each insured separately.
    </p>
  `
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

**Step 2: Verify in Storybook**

Expected: "Prose / Aside" with 1 story. Aside floats right at 40% width with brand-blue left border, surrounded by body paragraphs. Controls let you edit content and aria-label.

**Step 3: Commit**

```bash
git add apps/storybook/src/aside.stories.ts
git commit -m "feat(storybook): add aside story with floating pull quote"
```

---

### Task 11: Final verification

**Step 1: Verify all 20 story IDs match doc references**

Run Storybook and confirm the sidebar shows:
- Prose / Aside → Default
- Prose / Callout → Default, Info, Warning, Success, Danger
- Prose / Code Block → Default, WithCopy
- Prose / Details → Default, FaqGroup
- Prose / Footnotes → Default
- Prose / Meter → Default
- Prose / Progress → Determinate, Indeterminate
- Prose / Table → Default, Numeric
- Prose / TOC → Default, ActiveState

**Step 2: Cross-reference with doc StoryEmbed IDs**

Verify these story IDs resolve (Storybook URL `?id=<story-id>`):
- `prose-callout--default`, `--info`, `--warning`, `--success`, `--danger`
- `prose-table--default`, `--numeric`
- `prose-toc--default`, `--active-state`
- `prose-details--default`, `--faq-group`
- `prose-code-block--default`, `--with-copy`
- `prose-progress--determinate`, `--indeterminate`
- `prose-meter--default`
- `prose-footnotes--default`
- `prose-aside--default`

**Step 3: Build check**

Run: `npm run build:storybook`
Expected: Clean build, no errors.
