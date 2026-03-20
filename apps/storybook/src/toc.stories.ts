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
