export const COMPONENT_KINDS = {
  FIRST_CLASS: "first-class",
  SUPPORTING_STANDALONE: "supporting-standalone",
  SUPPORTING_EMBEDDED: "supporting-embedded",
  INTERNAL_ONLY: "internal-only",
};

export const componentInventory = [
  {
    tagName: "fd-button",
    className: "FdButton",
    sourceFile: "fd-button.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Button",
      slug: "button",
    },
    storybook: {
      title: "Components/Button",
      file: "fd-button.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: [],
    },
    typeExports: ["ButtonVariant"],
  },
  {
    tagName: "fd-button-group",
    className: "FdButtonGroup",
    sourceFile: "fd-button-group.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Button Group",
      slug: "button-group",
    },
    storybook: {
      title: "Components/Button Group",
      file: "fd-button-group.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: [],
    },
    typeExports: ["ButtonGroupAlign", "ButtonGroupDirection"],
  },
  {
    tagName: "fd-checkbox",
    className: "FdCheckbox",
    sourceFile: "fd-checkbox.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Checkbox",
      slug: "checkbox",
    },
    storybook: {
      title: "Components/Checkbox",
      file: "fd-checkbox.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: [],
    },
    typeExports: [],
  },
  {
    tagName: "fd-checkbox-group",
    className: "FdCheckboxGroup",
    sourceFile: "fd-checkbox-group.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Checkbox Group",
      slug: "checkbox-group",
    },
    storybook: {
      title: "Components/Checkbox Group",
      file: "fd-checkbox-group.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: ["fd-checkbox"],
    },
    typeExports: ["CheckboxGroupOrientation"],
  },
  {
    tagName: "fd-field",
    className: "FdField",
    sourceFile: "fd-field.ts",
    docs: {
      kind: COMPONENT_KINDS.SUPPORTING_STANDALONE,
      title: "Field",
      slug: "field",
    },
    storybook: {
      title: "Supporting Primitives/Field",
      file: "fd-field.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: ["fd-label", "fd-input", "fd-message"],
    },
    typeExports: [],
  },
  {
    tagName: "fd-icon",
    className: "FdIcon",
    sourceFile: "fd-icon.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Icon",
      slug: "icon",
    },
    storybook: {
      title: "Components/Icon",
      file: "fd-icon.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: [],
    },
    typeExports: [],
  },
  {
    tagName: "fd-input",
    className: "FdInput",
    sourceFile: "fd-input.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Input",
      slug: "input",
    },
    storybook: {
      title: "Components/Input",
      file: "fd-input.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: [],
    },
    typeExports: ["InputType"],
  },
  {
    tagName: "fd-label",
    className: "FdLabel",
    sourceFile: "fd-label.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Label",
      slug: "label",
    },
    storybook: {
      title: "Components/Label",
      file: "fd-label.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: [],
    },
    typeExports: [],
  },
  {
    tagName: "fd-menu",
    className: "FdMenu",
    sourceFile: "fd-menu.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Menu",
      slug: "menu",
    },
    storybook: {
      title: "Components/Menu",
      file: "fd-menu.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: ["fd-menu-item"],
    },
    typeExports: [],
  },
  {
    tagName: "fd-menu-item",
    className: "FdMenuItem",
    sourceFile: "fd-menu-item.ts",
    docs: {
      kind: COMPONENT_KINDS.SUPPORTING_EMBEDDED,
      parentTagName: "fd-menu",
    },
    storybook: null,
    register: {
      exportSubpath: false,
      includeInRegisterAll: false,
      dependencies: [],
    },
    typeExports: ["MenuItemVariant"],
  },
  {
    tagName: "fd-message",
    className: "FdMessage",
    sourceFile: "fd-message.ts",
    docs: {
      kind: COMPONENT_KINDS.SUPPORTING_STANDALONE,
      title: "Message",
      slug: "message",
    },
    storybook: {
      title: "Supporting Primitives/Message",
      file: "fd-message.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: [],
    },
    typeExports: ["MessageState", "LiveMode"],
  },
  {
    tagName: "fd-option",
    className: "FdOption",
    sourceFile: "fd-option.ts",
    docs: {
      kind: COMPONENT_KINDS.SUPPORTING_EMBEDDED,
      parentTagName: "fd-selector",
    },
    storybook: null,
    register: {
      exportSubpath: false,
      includeInRegisterAll: false,
      dependencies: [],
    },
    typeExports: [],
  },
  {
    tagName: "fd-radio",
    className: "FdRadio",
    sourceFile: "fd-radio.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Radio",
      slug: "radio",
    },
    storybook: {
      title: "Components/Radio",
      file: "fd-radio.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: [],
    },
    typeExports: [],
  },
  {
    tagName: "fd-radio-group",
    className: "FdRadioGroup",
    sourceFile: "fd-radio-group.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Radio Group",
      slug: "radio-group",
    },
    storybook: {
      title: "Components/Radio Group",
      file: "fd-radio-group.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: ["fd-radio"],
    },
    typeExports: ["RadioGroupOrientation"],
  },
  {
    tagName: "fd-selector",
    className: "FdSelector",
    sourceFile: "fd-selector.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Selector",
      slug: "selector",
    },
    storybook: {
      title: "Components/Selector",
      file: "fd-selector.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: ["fd-option"],
    },
    typeExports: ["SelectorVariant"],
  },
  {
    tagName: "fd-split-button",
    className: "FdSplitButton",
    sourceFile: "fd-split-button.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Split Button",
      slug: "split-button",
    },
    storybook: {
      title: "Components/Split Button",
      file: "fd-split-button.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: ["fd-button", "fd-menu-item", "fd-menu"],
    },
    typeExports: [],
  },
  {
    tagName: "fd-placeholder",
    className: "FdPlaceholder",
    sourceFile: "fd-placeholder.ts",
    docs: {
      kind: COMPONENT_KINDS.INTERNAL_ONLY,
    },
    storybook: null,
    register: {
      exportSubpath: false,
      includeInRegisterAll: false,
      dependencies: [],
    },
    typeExports: [],
  },
  {
    tagName: "fd-file-input",
    className: "FdFileInput",
    sourceFile: "fd-file-input.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "File Input",
      slug: "file-input",
    },
    storybook: {
      title: "Components/File Input",
      file: "fd-file-input.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: [],
    },
    typeExports: [
      "FileInputItem",
      "FileInputItemState",
      "FileInputRejectReason",
      "FileInputRejectedFile",
      "FdFileInputChangeDetail",
      "FdFileInputActionDetail",
    ],
  },
  {
    tagName: "fd-slider",
    className: "FdSlider",
    sourceFile: "fd-slider.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Slider",
      slug: "slider",
    },
    storybook: {
      title: "Components/Slider",
      file: "fd-slider.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: [],
    },
    typeExports: [],
  },
  {
    tagName: "fd-badge",
    className: "FdBadge",
    sourceFile: "fd-badge.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Badge",
      slug: "badge",
    },
    storybook: {
      title: "Components/Badge",
      file: "fd-badge.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: [],
    },
    typeExports: ["BadgeType"],
  },
  {
    tagName: "fd-badge-group",
    className: "FdBadgeGroup",
    sourceFile: "fd-badge-group.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Badge Group",
      slug: "badge-group",
    },
    storybook: {
      title: "Components/Badge Group",
      file: "fd-badge-group.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: [],
    },
    typeExports: [],
  },
  {
    tagName: "fd-chip",
    className: "FdChip",
    sourceFile: "fd-chip.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Chip",
      slug: "chip",
    },
    storybook: {
      title: "Components/Chip",
      file: "fd-chip.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: [],
    },
    typeExports: ["ChipType"],
  },
  {
    tagName: "fd-chip-group",
    className: "FdChipGroup",
    sourceFile: "fd-chip-group.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Chip Group",
      slug: "chip-group",
    },
    storybook: {
      title: "Components/Chip Group",
      file: "fd-chip-group.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: [],
    },
    typeExports: [],
  },
  {
    tagName: "fd-textarea",
    className: "FdTextarea",
    sourceFile: "fd-textarea.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Text Area",
      slug: "textarea",
    },
    storybook: {
      title: "Components/Text Area",
      file: "fd-textarea.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: [],
    },
    typeExports: [],
  },
  {
    tagName: "fd-visual",
    className: "FdVisual",
    sourceFile: "fd-visual.ts",
    docs: {
      kind: COMPONENT_KINDS.SUPPORTING_STANDALONE,
      title: "Visual",
      slug: "visual",
    },
    storybook: {
      title: "Supporting Primitives/Visual",
      file: "fd-visual.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: ["fd-icon"],
    },
    typeExports: ["VisualSize", "VisualType"],
  },
  {
    tagName: "fd-alert",
    className: "FdAlert",
    sourceFile: "fd-alert.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Alert",
      slug: "alert",
    },
    storybook: {
      title: "Components/Alert",
      file: "fd-alert.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: [],
    },
    typeExports: ["AlertVariant", "AlertType", "AlertLive"],
  },
  {
    tagName: "fd-stripe",
    className: "FdStripe",
    sourceFile: "fd-stripe.ts",
    docs: {
      kind: "supporting-standalone",
      title: "Stripe",
      slug: "stripe",
    },
    storybook: {
      title: "Supporting Primitives/Stripe",
      file: "fd-stripe.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: [],
    },
    typeExports: ["StripeType"],
  },
  {
    tagName: "fd-link",
    className: "FdLink",
    sourceFile: "fd-link.ts",
    docs: {
      kind: "first-class",
      title: "Link",
      slug: "link",
    },
    storybook: {
      title: "Components/Link",
      file: "fd-link.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: [],
    },
    typeExports: ["LinkVariant", "LinkSize"],
  },
  {
    tagName: "fd-pagination",
    className: "FdPagination",
    sourceFile: "fd-pagination.ts",
    docs: {
      kind: "first-class",
      title: "Pagination",
      slug: "pagination",
    },
    storybook: {
      title: "Components/Pagination",
      file: "fd-pagination.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: ["fd-icon"],
    },
    typeExports: [],
  },
  {
    tagName: "fd-global-header",
    className: "FdGlobalHeader",
    sourceFile: "fd-global-header.ts",
    docs: {
      kind: "first-class",
      title: "Global Header",
      slug: "global-header",
    },
    storybook: {
      title: "Components/Global Header",
      file: "fd-global-header.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: ["fd-icon", "fd-header-search", "fd-drawer"],
    },
    typeExports: [
      "GlobalHeaderSearchSurface",
      "FdGlobalHeaderLeafItem",
      "FdGlobalHeaderSectionItem",
      "FdGlobalHeaderSection",
      "FdGlobalHeaderLinkItem",
      "FdGlobalHeaderPanelItem",
      "FdGlobalHeaderNavigationItem",
      "FdGlobalHeaderSearchConfig",
      "FdGlobalHeaderSearchSubmitDetail",
    ],
  },
    {
    tagName: "fd-header-search",
    className: "FdHeaderSearch",
    sourceFile: "fd-header-search.ts",
    docs: {
      kind: "supporting-standalone",
      title: "Header Search",
      slug: "header-search"
    },
    storybook: {
      title: "Supporting Primitives/Header Search",
      file: "fd-header-search.stories.ts"
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: ["fd-icon", "fd-drawer"]
    },
    typeExports: [
      "HeaderSearchSurface",
      "FdHeaderSearchItem",
      "FdHeaderSearchInputDetail",
      "FdHeaderSearchOpenChangeDetail",
      "FdHeaderSearchSubmitDetail",
      "FdHeaderSearchActivateDetail",
    ]
  },
    {
    tagName: "fd-drawer",
    className: "FdDrawer",
    sourceFile: "fd-drawer.ts",
    docs: {
      kind: "supporting-standalone",
      title: "Drawer",
      slug: "drawer"
    },
    storybook: {
      title: "Supporting Primitives/Drawer",
      file: "fd-drawer.stories.ts"
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: []
    },
    typeExports: ["FdDrawerPlacement", "FdDrawerCloseRequestDetail"]
  },
  // New component entries are inserted above this line by the scaffold script.
];

export const publicComponentInventory = componentInventory.filter(
  (component) => component.docs.kind !== COMPONENT_KINDS.INTERNAL_ONLY,
);

export const standaloneDocComponents = componentInventory.filter((component) =>
  [
    COMPONENT_KINDS.FIRST_CLASS,
    COMPONENT_KINDS.SUPPORTING_STANDALONE,
  ].includes(component.docs.kind),
);

export const symbolExportComponents = componentInventory.filter(
  (component) =>
    component.docs.kind !== COMPONENT_KINDS.INTERNAL_ONLY &&
    component.tagName !== "fd-placeholder",
);

export const registerExportComponents = componentInventory.filter(
  (component) => component.register.exportSubpath,
);

export const registerAllComponents = componentInventory.filter(
  (component) => component.register.includeInRegisterAll,
);
