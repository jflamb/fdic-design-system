import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import "@fdic-ds/components/register-all";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";

function wireDrawer(triggerId: string, drawerId: string, statusId: string) {
  requestAnimationFrame(() => {
    const trigger = document.getElementById(triggerId) as HTMLButtonElement | null;
    const drawer = document.getElementById(drawerId) as (HTMLElement & { open: boolean }) | null;
    const status = document.getElementById(statusId);
    const closeButton = document.getElementById(`${drawerId}-close`) as HTMLButtonElement | null;

    if (!trigger || !drawer || !status) {
      return;
    }

    if (trigger.dataset.drawerReady === "true") {
      return;
    }

    const setState = (open: boolean, source?: string) => {
      drawer.open = open;
      trigger.setAttribute("aria-expanded", String(open));
      status.textContent = open
        ? "Drawer open"
        : source
          ? `Drawer closed from ${source}`
          : "Drawer closed";
    };

    trigger.addEventListener("click", () => setState(true));
    closeButton?.addEventListener("click", () => {
      setState(false, "button");
      trigger.focus();
    });
    drawer.addEventListener("fd-drawer-close-request", (event: Event) => {
      const source = (event as CustomEvent<{ source: string }>).detail.source;
      setState(false, source);
      trigger.focus();
    });

    trigger.dataset.drawerReady = "true";
  });
}

const meta = {
  title: "Supporting Primitives/Drawer",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    layout: "fullscreen",
  },
  argTypes: {
    ...getComponentArgTypes("fd-drawer"),
  },
  args: {
    ...getComponentArgs("fd-drawer"),
    open: false,
    modal: true,
    label: "Main menu",
  },
  render: (args) => {
    const triggerId = "drawer-trigger";
    const drawerId = "drawer-reference";
    const statusId = "drawer-status";
    setTimeout(() => wireDrawer(triggerId, drawerId, statusId), 0);

    return html`
      <div style="min-height: 32rem; padding: 1.5rem; background: linear-gradient(180deg, #003256 0%, #003256 5rem, #eef3f7 5rem, #eef3f7 100%);">
        <button
          id=${triggerId}
          type="button"
          aria-haspopup="dialog"
          aria-expanded="false"
          style="margin-bottom: 1rem; border: 1px solid #0b466f; border-radius: 999px; background: #ffffff; color: #0b466f; font-weight: 700; padding: 0.75rem 1rem;"
        >
          Open navigation drawer
        </button>
        <p id=${statusId} style="margin: 0 0 1rem; color: #13324c; font-weight: 600;">Drawer closed</p>
        <fd-drawer
          id=${drawerId}
          ?open=${args.open}
          ?modal=${args.modal}
          label=${args.label}
        >
        <div
          slot="header"
          style="display:flex; align-items:center; justify-content:space-between; padding:1rem; border-bottom:1px solid rgba(9, 53, 84, 0.08);"
        >
          <button
            id="${drawerId}-close"
            type="button"
            style="border:0; background:transparent; color:#0b466f; font-weight:700; padding:0;"
          >
            Back
          </button>
          <h2 style="margin:0; font-size:1.125rem;">News &amp; Events</h2>
        </div>
        <ul style="list-style:none; margin:0; padding:0.5rem 1rem 1rem; display:grid; gap:0.25rem;">
          <li><a href="#news" style="display:flex; justify-content:space-between; gap:0.75rem; padding:0.875rem; border-radius:0.75rem; color:inherit; text-decoration:none;">News</a></li>
          <li><a href="#events" style="display:flex; justify-content:space-between; gap:0.75rem; padding:0.875rem; border-radius:0.75rem; color:inherit; text-decoration:none;">Events</a></li>
          <li><a href="#podcasts" style="display:flex; justify-content:space-between; gap:0.75rem; padding:0.875rem; border-radius:0.75rem; color:inherit; text-decoration:none;">Podcasts &amp; Media</a></li>
        </ul>
        </fd-drawer>
      </div>
    `;
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReferenceMenuSurface: Story = {};

ReferenceMenuSurface.play = async ({ canvasElement, userEvent }) => {
  const trigger = canvasElement.querySelector("#drawer-trigger") as HTMLButtonElement | null;
  const drawer = canvasElement.querySelector("fd-drawer") as HTMLElement | null;
  const status = canvasElement.querySelector("#drawer-status");

  expect(trigger).not.toBeNull();
  expect(drawer).not.toBeNull();

  await waitFor(() => {
    expect(trigger?.dataset.drawerReady).toBe("true");
  });

  await userEvent.click(trigger!);

  await waitFor(() => {
    expect(drawer?.hasAttribute("open")).toBe(true);
    expect(status?.textContent).toContain("Drawer open");
  });

  const dialog = drawer?.shadowRoot?.querySelector("dialog");
  dialog?.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));

  await waitFor(() => {
    expect(drawer?.hasAttribute("open")).toBe(false);
    expect(status?.textContent).toContain("backdrop");
    expect(trigger).toHaveFocus();
  });
};
