import { beforeEach, describe, expect, it } from "vitest";
import "../register/fd-person.js";
import { expectNoAxeViolations } from "./test-a11y.js";
import { clearTestDom, createTestElement, queryShadow } from "./test-utils.js";

async function createPerson() {
  return createTestElement<
    HTMLElement & {
      updateComplete: Promise<void>;
      variant: string;
      name: string;
      title: string;
      organization: string;
      email?: string;
      phone?: string;
      location?: string;
      profileUrl?: string;
      profileLabel: string;
      target?: string;
      rel?: string;
      imageSrc?: string;
      imageSrcset?: string;
      imageAlt: string;
      summary: string;
    }
  >("fd-person");
}

describe("FdPerson", () => {
  beforeEach(() => {
    clearTestDom();
  });

  it("registers fd-person", () => {
    expect(customElements.get("fd-person")).toBeDefined();
  });

  it("renders the contact variant as text with an email link and no image", async () => {
    const el = await createPerson();
    el.name = "Jordan Pierce";
    el.title = "Program Analyst";
    el.organization = "Division of Administration";
    el.email = "jordan.pierce@example.gov";
    el.imageSrc = "/people/jordan.jpg";
    await el.updateComplete;

    const article = queryShadow<HTMLElement>(el, "article");
    const image = queryShadow(el, "[part=image]");
    const name = queryShadow(el, "[part=name]");
    const email = queryShadow<HTMLAnchorElement>(el, "[part=email-link]");

    expect(article?.getAttribute("part")).toContain("contact");
    expect(article?.getAttribute("data-density")).toBe("compact");
    expect(image).toBeNull();
    expect(name?.textContent?.trim()).toBe("Jordan Pierce");
    expect(email?.getAttribute("href")).toBe(
      "mailto:jordan.pierce@example.gov",
    );
    expect(el.shadowRoot?.textContent).toContain("Program Analyst");
    expect(el.shadowRoot?.textContent).toContain("Division of Administration");
  });

  it("uses the byline projection and ignores title, phone, location, and profile data", async () => {
    const el = await createPerson();
    el.variant = "byline";
    el.name = "Avery Chen";
    el.title = "Deputy Director";
    el.organization = "Legal Division";
    el.email = "avery.chen@example.gov";
    el.phone = "555-555-0101";
    el.location = "Washington, DC";
    el.profileUrl = "/people/avery-chen";
    await el.updateComplete;

    const links = el.shadowRoot?.querySelectorAll("a") ?? [];

    expect(links).toHaveLength(1);
    expect(links[0]?.getAttribute("href")).toBe(
      "mailto:avery.chen@example.gov",
    );
    expect(el.shadowRoot?.textContent).toContain("Avery Chen");
    expect(el.shadowRoot?.textContent).toContain("Legal Division");
    expect(el.shadowRoot?.textContent).not.toContain("Deputy Director");
    expect(el.shadowRoot?.textContent).not.toContain("555-555-0101");
    expect(el.shadowRoot?.textContent).not.toContain("Washington");
  });

  it("renders contact-with-image with a decorative avatar and name email link", async () => {
    const el = await createPerson();
    el.variant = "contact-with-image";
    el.name = "Robin Kim";
    el.title = "Benefits Specialist";
    el.organization = "Human Resources";
    el.email = "robin.kim@example.gov";
    el.imageSrc = "/people/robin.jpg";
    el.imageAlt = "Robin Kim headshot";
    await el.updateComplete;

    const image = queryShadow<HTMLImageElement>(el, "[part=image]");
    const nameLink = queryShadow<HTMLAnchorElement>(el, "[part~='email-link']");

    expect(image?.getAttribute("src")).toBe("/people/robin.jpg");
    expect(image?.getAttribute("alt")).toBe("");
    expect(nameLink?.textContent?.trim()).toBe("Robin Kim");
    expect(nameLink?.getAttribute("href")).toBe("mailto:robin.kim@example.gov");
  });

  it("renders contact-details with standard image, email, and summary only", async () => {
    const el = await createPerson();
    el.variant = "contact-details";
    el.name = "Sam Taylor";
    el.title = "Ignored title";
    el.organization = "Ignored office";
    el.email = "sam.taylor@example.gov";
    el.summary = "Ask Sam about workplace services requests.";
    el.imageSrc = "/people/sam.jpg";
    await el.updateComplete;

    expect(queryShadow(el, "[part=image]")).not.toBeNull();
    expect(queryShadow(el, "[part=email-link]")?.textContent).toContain(
      "sam.taylor@example.gov",
    );
    expect(queryShadow(el, "[part=summary]")?.textContent).toContain(
      "Ask Sam about workplace services requests.",
    );
    expect(el.shadowRoot?.textContent).not.toContain("Ignored title");
    expect(el.shadowRoot?.textContent).not.toContain("Ignored office");
  });

  it("renders the name-title variant as text with no image or links", async () => {
    const el = await createPerson();
    el.variant = "name-title";
    el.name = "Dana Brooks";
    el.title = "Records Officer";
    el.organization = "Office of the Inspector General";
    el.email = "dana.brooks@example.gov";
    el.profileUrl = "/people/dana-brooks";
    el.imageSrc = "/people/dana.jpg";
    await el.updateComplete;

    const links = el.shadowRoot?.querySelectorAll("a") ?? [];

    expect(queryShadow(el, "[part=name]")?.textContent?.trim()).toBe(
      "Dana Brooks",
    );
    expect(el.shadowRoot?.textContent).toContain("Records Officer");
    expect(el.shadowRoot?.textContent).toContain(
      "Office of the Inspector General",
    );
    expect(links).toHaveLength(0);
    expect(queryShadow(el, "[part=image]")).toBeNull();
  });

  it("scopes spotlight to a single featured person with one optional profile CTA", async () => {
    const el = await createPerson();
    el.variant = "spotlight";
    el.name = "Morgan Lee";
    el.title = "Employee Spotlight";
    el.organization = "Office of Communications";
    el.summary = "Morgan improved the intranet publishing workflow.";
    el.profileUrl = "/people/morgan-lee";
    el.profileLabel = "Read Morgan's profile";
    el.imageSrc = "/people/morgan.jpg";
    el.imageSrcset = "/people/morgan.jpg 1x, /people/morgan@2x.jpg 2x";
    await el.updateComplete;

    const article = queryShadow<HTMLElement>(el, "article");
    const image = queryShadow<HTMLImageElement>(el, "[part=image]");
    const links = el.shadowRoot?.querySelectorAll("a") ?? [];

    expect(article?.getAttribute("data-density")).toBe("featured");
    expect(image?.getAttribute("alt")).toBe("");
    expect(image?.getAttribute("srcset")).toContain("2x");
    expect(links).toHaveLength(1);
    expect(links[0]?.getAttribute("href")).toBe("/people/morgan-lee");
    expect(links[0]?.textContent?.trim()).toBe("Read Morgan's profile");
  });

  it("renders profile-card as a grid card with name-only profile link and placeholder fallback", async () => {
    const el = await createPerson();
    el.variant = "profile-card";
    el.name = "Lin Wei";
    el.title = "Honors Attorney";
    el.organization = "Legal Division";
    el.profileUrl = "/people/lin-wei";
    await el.updateComplete;

    const placeholder = queryShadow(el, "[part=placeholder]");
    const links = el.shadowRoot?.querySelectorAll("a") ?? [];

    expect(placeholder).not.toBeNull();
    expect(placeholder?.querySelector("svg")).not.toBeNull();
    expect(placeholder?.closest("[part=image-frame]")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
    expect(links).toHaveLength(1);
    expect(links[0]?.textContent?.trim()).toBe("Lin Wei");
    expect(links[0]?.querySelector("[part=image-frame]")).toBeNull();
  });

  it("falls back to contact for unsupported variants", async () => {
    const el = await createPerson();
    el.variant = "large-image-person";
    el.name = "Unsupported Variant";
    el.email = "unsupported@example.gov";
    await el.updateComplete;

    const article = queryShadow<HTMLElement>(el, "article");

    expect(article?.getAttribute("part")).toContain("contact");
    expect(queryShadow(el, "[part=email-link]")).not.toBeNull();
  });

  it("has no automated accessibility violations in the featured profile-card variant", async () => {
    const el = await createPerson();
    el.variant = "profile-card";
    el.name = "Jordan Pierce";
    el.title = "Regional Director";
    el.organization = "Division of Risk Management Supervision";
    el.profileUrl = "/people/jordan-pierce";
    el.imageSrc = "/people/jordan.jpg";
    await el.updateComplete;

    await expectNoAxeViolations(el);
  });
});
