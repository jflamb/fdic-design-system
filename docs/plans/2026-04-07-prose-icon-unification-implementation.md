# Prose Icon Unification — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace 16 inline SVG data URIs in prose.css with build-time generated mask-image CSS variables sourced from the Phosphor icon registry, eliminating per-color duplication and making dark mode automatic via tokens.

**Architecture:** A shared plain JS icon data module (`phosphor-data.mjs`) is the single source of truth for SVG shapes. Both the runtime icon registry (`phosphor-regular.ts`) and a build-time generator script (`generate-icon-masks.mjs`) import from it. The generator outputs `icon-masks.css` with mask-image custom properties. Prose CSS consumes these masks and controls color via `background-color` driven by design system tokens.

**Tech Stack:** Plain JS (`.mjs` generator script), Vanilla CSS (mask-image + custom properties), Vitest (component tests).

**Design doc:** `docs/plans/2026-04-07-prose-icon-unification-design.md`

---

### Task 1: Create shared icon data module

**Files:**
- Create: `packages/components/src/icons/phosphor-data.mjs`
- Modify: `packages/components/src/icons/phosphor-regular.ts`
- Test: `packages/components/src/icons/phosphor-regular.test.ts`

This task extracts the icon SVG map into a shared `.mjs` module that both the TS registry and the generator can import without build steps.

**Step 1: Create phosphor-data.mjs**

Create `packages/components/src/icons/phosphor-data.mjs` with all existing icons from `phosphor-regular.ts` plus the two new icons (`lightbulb` and `check-circle`). Every icon uses `viewBox="0 0 256 256"` and `fill="currentColor"`.

