export const COMPONENT_KINDS = {
  FIRST_CLASS: "first-class",
  SUPPORTING_STANDALONE: "supporting-standalone",
  SUPPORTING_EMBEDDED: "supporting-embedded",
  INTERNAL_ONLY: "internal-only",
};

export const DOCS_CATEGORIES = {
  FORMS_INPUT: "forms-input",
  ACTIONS_NAVIGATION: "actions-navigation",
  FEEDBACK_STATUS: "feedback-status",
  LAYOUT_SHELL: "layout-shell",
  VISUAL_MEDIA: "visual-media",
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
      category: DOCS_CATEGORIES.ACTIONS_NAVIGATION,
      order: 20,
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
      category: DOCS_CATEGORIES.ACTIONS_NAVIGATION,
      order: 30,
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
      category: DOCS_CATEGORIES.FORMS_INPUT,
      order: 70,
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
      category: DOCS_CATEGORIES.FORMS_INPUT,
      order: 80,
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
      category: DOCS_CATEGORIES.FORMS_INPUT,
      order: 20,
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
      category: DOCS_CATEGORIES.VISUAL_MEDIA,
      order: 30,
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
      category: DOCS_CATEGORIES.FORMS_INPUT,
      order: 40,
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
      category: DOCS_CATEGORIES.FORMS_INPUT,
      order: 10,
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
      category: DOCS_CATEGORIES.ACTIONS_NAVIGATION,
      order: 50,
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
      category: DOCS_CATEGORIES.FORMS_INPUT,
      order: 30,
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
      category: DOCS_CATEGORIES.FORMS_INPUT,
      order: 90,
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
      category: DOCS_CATEGORIES.FORMS_INPUT,
      order: 100,
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
      category: DOCS_CATEGORIES.FORMS_INPUT,
      order: 60,
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
      category: DOCS_CATEGORIES.ACTIONS_NAVIGATION,
      order: 40,
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
      category: DOCS_CATEGORIES.FORMS_INPUT,
      order: 120,
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
      category: DOCS_CATEGORIES.FORMS_INPUT,
      order: 110,
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
      category: DOCS_CATEGORIES.FEEDBACK_STATUS,
      order: 30,
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
      category: DOCS_CATEGORIES.FEEDBACK_STATUS,
      order: 40,
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
      category: DOCS_CATEGORIES.FEEDBACK_STATUS,
      order: 50,
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
      category: DOCS_CATEGORIES.FEEDBACK_STATUS,
      order: 60,
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
      category: DOCS_CATEGORIES.FORMS_INPUT,
      order: 50,
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
      category: DOCS_CATEGORIES.VISUAL_MEDIA,
      order: 20,
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
      category: DOCS_CATEGORIES.FEEDBACK_STATUS,
      order: 10,
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
      kind: COMPONENT_KINDS.SUPPORTING_STANDALONE,
      title: "Stripe",
      slug: "stripe",
      category: DOCS_CATEGORIES.LAYOUT_SHELL,
      order: 70,
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
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Link",
      slug: "link",
      category: DOCS_CATEGORIES.ACTIONS_NAVIGATION,
      order: 10,
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
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Pagination",
      slug: "pagination",
      category: DOCS_CATEGORIES.ACTIONS_NAVIGATION,
      order: 60,
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
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Global Header",
      slug: "global-header",
      category: DOCS_CATEGORIES.LAYOUT_SHELL,
      order: 10,
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
      kind: COMPONENT_KINDS.SUPPORTING_STANDALONE,
      title: "Header Search",
      slug: "header-search",
      category: DOCS_CATEGORIES.LAYOUT_SHELL,
      order: 20,
    },
    storybook: {
      title: "Supporting Primitives/Header Search",
      file: "fd-header-search.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: ["fd-icon", "fd-button", "fd-drawer"],
    },
    typeExports: [
      "HeaderSearchSurface",
      "FdHeaderSearchItem",
      "FdHeaderSearchInputDetail",
      "FdHeaderSearchOpenChangeDetail",
      "FdHeaderSearchSubmitDetail",
      "FdHeaderSearchActivateDetail",
    ],
  },
  {
    tagName: "fd-drawer",
    className: "FdDrawer",
    sourceFile: "fd-drawer.ts",
    docs: {
      kind: COMPONENT_KINDS.SUPPORTING_STANDALONE,
      title: "Drawer",
      slug: "drawer",
      category: DOCS_CATEGORIES.LAYOUT_SHELL,
      order: 30,
    },
    storybook: {
      title: "Supporting Primitives/Drawer",
      file: "fd-drawer.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: [],
    },
    typeExports: ["FdDrawerPlacement", "FdDrawerCloseRequestDetail"],
  },
    {
    tagName: "fd-page-header",
    className: "FdPageHeader",
    sourceFile: "fd-page-header.ts",
    docs: {
      kind: "first-class",
      title: "Page Header",
      slug: "page-header",
      category: "layout-shell",
      order: 40
    },
    storybook: {
      title: "Components/Page Header",
      file: "fd-page-header.stories.ts"
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: ["fd-icon", "fd-button", "fd-page-header-button"]
    },
    typeExports: ["FdPageHeaderBreadcrumb"]
  },
  {
    tagName: "fd-page-header-button",
    className: "FdPageHeaderButton",
    sourceFile: "fd-page-header-button.ts",
    docs: {
      kind: "supporting-embedded"
    },
    storybook: null,
    register: {
      exportSubpath: false,
      includeInRegisterAll: false,
      dependencies: ["fd-button"]
    },
    typeExports: []
  },
  {
    tagName: "fd-hero",
    className: "FdHero",
    sourceFile: "fd-hero.ts",
    docs: {
      kind: "first-class",
      title: "Hero",
      slug: "hero",
      category: "layout-shell",
      order: 50
    },
    storybook: {
      title: "Components/Hero",
      file: "fd-hero.stories.ts"
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: []
    },
    typeExports: ["HeroTone"]
  },
  {
    tagName: "fd-page-feedback",
    className: "FdPageFeedback",
    sourceFile: "fd-page-feedback.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Page Feedback",
      slug: "page-feedback",
      category: DOCS_CATEGORIES.FEEDBACK_STATUS,
      order: 20,
    },
    storybook: {
      title: "Components/Page Feedback",
      file: "fd-page-feedback.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: [
        "fd-button",
        "fd-button-group",
        "fd-link",
        "fd-label",
        "fd-textarea",
      ],
    },
    typeExports: [
      "PageFeedbackView",
      "PageFeedbackViewChangeReason",
      "PageFeedbackViewChangeDetail",
      "PageFeedbackReportSubmitDetail",
    ],
  },
  {
    tagName: "fd-event",
    className: "FdEvent",
    sourceFile: "fd-event.ts",
    docs: {
      kind: "first-class",
      title: "Event",
      slug: "event",
      category: "actions-navigation",
      order: 90
    },
    storybook: {
      title: "Components/Event",
      file: "fd-event.stories.ts"
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: []
    },
    typeExports: ["EventTone"]
  },
  {
    tagName: "fd-event-list",
    className: "FdEventList",
    sourceFile: "fd-event-list.ts",
    docs: {
      kind: "first-class",
      title: "Event List",
      slug: "event-list",
      category: "actions-navigation",
      order: 100
    },
    storybook: {
      title: "Components/Event List",
      file: "fd-event-list.stories.ts"
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: []
    },
    typeExports: []
  },
  {
    tagName: "fd-tile",
    className: "FdTile",
    sourceFile: "fd-tile.ts",
    docs: {
      kind: "first-class",
      title: "Tile",
      slug: "tile",
      category: "actions-navigation",
      order: 70
    },
    storybook: {
      title: "Components/Tile",
      file: "fd-tile.stories.ts"
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: ["fd-visual"]
    },
    typeExports: ["TileTone", "FdTileLinkItem"]
  },
  {
    tagName: "fd-tile-list",
    className: "FdTileList",
    sourceFile: "fd-tile-list.ts",
    docs: {
      kind: "first-class",
      title: "Tile List",
      slug: "tile-list",
      category: "actions-navigation",
      order: 80
    },
    storybook: {
      title: "Components/Tile List",
      file: "fd-tile-list.stories.ts"
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: []
    },
    typeExports: []
  },
    {
    tagName: "fd-card",
    className: "FdCard",
    sourceFile: "fd-card.ts",
    docs: {
      kind: "first-class",
      title: "Card",
      slug: "card",
      category: "visual-media",
      order: 10
    },
    storybook: {
      title: "Components/Card",
      file: "fd-card.stories.ts"
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: []
    },
    typeExports: []
  },
  {
    tagName: "fd-global-footer",
    className: "FdGlobalFooter",
    sourceFile: "fd-global-footer.ts",
    docs: {
      kind: COMPONENT_KINDS.FIRST_CLASS,
      title: "Global Footer",
      slug: "global-footer",
      category: DOCS_CATEGORIES.LAYOUT_SHELL,
      order: 80,
    },
    storybook: {
      title: "Components/Global Footer",
      file: "fd-global-footer.stories.ts",
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: [],
    },
    typeExports: [
      "GlobalFooterSocialIcon",
      "FdGlobalFooterLink",
      "FdGlobalFooterSocialLink",
    ],
  },
    {
    tagName: "fd-card-group",
    className: "FdCardGroup",
    sourceFile: "fd-card-group.ts",
    docs: {
      kind: "first-class",
      title: "Card Group",
      slug: "card-group",
      category: "layout-shell",
      order: 60
    },
    storybook: {
      title: "Components/Card Group",
      file: "fd-card-group.stories.ts"
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: []
    },
    typeExports: []
  },
    {
    tagName: "fd-confirmation-record",
    className: "FdConfirmationRecord",
    sourceFile: "fd-confirmation-record.ts",
    docs: {
      kind: "supporting-standalone",
      title: "Confirmation Record",
      slug: "confirmation-record",
      category: "feedback-status",
      order: 90
    },
    storybook: {
      title: "Supporting Primitives/Confirmation Record",
      file: "fd-confirmation-record.stories.ts"
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: []
    },
    typeExports: ["ConfirmationRecordVariant", "ConfirmationRecordStatus"]
  },
    {
    tagName: "fd-form-field",
    className: "FdFormField",
    sourceFile: "fd-form-field.ts",
    docs: {
      kind: "supporting-standalone",
      title: "Form Field",
      slug: "form-field",
      category: "forms-input",
      order: 25
    },
    storybook: {
      title: "Supporting Primitives/Form Field",
      file: "fd-form-field.stories.ts"
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: []
    },
    typeExports: ["FormFieldLayout", "FormFieldControlType"]
  },
    {
    tagName: "fd-error-summary",
    className: "FdErrorSummary",
    sourceFile: "fd-error-summary.ts",
    docs: {
      kind: "supporting-standalone",
      title: "Error Summary",
      slug: "error-summary",
      category: "feedback-status",
      order: 70
    },
    storybook: {
      title: "Supporting Primitives/Error Summary",
      file: "fd-error-summary.stories.ts"
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: []
    },
    typeExports: ["ErrorSummaryFocusTarget", "ErrorSummaryItem"]
  },
    {
    tagName: "fd-review-list",
    className: "FdReviewList",
    sourceFile: "fd-review-list.ts",
    docs: {
      kind: "supporting-standalone",
      title: "Review List",
      slug: "review-list",
      category: "feedback-status",
      order: 80
    },
    storybook: {
      title: "Supporting Primitives/Review List",
      file: "fd-review-list.stories.ts"
    },
    register: {
      exportSubpath: true,
      includeInRegisterAll: true,
      dependencies: []
    },
    typeExports: ["ReviewListHeadingLevel", "ReviewListDensity", "ReviewListItem"]
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
