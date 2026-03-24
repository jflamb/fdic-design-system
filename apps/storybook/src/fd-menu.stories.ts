import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import "@fdic-ds/components/register-all";
import {
  DOCS_OVERVIEW_GRID_STYLE,
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_META_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
} from "./docs-overview";

const meta = {
  title: "Components/Menu",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "Public event contract: listen for `fd-menu-open-change` on `fd-menu` and `fd-menu-item-select` on `fd-menu-item`. Deprecated compatibility events `fd-open` and `fd-select` still fire during the transition window.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function getButtonBase(host: Element | null) {
  return host?.shadowRoot?.querySelector("[part=base]") as HTMLButtonElement | null;
}

function getMenuElements(canvasElement: HTMLElement) {
  const triggerHost = canvasElement.querySelector("fd-button");
  const trigger = getButtonBase(triggerHost);
  const menu = canvasElement.querySelector("fd-menu") as HTMLElement | null;
  const items = Array.from(canvasElement.querySelectorAll("fd-menu-item"));

  return { triggerHost, trigger, menu, items };
}

async function waitForMenuWiring() {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      requestAnimationFrame(() => resolve());
    }, 0);
  });
}

/**
 * Helper: wires a trigger button to toggle an fd-menu.
 */
function wireMenu(triggerId: string, menuId: string) {
  requestAnimationFrame(() => {
    const trigger = document.getElementById(triggerId);
    const menu = document.getElementById(menuId) as any;
    if (!trigger || !menu) return;

    trigger.addEventListener("click", () => menu.toggle());
    trigger.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        menu.show();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        menu.showLast();
      }
    });
  });
}

export const Default: Story = {
  render: () => {
    const triggerId = "trigger-default";
    const menuId = "menu-default";
    setTimeout(() => wireMenu(triggerId, menuId), 0);

    return html`
      <div style="position: relative; padding: 80px 20px;">
        <fd-button id=${triggerId} aria-haspopup="menu">
          Actions
          <fd-icon slot="icon-end" name="caret-down"></fd-icon>
        </fd-button>
        <fd-menu id=${menuId} anchor=${triggerId} label="Actions">
          <fd-menu-item>Save as draft</fd-menu-item>
          <fd-menu-item>Save & submit</fd-menu-item>
          <fd-menu-item>Export as PDF</fd-menu-item>
        </fd-menu>
      </div>
    `;
  },
};

Default.play = async ({ canvasElement, userEvent }) => {
  const { triggerHost, trigger, menu, items } = getMenuElements(canvasElement);
  const openEvents: boolean[] = [];

  menu?.addEventListener("fd-menu-open-change", (event: Event) => {
    openEvents.push((event as CustomEvent<{ open: boolean }>).detail.open);
  });

  expect(trigger).toBeDefined();
  expect(menu).toBeDefined();

  await waitForMenuWiring();

  await userEvent.click(trigger!);

  await waitFor(() => {
    expect(menu?.hasAttribute("open")).toBe(true);
    expect(triggerHost?.getAttribute("aria-expanded")).toBe("true");
  });

  const firstItemButton = getButtonBase(items[0]);
  await waitFor(() => {
    expect(firstItemButton?.getAttribute("tabindex")).toBe("0");
  });

  await userEvent.keyboard("{ArrowDown}");

  const secondItemButton = getButtonBase(items[1]);
  await waitFor(() => {
    expect(secondItemButton?.getAttribute("tabindex")).toBe("0");
  });

  await userEvent.keyboard("{Escape}");

  await waitFor(() => {
    expect(menu?.hasAttribute("open")).toBe(false);
    expect(triggerHost?.getAttribute("aria-expanded")).toBe("false");
  });

  expect(openEvents).toEqual([true, false]);
};

export const PlacementBottomEnd: Story = {
  name: "Placement: bottom-end",
  render: () => {
    const triggerId = "trigger-bottom-end";
    const menuId = "menu-bottom-end";
    setTimeout(() => wireMenu(triggerId, menuId), 0);

    return html`
      <div style="display: flex; justify-content: flex-end; padding: 80px 20px;">
        <fd-button id=${triggerId} aria-haspopup="menu">
          Actions
          <fd-icon slot="icon-end" name="caret-down"></fd-icon>
        </fd-button>
        <fd-menu id=${menuId} anchor=${triggerId} placement="bottom-end" label="Actions">
          <fd-menu-item>Save as draft</fd-menu-item>
          <fd-menu-item>Save & submit</fd-menu-item>
          <fd-menu-item>Export as PDF</fd-menu-item>
        </fd-menu>
      </div>
    `;
  },
};

export const PlacementTopStart: Story = {
  name: "Placement: top-start",
  render: () => {
    const triggerId = "trigger-top-start";
    const menuId = "menu-top-start";
    setTimeout(() => wireMenu(triggerId, menuId), 0);

    return html`
      <div style="padding: 200px 20px 20px;">
        <fd-button id=${triggerId} aria-haspopup="menu">
          Actions
          <fd-icon slot="icon-end" name="caret-down"></fd-icon>
        </fd-button>
        <fd-menu id=${menuId} anchor=${triggerId} placement="top-start" label="Actions">
          <fd-menu-item>Save as draft</fd-menu-item>
          <fd-menu-item>Save & submit</fd-menu-item>
          <fd-menu-item>Export as PDF</fd-menu-item>
        </fd-menu>
      </div>
    `;
  },
};