```js
/**
 * Shared Phosphor Regular icon SVG data.
 *
 * This plain JS module is the single source of truth for icon shapes.
 * Consumers:
 * - phosphor-regular.ts (runtime icon registry)
 * - scripts/icons/generate-icon-masks.mjs (build-time CSS mask generator)
 *
 * SVG path data sourced from the official Phosphor Icons repository:
 * https://github.com/phosphor-icons/core (regular weight)
 */

export const phosphorRegularIcons = {
  star: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z"/></svg>',

  "caret-down":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/></svg>',

  "caret-up":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M213.66,165.66a8,8,0,0,1-11.32,0L128,91.31,53.66,165.66a8,8,0,0,1-11.32-11.32l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,213.66,165.66Z"/></svg>',

  "caret-right":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/></svg>',

  "caret-left":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"/></svg>',

  "squares-four":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M104 48v56H48V48h56Zm104 0v56h-56V48h56ZM104 152v56H48v-56h56Zm104 0v56h-56v-56h56ZM48 32a16 16 0 0 0-16 16v56a16 16 0 0 0 16 16h56a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16H48Zm104 0a16 16 0 0 0-16 16v56a16 16 0 0 0 16 16h56a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16h-56ZM48 136a16 16 0 0 0-16 16v56a16 16 0 0 0 16 16h56a16 16 0 0 0 16-16v-56a16 16 0 0 0-16-16H48Zm104 0a16 16 0 0 0-16 16v56a16 16 0 0 0 16 16h56a16 16 0 0 0 16-16v-56a16 16 0 0 0-16-16h-56Z"/></svg>',

  "user-circle":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"/></svg>',

  list:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M40,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H48A8,8,0,0,1,40,64Zm176,56H48a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H48a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"/></svg>',

  plus: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/></svg>',

  minus:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"/></svg>',

  x: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg>',

  check:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></svg>',

  "check-circle":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"/></svg>',

  info: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"/></svg>',

  lightbulb:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16,16,0,0,0-6.23-12.66A87.59,87.59,0,0,1,40,104.49C39.74,56.83,78.26,17.14,125.88,16A88,88,0,0,1,216,104Zm-16,0a72,72,0,0,0-73.74-72c-39,.92-70.47,33.39-70.26,72.39a71.65,71.65,0,0,0,27.64,56.3A32,32,0,0,1,96,186v6h64v-6a32.15,32.15,0,0,1,12.47-25.35A71.65,71.65,0,0,0,200,104Zm-16.11-9.34a57.6,57.6,0,0,0-46.56-46.55,8,8,0,0,0-2.66,15.78c16.57,2.79,30.63,16.85,33.44,33.45A8,8,0,0,0,176,104a9,9,0,0,0,1.35-.11A8,8,0,0,0,183.89,94.66Z"/></svg>',

  warning:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"/></svg>',

  "warning-circle":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,112V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"/></svg>',

  "warning-octagon":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M120,136V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0ZM232,91.55v72.9a15.86,15.86,0,0,1-4.69,11.31l-51.55,51.55A15.86,15.86,0,0,1,164.45,232H91.55a15.86,15.86,0,0,1-11.31-4.69L28.69,175.76A15.86,15.86,0,0,1,24,164.45V91.55a15.86,15.86,0,0,1,4.69-11.31L80.24,28.69A15.86,15.86,0,0,1,91.55,24h72.9a15.86,15.86,0,0,1,11.31,4.69l51.55,51.55A15.86,15.86,0,0,1,232,91.55Zm-16,0L164.45,40H91.55L40,91.55v72.9L91.55,216h72.9L216,164.45ZM128,160a12,12,0,1,0,12,12A12,12,0,0,0,128,160Z"/></svg>',

  "arrow-square-out":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z"/></svg>',

  download:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M240,136v64a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V136a16,16,0,0,1,16-16H72a8,8,0,0,1,0,16H32v64H224V136H184a8,8,0,0,1,0-16h40A16,16,0,0,1,240,136Zm-117.66-2.34a8,8,0,0,0,11.32,0l48-48a8,8,0,0,0-11.32-11.32L136,108.69V24a8,8,0,0,0-16,0v84.69L85.66,74.34A8,8,0,0,0,74.34,85.66ZM200,168a12,12,0,1,0-12,12A12,12,0,0,0,200,168Z"/></svg>',

  upload:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M240,136v64a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V136a16,16,0,0,1,16-16H80a8,8,0,0,1,0,16H32v64H224V136H176a8,8,0,0,1,0-16h48A16,16,0,0,1,240,136ZM85.66,77.66,120,43.31V128a8,8,0,0,0,16,0V43.31l34.34,34.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,77.66ZM200,168a12,12,0,1,0-12,12A12,12,0,0,0,200,168Z"/></svg>',

  trash:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/></svg>',

  pencil:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM51.31,160,136,75.31,152.69,92,68,176.68ZM48,179.31,76.69,208H48Zm48,25.38L79.31,188,164,103.31,180.69,120Zm96-96L147.31,64l24-24L216,84.68Z"/></svg>',

  eye: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"/></svg>',

  "eye-slash":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z"/></svg>',

  "magnifying-glass":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/></svg>',

  square:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208Z"/></svg>',

  "check-square":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM208,208V48H48V208H208Z"/></svg>',

  "minus-square":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM168,136H88a8,8,0,0,1,0-16h80a8,8,0,0,1,0,16Z"/></svg>',

  "spinner-gap":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm88,88H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z"/></svg>',

  "share-fat":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M237.66,106.35l-80-80A8,8,0,0,0,144,32V72.35c-25.94,2.22-54.59,14.92-78.16,34.91-28.38,24.08-46.05,55.11-49.76,87.37a12,12,0,0,0,20.68,9.58h0c11-11.71,50.14-48.74,107.24-52V192a8,8,0,0,0,13.66,5.65l80-80A8,8,0,0,0,237.66,106.35ZM160,172.69V144a8,8,0,0,0-8-8c-28.08,0-55.43,7.33-81.29,21.8a196.17,196.17,0,0,0-36.57,26.52c5.8-23.84,20.42-46.51,42.05-64.86C99.41,99.77,127.75,88,152,88a8,8,0,0,0,8-8V51.32L220.69,112Z"/></svg>',
};
```

