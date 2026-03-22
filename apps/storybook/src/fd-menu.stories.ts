import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "@fdic-ds/components";

const meta = {
  title: "Components/Menu",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

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
