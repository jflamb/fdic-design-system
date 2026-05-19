# Person Content Display Patterns — Design Proposal

**Status:** Draft for review
**Date:** 2026-05-19
**Source issue:** Person content type updates #2944
**Related:** People Component #2990 · Updating Person Contact Details & Adding Profile Picture #2552 · Employee spotlight headshots decorative #3001 · Person avatar low resolution #3179

---

## 1. Summary recommendation

Replace the loose set of six Drupal "Person" view modes with **one reusable `Person` component** that exposes a small, fixed set of named **variants**. Each variant is tied to a content *purpose*, not to an image size or a one-off page. Variants control which properties appear and how the person is linked; editors choose a variant, not a pile of toggles.

Proposed variants:

| Variant | Purpose |
|---|---|
| `byline` | Inline attribution / credit |
| `contact` | Compact directory or contact listing, no image |
| `contact-details` | Standard contact card with avatar and a short blurb |
| `contact-with-image` | Compact contact listing with a small avatar |
| `name-title` | Name + role label with no contact actions |
| `spotlight` | Featured single person (Employee Spotlight, homepage highlight) |
| `profile-card` | Featured person in a grid (leadership, attorney, honors listings) |

Key decisions:

- **One new variant is needed:** `profile-card`. The current "Spotlight" view mode is being stretched to cover grid/listing contexts it was not designed for. Splitting `spotlight` (one hero person) from `profile-card` (many people in a grid) resolves the image-size complaints in #2944, #3001, and #3179 without overloading a single mode.
- **Three image size categories:** *small* (compact listings), *standard* (contact cards), *featured* (spotlight and profile cards). The low-resolution bug (#3179) is fixed by giving featured variants their own, larger image style and source crop — not by enlarging the small avatar.
- **Headshots are decorative by default.** When the person's name is visible text next to the image (true for every variant here), the image carries no unique information and should ship empty `alt=""`. This directly answers #3001.
- **No new *fields* on the Person content type are required** (pending confirmation of the `profileUrl` and `summary` source fields — see §9). The work is view-mode/component consolidation plus new image styles: add `person_featured` and verify or create `person_standard`.

---

## 2. Problem statement

FDICnet renders Person content through Drupal Person nodes, a People paragraph, and six Person view modes. This has three problems:

1. **Image treatment doesn't scale.** The avatar image style was sized for small contact listings. Featured contexts — Employee Spotlight, homepage highlights, leadership listings, attorney/honors listings — reuse that same small style, so headshots display soft and low-resolution when shown large (#3179, #2944).
2. **View modes overlap and aren't governed.** "Contact", "Contact Details", and "Contact with Image" differ only by a couple of fields. Editors can't easily tell which to pick, and "Spotlight" is being reused for grid listings it wasn't designed for.
3. **Accessibility is inconsistent.** Headshots are sometimes given descriptive alt text, sometimes empty, sometimes the file name. When the name is already visible, descriptive alt text is redundant noise for screen-reader users (#3001).

The fix is a normalized component model with a fixed variant set, purpose-based naming, image treatment defined per variant, and explicit editorial and accessibility guidance.

---

## 3. Design principles

1. **Name variants by purpose, not by appearance.** `spotlight` and `profile-card`, never `large-image-person`. A future redesign can change the size without making the name a lie.
2. **Controlled flexibility, not freeform.** A variant fixes which properties show and how the person links. Editors pick a variant; they do not assemble arbitrary field combinations.
3. **Text first, image optional.** Name, title, organization, and contact methods are always real text. No layout depends on an image being present to be understood.
4. **The image is decorative when the name is visible.** Default to `alt=""`. Reserve descriptive alt text for the rare case where the image is the only linked target or conveys unique information.
5. **One source of truth.** All variants render from the same Person component and the same node fields. Variants differ only in projection (which fields, which link, which size).
6. **Responsive and reflow-safe.** Every variant must survive 400% zoom and a 320px viewport with content stacking, not clipping.

---

## 4. Person use-case matrix

| Use case | Recommended variant | Current view mode | Fields shown | Link behavior | Image treatment | Accessibility notes | Editorial guidance | Drupal impact |
|---|---|---|---|---|---|---|---|---|
| Article/credit attribution | `byline` | Byline | Name, organization | Name → email link | Omitted | Email link text is the name; ensure link purpose is clear in context | Use for inline credit lines only | Keep view mode; rename for clarity |
| Directory / contact listing (text only) | `contact` | Contact | Name, job title, organization, email | Email → `mailto:` | Omitted | Email is a real link, not just text | Use for dense lists where images would add clutter | Keep view mode |
| Contact listing with small photo | `contact-with-image` | Contact with Image | Avatar, name, title, organization | Name → email link | **Small** avatar, 1:1, optional | Image decorative (`alt=""`); name carries the link | Use when a face helps recognition but space is tight | Keep view mode |
| Standard contact card with blurb | `contact-details` | Contact Details | Avatar, name, email, details/summary | Email → `mailto:` | **Standard** avatar, 1:1, optional | Image decorative (`alt=""`) | Use for a featured contact with context (e.g., "who to ask") | Keep view mode |
| Name + role label, no contact | `name-title` | Name and Title | Name, title, organization | None | Omitted | Plain text block | Use where contacting the person is not the point (e.g., approver name) | Keep view mode |
| Employee Spotlight (single hero) | `spotlight` | Spotlight | Avatar, name, title, organization, summary | Optional profile link | **Featured** image, 1:1 or 4:5, optional | Image decorative (`alt=""`); summary is real text | Use for ONE highlighted person on a page or homepage | Keep view mode; new featured image style |
| Leadership / attorney / honors listing (grid) | `profile-card` | *(Spotlight, misused)* | Avatar, name, title, organization, optional profile link | Profile link (card or name) | **Featured** image, 1:1, recommended | Image decorative when name visible; card has one clear link target | Use for a GRID of comparable people | **New view mode** + featured image style |

---

## 5. Proposed Person component model

A single `Person` component. Public shape:

```
Person
├── variant: byline | contact | contact-with-image | contact-details
│            | name-title | spotlight | profile-card   (required)
├── name                     (required, all variants)
├── title                    (optional)
├── organization             (optional — division / office)
├── email                    (optional)
├── phone                    (optional)
├── location                 (optional)
├── profileUrl               (optional)
├── image { src, srcSet }    (optional)
├── imageAlt                 (optional — default "" / decorative)
└── summary                  (optional — details / body text)
```

**The variant decides projection.** Each variant defines:

- which optional properties are *rendered* (others are ignored even if populated),
- the **link behavior** (email link, profile link, or none),
- the **image size category** (omitted / small / standard / featured) and crop,
- the **display density** (compact / standard / featured).

This is the "controlled flexibility" requirement: editors cannot produce an arbitrary combination. If a variant doesn't render `phone`, populating `phone` on the node has no effect in that variant.

### Density tiers

| Density | Variants | Intent |
|---|---|---|
| Compact | `byline`, `contact`, `contact-with-image`, `name-title` | Lists, directories, inline use; minimal vertical space |
| Standard | `contact-details` | Single card with supporting text |
| Featured | `spotlight`, `profile-card` | Deliberate emphasis; larger image, more whitespace |

---

## 6. Variant details

### `byline`
- **Shows:** name, organization.
- **Link:** name renders as a `mailto:` link.
- **Image:** omitted.
- **Layout:** single inline line; wraps gracefully.
- **Use when:** crediting a person inline (e.g., "Posted by …").

### `contact`
- **Shows:** name, job title, organization, email.
- **Link:** email as a `mailto:` link; name is plain text.
- **Image:** omitted.
- **Choose this when:** building a dense, scannable directory or contact list — many people, no photos.
- **Do not use when:** a photo would help recognition (use `contact-with-image`) or the person needs a sentence of context (use `contact-details`).

### `contact-with-image`
- **Shows:** small avatar, name, title, organization.
- **Link:** name renders as a `mailto:` link.
- **Image:** **small** (≈48–64px), 1:1, optional. Layout must hold without it.
- **Accessibility:** image decorative, `alt=""` — the name is right there.
- **Choose this when:** a face aids recognition in a list but each row must stay compact.
- **Do not use when:** the list is long and photos slow scanning (use `contact`), or the person is being *featured* rather than listed (use `spotlight`/`profile-card`).

### `contact-details`
- **Shows:** standard avatar, name, email, summary/details.
- **Link:** email as `mailto:`.
- **Image:** **standard** (≈96–120px), 1:1, optional.
- **Accessibility:** image decorative, `alt=""`.
- **Choose this when:** ONE contact needs explanatory context — e.g., "who to ask about X" with a sentence.
- **Do not use when:** showing several people side by side (use `contact`/`contact-with-image`) or deliberately spotlighting someone (use `spotlight`).

### `name-title`
- **Shows:** name, title, organization.
- **Link:** none.
- **Image:** omitted.
- **Use when:** the person is referenced but not meant to be contacted (e.g., an approver or owner label).

### `spotlight`
- **Shows:** featured image, name, title, organization, summary.
- **Link:** optional profile link (e.g., "Read more").
- **Image:** **featured** (≈200–280px), 1:1 or 4:5, optional. Source crop and image style must be high enough resolution for retina display — this is the direct fix for #3179.
- **Accessibility:** image decorative, `alt=""`; summary must be real text, never baked into the image.
- **Use when:** highlighting **one** person — Employee Spotlight, a homepage feature.

### `profile-card`
- **Shows:** featured image, name, title, organization, optional profile link.
- **Link:** the whole card OR the name links to the profile (`profileUrl`). Pick one target per implementation — do not nest two links.
- **Image:** **featured** (≈160–220px), 1:1, recommended (grids look broken with missing tiles — supply a neutral placeholder rather than collapsing the cell).
- **Accessibility:** image decorative when the name is visible. If the card is a single link wrapping image + name, the accessible name comes from the text — keep `alt=""` so the link isn't announced twice.
- **Use when:** showing a **grid of comparable people** — leadership, attorneys, honors/award listings.

---

## 7. Image style recommendations

Three image size categories, mapped to Drupal image styles:

| Category | Used by | Approx. rendered size | Crop / aspect | Source minimum (2x) | Required? |
|---|---|---|---|---|---|
| Omitted | `byline`, `contact`, `name-title` | — | — | — | No image |
| Small | `contact-with-image` | 48–64px | 1:1, face-centered | 128px | Optional |
| Standard | `contact-details` | 96–120px | 1:1, face-centered | 240px | Optional |
| Featured | `spotlight`, `profile-card` | 160–280px | 1:1 (grids) or 4:5 (single hero) | 560px | Optional / recommended |

### Concrete Drupal image style outputs

So Engineering can build and QA against fixed numbers (and so #3179 cannot recur):

| Image style | Output dimensions | Crop | Used by |
|---|---|---|---|
| `person_small` (existing) | 128×128 | 1:1, focal point | `contact-with-image` |
| `person_standard` (verify / create) | 240×240 | 1:1, focal point | `contact-details` |
| `person_featured` (**new**) | 560×560 | 1:1, focal point | `profile-card`; `spotlight` (square) |
| `person_featured_portrait` (**new, if 4:5 chosen**) | 560×700 | 4:5, focal point | `spotlight` (portrait) |

Outputs are deliberately ~2× the largest rendered size so high-density displays stay crisp. Build `person_featured_portrait` only if the spotlight portrait aspect is chosen (see §10 / Decisions needed).

Recommendations:

- **Use responsive images.** Featured variants should emit `srcset`/`sizes` (via Drupal responsive image styles) so small viewports don't download the 560px source. A single fixed image style at the rendered size will reintroduce soft images on retina screens — this is the actual fix for #3179, not just a bigger style.
- **Crop with a face-aware focal point.** Editors set a focal point on upload; all square crops derive from it.
- **Define a missing-image fallback.** `profile-card` grids should show a neutral monogram/placeholder tile so rows don't collapse. Single-person variants may simply omit the image and reflow.
- **Never embed text in the headshot.** Name, title, and summary are always live text.

---

## 8. Accessibility guidance

- **Default headshots to decorative (`alt=""`).** In every variant here, the person's name appears as visible text adjacent to the image. The image therefore adds no unique information and should be marked decorative so screen readers skip it (#3001).
- **When alt text *is* needed:** if the image is the *only* content inside a link, give it alt text that names the person or the link destination — not their appearance — because that alt text becomes the link's accessible name. It also needs alt text if it conveys unique information beyond identity (rare here). If a `profile-card` link wraps image + visible name, the name already supplies the accessible name — keep `alt=""` to avoid a doubled announcement.
- **Text is the source of truth.** Name, title, organization, email, and phone are always real, selectable text and real links — never image-only and never CSS-generated content.
- **Don't depend on the image for meaning.** Every variant must be fully understandable with the image absent or failed to load.
- **Link semantics:** email links are `mailto:`; profile links go to a real URL. Per card, expose exactly one link target — do not nest a name link inside a card link.
- **Responsive / zoom / reflow:** all variants must pass WCAG 1.4.10 reflow at 320px and remain usable at 400% zoom. Featured variants stack image-above-text on narrow viewports. Touch targets for links meet the 24×24px minimum.
- **Headings:** `spotlight` and `profile-card` names may be headings — choose a level that fits the page outline; do not skip levels.

This aligns with the repo accessibility standard (ADR-004).

---

## 9. Drupal / view mode mapping

| Current view mode | Proposed variant | Action |
|---|---|---|
| Byline | `byline` | Keep — rename/relabel for clarity |
| Contact | `contact` | Keep |
| Contact Details | `contact-details` | Keep |
| Contact with Image | `contact-with-image` | Keep |
| Name and Title | `name-title` | Keep |
| Spotlight | `spotlight` | Keep — but **scope to single-person use only** |
| *(none — currently Spotlight misused)* | `profile-card` | **New view mode required** |

**New Drupal view modes needed:** **one** — `profile-card`, for grid listings (leadership, attorneys, honors). Today these reuse "Spotlight," which is the root of the sizing complaints.

**No new content-type fields needed — pending two confirmations.** Existing Person node fields (name, title, organization, email, phone, location, image, body/summary) are expected to cover all variants. Two source-field assumptions must be verified before this claim is final:

- **`profileUrl`** — the proposal assumes this resolves to the Person node's own canonical URL (a derived route), not a separate link field. If `spotlight`/`profile-card` need to link somewhere *other* than the node page, an existing link field must be identified or a new field added.
- **`summary`** — the proposal assumes `spotlight` and `contact-details` draw their blurb from the *same* existing field that "Contact Details" currently renders as "details" (body/summary). If Spotlight needs a distinct summary field, that is a content-modeling change, not just a display change.

If either assumption fails, this becomes a field/content-modeling task. Engineering should confirm both against the current Person content type before estimating.

Work is:

1. Add `profile-card` view mode.
2. Add `person_featured` image style (and verify or create `person_standard`); point `spotlight` and `profile-card` at the featured style; configure responsive image styles (see §7).
3. Set decorative/empty `alt` handling on the Person image field for all view modes.
4. Update the People paragraph so editors select a variant explicitly.

---

## 10. Open questions

### Decisions needed before Engineering starts

These block image-style creation, component markup, and QA — they cannot wait until after build begins.

1. **`spotlight` aspect ratio:** square (1:1) or portrait (4:5)? *Recommendation:* portrait (4:5) for a more editorial single-hero treatment; square everywhere else. This decision determines whether `person_featured_portrait` is built (§7).
2. **`profile-card` link target:** whole-card link vs. name-only link. *Recommendation:* name-only link — it produces one clean, unambiguous link target with the visible name as its accessible name, avoiding fragile whole-card link markup. Revisit only if usability testing shows the larger target is needed.
3. **Missing-image policy for `profile-card`:** monogram placeholder, initials, or neutral silhouette. *Recommendation:* initials monogram on a neutral tile — recognizable, no per-person asset work, and keeps grid rows intact.

### Lower-risk open questions

4. **Source-field confirmation:** verify `profileUrl` and `summary` resolve to existing fields (see §9). If not, scope expands to content modeling.
5. **Phone & location:** no current variant surfaces them. Is there a real use case (e.g., regional office contacts), or should they be dropped from scope?
6. **Homepage highlight:** is it `spotlight`, or a distinct future variant? Treated as `spotlight` here unless Design says otherwise.
7. **Attorney/honors listings:** confirmed as `profile-card` grids? Assumed yes per #2944.

---

## 11. Recommended acceptance criteria

- [ ] All six current view modes are mapped to a proposed variant (§9); none left unmapped.
- [ ] `spotlight` is explicitly scoped to single-person use; grid listings move to `profile-card`.
- [ ] Featured contexts — Employee Spotlight, homepage highlight, leadership, attorney/honors — each map to a named variant.
- [ ] Image treatment is defined for compact (small), standard, and featured categories, including approximate size, crop/aspect, and required/optional/omitted status (§7).
- [ ] Proposal states that **one** new Drupal view mode (`profile-card`) is needed and **no** new content-type fields are needed (§9).
- [ ] Decorative-headshot guidance is included: default `alt=""` when the name is visible, with the narrow exceptions named (§8).
- [ ] Each variant's rendered fields and link behavior are specified (§6).
- [ ] No variant is named after image size; all names are purpose-based.
- [ ] All variants pass reflow at 320px and 400% zoom.
- [ ] Editorial guidance lets a content editor choose a variant without design input (§4, §6).
- [ ] Detail is sufficient for Design to review and Engineering to estimate (view modes, image styles, component variants enumerated).