**Step 2: Update phosphor-regular.ts to import from the shared module**

Replace the inline icon map in `packages/components/src/icons/phosphor-regular.ts`:

```ts
/**
 * Built-in Phosphor Regular icon set.
 *
 * Importing this module auto-registers a curated set of Phosphor Regular icons
 * into the global `iconRegistry`. All icons use `viewBox="0 0 256 256"` and
 * `fill="currentColor"` so they inherit the parent element's text color.
 *
 * SVG path data sourced from the official Phosphor Icons repository:
 * https://github.com/phosphor-icons/core (regular weight)
 *
 * Usage:
 * ```ts
 * import "@fdic-ds/components/icons/phosphor-regular";
 * // All icons are now available via iconRegistry.get("star"), etc.
 * ```
 */
import { iconRegistry } from "./registry.js";
import { phosphorRegularIcons } from "./phosphor-data.mjs";

iconRegistry.register(phosphorRegularIcons);
```

**Step 3: Update the test expected icon list**

In `packages/components/src/icons/phosphor-regular.test.ts`, add `"check-circle"` and `"lightbulb"` to the `expectedIcons` array (keep alphabetical order):

Insert `"check-circle"` after `"check"` (line 14) and `"lightbulb"` after `"list"` (line 20).

The `expect(registered).toHaveLength(expectedIcons.length)` assertion on line 46 will verify the count is correct.

**Step 4: Run tests to verify**

Run: `cd packages/components && npx vitest run src/icons/`

Expected: All tests PASS — the 2 new icons are registered, existing icons unchanged.

**Step 5: Commit**

```bash
git add packages/components/src/icons/phosphor-data.mjs packages/components/src/icons/phosphor-regular.ts packages/components/src/icons/phosphor-regular.test.ts
git commit -m "refactor(icons): extract shared phosphor-data.mjs and add lightbulb, check-circle

Creates a plain JS module as the single source of truth for Phosphor
icon SVG data. Both the runtime registry (phosphor-regular.ts) and
the build-time mask generator (next task) import from it.

Adds lightbulb and check-circle icons needed by prose callouts."
```

---

### Task 2: Create the icon mask generator script

**Files:**
- Create: `scripts/icons/generate-icon-masks.mjs`
- Create: `apps/docs/.vitepress/theme/generated/icon-masks.css`

**Step 1: Create the generator script**

Create `scripts/icons/generate-icon-masks.mjs`:

```js
#!/usr/bin/env node

/**
 * Generate CSS icon masks from the shared Phosphor icon data.
 *
 * Reads SVG strings from phosphor-data.mjs, strips fill="currentColor",
 * URL-encodes to data URIs, and writes CSS custom properties for use
 * as mask-image values in the docs theme.
 *
 * Run: npm run generate:icon-masks
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { phosphorRegularIcons } from "../../packages/components/src/icons/phosphor-data.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

/** Icons consumed by prose.css — subset of the full registry. */
const PROSE_ICONS = [
  "arrow-square-out",
  "caret-down",
  "check-circle",
  "info",
  "lightbulb",
  "warning",
  "warning-octagon",
];

/**
 * Convert an SVG string to a mask-safe data URI.
 * Strips fill="currentColor" so the shape is colorless (mask only),
 * then percent-encodes for use in url().
 */
function toMaskDataUri(svg) {
  const maskSvg = svg.replace(/ fill="currentColor"/, "");
  const encoded = maskSvg
    .replace(/"/g, "'")
    .replace(/#/g, "%23")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    .replace(/\s+/g, " ");
  return `url("data:image/svg+xml,${encoded}")`;
}

const lines = [
  "/*",
  " * Auto-generated icon masks — do not edit manually.",
  " * Source: packages/components/src/icons/phosphor-data.mjs",
  " * Run: npm run generate:icon-masks",
  " */",
  "",
  ":root {",
];

for (const name of PROSE_ICONS) {
  const svg = phosphorRegularIcons[name];
  if (!svg) {
    console.error(`ERROR: Icon "${name}" not found in phosphor-data.mjs`);
    process.exit(1);
  }
  lines.push(`  --fd-icon-mask-${name}: ${toMaskDataUri(svg)};`);
}

lines.push("}", "");

const outDir = path.join(
  repoRoot,
  "apps/docs/.vitepress/theme/generated",
);
fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, "icon-masks.css");
fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`Wrote ${outPath}`);
```