export const PlacementTopEnd: Story = {
  name: "Placement: top-end",
  render: () => {
    const triggerId = "trigger-top-end";
    const menuId = "menu-top-end";
    setTimeout(() => wireMenu(triggerId, menuId), 0);

    return html`
      <div style="display: flex; justify-content: flex-end; padding: 200px 20px 20px;">
        <fd-button id=${triggerId} aria-haspopup="menu">
          Actions
          <fd-icon slot="icon-end" name="caret-down"></fd-icon>
        </fd-button>
        <fd-menu id=${menuId} anchor=${triggerId} placement="top-end" label="Actions">
          <fd-menu-item>Save as draft</fd-menu-item>
          <fd-menu-item>Save & submit</fd-menu-item>
          <fd-menu-item>Export as PDF</fd-menu-item>
        </fd-menu>
      </div>
    `;
  },
};

export const DestructiveItem: Story = {
  render: () => {
    const triggerId = "trigger-destructive";
    const menuId = "menu-destructive";
    setTimeout(() => wireMenu(triggerId, menuId), 0);

    return html`
      <div style="padding: 80px 20px;">
        <fd-button id=${triggerId} aria-haspopup="menu">
          Account
          <fd-icon slot="icon-end" name="caret-down"></fd-icon>
        </fd-button>
        <fd-menu id=${menuId} anchor=${triggerId} label="Account actions">
          <fd-menu-item>Edit profile</fd-menu-item>
          <fd-menu-item>Change password</fd-menu-item>
          <fd-menu-item variant="destructive">Delete account</fd-menu-item>
        </fd-menu>
      </div>
    `;
  },
};

export const DisabledItems: Story = {
  render: () => {
    const triggerId = "trigger-disabled";
    const menuId = "menu-disabled";
    setTimeout(() => wireMenu(triggerId, menuId), 0);

    return html`
      <div style="padding: 80px 20px;">
        <fd-button id=${triggerId} aria-haspopup="menu">
          Filing actions
          <fd-icon slot="icon-end" name="caret-down"></fd-icon>
        </fd-button>
        <fd-menu id=${menuId} anchor=${triggerId} label="Filing actions">
          <fd-menu-item>Save as draft</fd-menu-item>
          <fd-menu-item disabled>Submit for review</fd-menu-item>
          <fd-menu-item disabled>Publish</fd-menu-item>
          <fd-menu-item variant="destructive">Discard filing</fd-menu-item>
        </fd-menu>
      </div>
    `;
  },
};

export const MenuItemContract: Story = {
  render: () => {
    const triggerId = "trigger-item-contract";
    const menuId = "menu-item-contract";
    setTimeout(() => wireMenu(triggerId, menuId), 0);

    return html`
      <div style="padding: 80px 20px; max-width: 28rem;">
        <fd-button id=${triggerId} aria-haspopup="menu">
          Menu item contract
          <fd-icon slot="icon-end" name="caret-down"></fd-icon>
        </fd-button>
        <fd-menu id=${menuId} anchor=${triggerId} label="Menu item contract example">
          <fd-menu-item>
            <fd-icon slot="icon-start" name="download"></fd-icon>
            Save as draft
          </fd-menu-item>
          <fd-menu-item disabled>Publish filing</fd-menu-item>
          <fd-menu-item variant="destructive">Delete draft</fd-menu-item>
        </fd-menu>
      </div>
    `;
  },
  parameters: {
    docs: {
      description: {
        story:
          "Embedded coverage for `fd-menu-item`: default, disabled, icon-start, and destructive usage all belong inside a real `fd-menu` parent context.",
      },
    },
  },
};

MenuItemContract.play = async ({ canvasElement, userEvent }) => {
  const { trigger, menu, items } = getMenuElements(canvasElement);
  const selections: number[] = [];

  items[0]?.addEventListener("fd-menu-item-select", () => {
    selections.push(1);
  });

  await waitForMenuWiring();

  await userEvent.click(trigger!);

  await waitFor(() => {
    expect(menu?.hasAttribute("open")).toBe(true);
  });

  await userEvent.click(getButtonBase(items[0]));

  await waitFor(() => {
    expect(selections).toEqual([1]);
  });
};