**Step 2: Run the generator**

Run: `node scripts/icons/generate-icon-masks.mjs`

Expected: Creates `apps/docs/.vitepress/theme/generated/icon-masks.css` with 7 `--fd-icon-mask-*` custom properties.

**Step 3: Verify the generated file looks correct**

Read `apps/docs/.vitepress/theme/generated/icon-masks.css` and confirm:
- Header comment mentions `phosphor-data.mjs` and `npm run generate:icon-masks`
- 7 custom properties in `:root`, one per prose icon
- No `fill` attribute in any data URI (mask-safe)
- Valid CSS syntax

**Step 4: Commit**

```bash
git add scripts/icons/generate-icon-masks.mjs apps/docs/.vitepress/theme/generated/icon-masks.css
git commit -m "feat(icons): add build-time icon mask generator

Reads from phosphor-data.mjs, strips fill, URL-encodes to mask-safe
data URIs, and writes icon-masks.css with CSS custom properties.
Prose CSS will consume these masks for color-token-driven icons."
```

---

### Task 3: Update prose.css to use mask-image variables

**Files:**
- Modify: `apps/docs/.vitepress/theme/prose.css`

This is the largest task. It replaces all inline SVG data URIs with mask-image + background-color, and deletes the dark-mode SVG override block.

**Step 1: Import the generated icon masks CSS**

At the top of `apps/docs/.vitepress/theme/prose.css` (after the section 0 font loading comment, before the section 1 design tokens), add:

```css
@import "./generated/icon-masks.css";
```

**Step 2: Replace the summary chevron icon**

Find the `summary::after` rule (~line 592-603). Replace the `background` properties with mask properties:

```css
/* Before — lines 600-602 */
  background: no-repeat center / 18px 18px;
  /* Phosphor CaretDown (regular) */
  background-image: url("data:image/svg+xml,...");

/* After */
  -webkit-mask-image: var(--fd-icon-mask-caret-down);
  mask-image: var(--fd-icon-mask-caret-down);
  -webkit-mask-size: 18px 18px;
  mask-size: 18px 18px;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  background-color: var(--ds-color-text-primary, #212123);
```

Keep the existing `content`, `flex-shrink`, `margin-left`, `width`, `height`, `padding`, `box-sizing`, and `transition` properties unchanged.

**Step 3: Replace the default callout icon**

Find `.prose-callout-icon` (~line 1002-1009). Replace:

```css
/* Before */
.prose-callout-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 2px;
  background: no-repeat center / 20px 20px;
  /* Default: Phosphor Lightbulb (regular) */
  background-image: url("data:image/svg+xml,...");
}

/* After */
.prose-callout-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 2px;
  -webkit-mask-image: var(--fd-icon-mask-lightbulb);
  mask-image: var(--fd-icon-mask-lightbulb);
  -webkit-mask-size: 20px 20px;
  mask-size: 20px 20px;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  background-color: var(--ds-color-text-secondary, #595961);
}
```

**Step 4: Replace the callout variant icons**

Find the four callout variant icon rules (~lines 1043-1061). Replace each:

```css
/* Info */
.prose-callout-info .prose-callout-icon {
  -webkit-mask-image: var(--fd-icon-mask-info);
  mask-image: var(--fd-icon-mask-info);
  background-color: var(--ds-color-semantic-fg-info, #1278b0);
}

/* Warning */
.prose-callout-warning .prose-callout-icon {
  -webkit-mask-image: var(--fd-icon-mask-warning);
  mask-image: var(--fd-icon-mask-warning);
  background-color: var(--ds-color-semantic-fg-warning, #b48c14);
}

/* Success */
.prose-callout-success .prose-callout-icon {
  -webkit-mask-image: var(--fd-icon-mask-check-circle);
  mask-image: var(--fd-icon-mask-check-circle);
  background-color: var(--ds-color-semantic-fg-success, #1e8232);
}

/* Danger */
.prose-callout-danger .prose-callout-icon {
  -webkit-mask-image: var(--fd-icon-mask-warning-octagon);
  mask-image: var(--fd-icon-mask-warning-octagon);
  background-color: var(--ds-color-semantic-fg-error, #be2828);
}
```

**Step 5: Replace the external link icon**

Find the external link icon rules (~lines 1333-1347). Replace:

```css
/* Before */
.prose a[href^="http"]:not([href*="fdic.gov"]) {
  --_ext-icon: url("data:image/svg+xml,...");
  --_ext-icon-visited: url("data:image/svg+xml,...");
  --_ext-size: 0.9em;
  --_ext-top: 0.3em;
  padding-right: calc(var(--_ext-size) + 0.2em);
  background-image: var(--_ext-icon);
  background-position: right 0 top var(--_ext-top);
  background-size: var(--_ext-size) var(--_ext-size);
  background-repeat: no-repeat;
}

.prose a[href^="http"]:not([href*="fdic.gov"]):visited {
  background-image: var(--_ext-icon-visited);
}

/* After */
.prose a[href^="http"]:not([href*="fdic.gov"]) {
  --_ext-size: 0.9em;
  --_ext-top: 0.3em;
  padding-right: calc(var(--_ext-size) + 0.2em);
  -webkit-mask-image: var(--fd-icon-mask-arrow-square-out);
  mask-image: var(--fd-icon-mask-arrow-square-out);
  -webkit-mask-position: right 0 top var(--_ext-top);
  mask-position: right 0 top var(--_ext-top);
  -webkit-mask-size: var(--_ext-size) var(--_ext-size);
  mask-size: var(--_ext-size) var(--_ext-size);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  background-color: var(--ds-color-text-link, #1278b0);
}

.prose a[href^="http"]:not([href*="fdic.gov"]):visited {
  background-color: var(--ds-color-text-link-visited, #855AA5);
}
```

**Step 6: Delete the dark-mode SVG override block**

Find and delete the entire block from `/* --- SVG data URI icons — swap fills to light colors ---- */` through the end of the `.dark` external link icon rule (~lines 1651-1687). This is approximately 36 lines.

All dark mode now works automatically via `background-color` following `--ds-color-*` tokens.

**Step 7: Delete the dark-mode external link icon override**

If there is a `.dark .prose a[href^="http"]:not([href*="fdic.gov"])` rule separate from the block in step 6, also delete it. The `mask-image` approach makes it unnecessary.

**Step 8: Verify the print styles**

Check the `@media print` block. The print rules hide `.prose-callout-icon` with `display: none` — this still works with mask-image. The `summary::after` is also hidden in print. No changes needed.

**Step 9: Commit**

```bash
git add apps/docs/.vitepress/theme/prose.css
git commit -m "refactor(prose): replace inline SVG data URIs with mask-image variables

Consumes --fd-icon-mask-* CSS custom properties from the generated
icon-masks.css file. Icon color is now driven by background-color
using design system tokens, so dark mode works automatically.

Deletes ~80 lines of duplicated SVG data URIs and the entire .dark
SVG icon override block."
```

---

### Task 4: Wire build scripts and validation

**Files:**
- Modify: `package.json` (root)

**Step 1: Add generate and validate scripts**

In the root `package.json`, add to the `"scripts"` object:

```json
"generate:icon-masks": "node scripts/icons/generate-icon-masks.mjs",
"validate:icon-masks": "node scripts/icons/validate-icon-masks.mjs"
```