export const WithIcons: Story = {
  render: () => {
    const triggerId = "trigger-icons";
    const menuId = "menu-icons";
    setTimeout(() => wireMenu(triggerId, menuId), 0);

    return html`
      <div style="padding: 80px 20px;">
        <fd-button id=${triggerId} aria-haspopup="menu">
          Document
          <fd-icon slot="icon-end" name="caret-down"></fd-icon>
        </fd-button>
        <fd-menu id=${menuId} anchor=${triggerId} label="Document actions">
          <fd-menu-item>
            <fd-icon slot="icon-start" name="pencil"></fd-icon>
            Edit
          </fd-menu-item>
          <fd-menu-item>
            <fd-icon slot="icon-start" name="download"></fd-icon>
            Download
          </fd-menu-item>
          <fd-menu-item>
            <fd-icon slot="icon-start" name="eye"></fd-icon>
            Preview
          </fd-menu-item>
          <fd-menu-item variant="destructive">
            <fd-icon slot="icon-start" name="trash"></fd-icon>
            Delete
          </fd-menu-item>
        </fd-menu>
      </div>
    `;
  },
};

export const LongMenu: Story = {
  render: () => {
    const triggerId = "trigger-long";
    const menuId = "menu-long";
    setTimeout(() => wireMenu(triggerId, menuId), 0);

    return html`
      <div style="padding: 80px 20px;">
        <fd-button id=${triggerId} aria-haspopup="menu">
          Select institution
          <fd-icon slot="icon-end" name="caret-down"></fd-icon>
        </fd-button>
        <fd-menu id=${menuId} anchor=${triggerId} label="Select institution">
          <fd-menu-item>First National Bank</fd-menu-item>
          <fd-menu-item>Citizens Trust</fd-menu-item>
          <fd-menu-item>Heritage Savings Bank</fd-menu-item>
          <fd-menu-item>Community Federal Credit Union</fd-menu-item>
          <fd-menu-item>Pacific Coast Bank</fd-menu-item>
          <fd-menu-item>Heartland Financial</fd-menu-item>
          <fd-menu-item>Independence Bank</fd-menu-item>
          <fd-menu-item>Valley National Corporation</fd-menu-item>
          <fd-menu-item>Cornerstone Banking Group</fd-menu-item>
          <fd-menu-item>Founders Trust Company</fd-menu-item>
          <fd-menu-item>Summit Federal Bank</fd-menu-item>
          <fd-menu-item>Liberty National Holdings</fd-menu-item>
        </fd-menu>
      </div>
    `;
  },
};

export const DocsOverview: Story = {
  render: () => {
    const configs = [
      {
        triggerId: "overview-trigger-default",
        menuId: "overview-menu-default",
        label: "Filing actions",
        caption: "Default action set",
        items: html`
          <fd-menu-item>Save as draft</fd-menu-item>
          <fd-menu-item>Save & submit</fd-menu-item>
          <fd-menu-item>Export as PDF</fd-menu-item>
        `
      },
      {
        triggerId: "overview-trigger-icons",
        menuId: "overview-menu-icons",
        label: "Document actions",
        caption: "Icons reinforce recognition",
        items: html`
          <fd-menu-item>
            <fd-icon slot="icon-start" name="pencil"></fd-icon>
            Edit
          </fd-menu-item>
          <fd-menu-item>
            <fd-icon slot="icon-start" name="download"></fd-icon>
            Download
          </fd-menu-item>
          <fd-menu-item>
            <fd-icon slot="icon-start" name="eye"></fd-icon>
            Preview
          </fd-menu-item>
        `
      },
      {
        triggerId: "overview-trigger-risk",
        menuId: "overview-menu-risk",
        label: "Account actions",
        caption: "Destructive action last",
        items: html`
          <fd-menu-item>Edit profile</fd-menu-item>
          <fd-menu-item>Change password</fd-menu-item>
          <fd-menu-item variant="destructive">Delete account</fd-menu-item>
        `
      },
      {
        triggerId: "overview-trigger-disabled",
        menuId: "overview-menu-disabled",
        label: "Publish options",
        caption: "Unavailable actions stay discoverable",
        items: html`
          <fd-menu-item>Save as draft</fd-menu-item>
          <fd-menu-item disabled>Submit for review</fd-menu-item>
          <fd-menu-item disabled>Publish</fd-menu-item>
          <fd-menu-item variant="destructive">Discard filing</fd-menu-item>
        `
      }
    ];

    setTimeout(() => {
      for (const config of configs) {
        wireMenu(config.triggerId, config.menuId);
      }
    }, 0);

    return html`
      <div
        style=${`${DOCS_OVERVIEW_GRID_STYLE} padding: 6rem 1.25rem 11.25rem;`}
      >
        ${configs.map(
          (config) => html`
            <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
              <div style="display: grid; gap: var(--fdic-spacing-xs, 0.375rem);">
                <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>${config.caption}</strong>
                <span class=${DOCS_OVERVIEW_META_CLASS}
                  >Open the menu to inspect the item arrangement.</span
                >
              </div>
              <div style="position: relative; min-height: 120px;">
                <fd-button id=${config.triggerId} aria-haspopup="menu">
                  ${config.label}
                  <fd-icon slot="icon-end" name="caret-down"></fd-icon>
                </fd-button>
                <fd-menu id=${config.menuId} anchor=${config.triggerId} label=${config.label}>
                  ${config.items}
                </fd-menu>
              </div>
            </section>
          `
        )}
      </div>
    `;
  }
};