**Step 2: Create the validation script**

Create `scripts/icons/validate-icon-masks.mjs`:

```js
#!/usr/bin/env node

/**
 * Validate that the committed icon-masks.css matches what the generator
 * would produce from the current phosphor-data.mjs source.
 *
 * Run: npm run validate:icon-masks
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

const committedPath = path.join(
  repoRoot,
  "apps/docs/.vitepress/theme/generated/icon-masks.css",
);

if (!fs.existsSync(committedPath)) {
  console.error(
    "ERROR: icon-masks.css does not exist. Run `npm run generate:icon-masks`.",
  );
  process.exit(1);
}

const before = fs.readFileSync(committedPath, "utf8");

execFileSync("node", ["scripts/icons/generate-icon-masks.mjs"], {
  cwd: repoRoot,
  stdio: "inherit",
});

const after = fs.readFileSync(committedPath, "utf8");

if (before !== after) {
  console.error(
    "ERROR: icon-masks.css is out of date. Run `npm run generate:icon-masks` and commit the result.",
  );
  process.exit(1);
}

console.log("icon-masks.css is up to date.");
```

**Step 3: Wire into the build chain**

In root `package.json`, update the `"build"` script to include icon mask generation:

```json
"build": "npm run build:components && npm run generate:icon-masks && npm run build:react && npm run build:docs"
```

Note: `generate:icon-masks` runs after `build:components` but does NOT depend on it — it reads directly from `phosphor-data.mjs`. The ordering is just for logical grouping.

**Step 4: Run validation to confirm it passes**

Run: `npm run validate:icon-masks`

Expected: `icon-masks.css is up to date.`

**Step 5: Commit**

```bash
git add package.json scripts/icons/validate-icon-masks.mjs
git commit -m "build: wire icon mask generation and drift validation into build chain

Adds generate:icon-masks and validate:icon-masks scripts.
Validation regenerates and diffs against the committed file,
following the same pattern as validate:components."
```

---

### Task 5: Final verification — tests, build, and forced-colors

**Files:** None (verification only)

**Step 1: Run the full component test suite**

Run: `cd packages/components && npx vitest run`

Expected: All tests PASS, including the updated phosphor-regular icon count.

**Step 2: Build the docs site**

Run: `cd apps/docs && npx vitepress build`

Expected: Build succeeds with no errors. The `@import "./generated/icon-masks.css"` resolves correctly.

**Step 3: Run icon mask validation**

Run: `npm run validate:icon-masks`

Expected: `icon-masks.css is up to date.`

**Step 4: Verify forced-colors behavior**

This is a manual verification. Open the built docs in a browser and test under forced-colors mode (Windows High Contrast or Chrome DevTools emulation: Rendering > Emulate CSS media feature `forced-colors: active`).

Check these elements:
1. **Callout icons** — Do they remain visible? Does `forced-color-adjust: none` on `.prose-callout-icon` preserve the `background-color` through the mask?
2. **Summary chevron** — Does the caret-down icon remain visible with `forced-color-adjust: none` on `summary::after`?
3. **External link icon** — Does the arrow-square-out mask render correctly on the inline `<a>` element?

**If icons disappear or lose color under forced-colors:**

Add explicit system color overrides to the existing `@media (forced-colors: active)` block in prose.css:

```css
@media (forced-colors: active) {
  /* Add these if mask-image icons lose color */
  .prose-callout-icon {
    background-color: ButtonText;
  }
  .prose-callout-info .prose-callout-icon,
  .prose-callout-success .prose-callout-icon {
    background-color: LinkText;
  }
  .prose summary::after {
    background-color: ButtonText;
  }
}
```

Document the findings. If forced-colors overrides are needed, add them and commit.

**Step 5: Commit design and plan docs**

```bash
git add docs/plans/2026-04-07-prose-icon-unification-design.md docs/plans/2026-04-07-prose-icon-unification-implementation.md
git commit -m "docs: add prose icon unification design and implementation plan"
```
