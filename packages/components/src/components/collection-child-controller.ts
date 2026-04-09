type ChildElement = HTMLElement;

type CollectionChildControllerOptions = {
  applyToChild: (element: ChildElement) => void;
  attributeFilter: string[];
  isManagedChild: (node: Element) => node is ChildElement;
  slot: () => HTMLSlotElement | null;
};

export class CollectionChildController {
  readonly #applyToChild: CollectionChildControllerOptions["applyToChild"];
  readonly #attributeFilter: string[];
  readonly #isManagedChild: CollectionChildControllerOptions["isManagedChild"];
  readonly #observers = new Map<ChildElement, MutationObserver>();
  readonly #slot: CollectionChildControllerOptions["slot"];

  constructor(options: CollectionChildControllerOptions) {
    this.#applyToChild = options.applyToChild;
    this.#attributeFilter = options.attributeFilter;
    this.#isManagedChild = options.isManagedChild;
    this.#slot = options.slot;
  }

  sync() {
    const slot = this.#slot();
    if (!slot) {
      return;
    }

    const assignedChildren = slot
      .assignedElements({ flatten: true })
      .filter(this.#isManagedChild);

    for (const element of [...this.#observers.keys()]) {
      if (!assignedChildren.includes(element)) {
        this.#observers.get(element)?.disconnect();
        this.#observers.delete(element);
      }
    }

    for (const element of assignedChildren) {
      this.#applyToChild(element);

      if (!this.#observers.has(element)) {
        const observer = new MutationObserver((records) => {
          for (const record of records) {
            if (
              record.type === "attributes" &&
              record.attributeName &&
              this.#attributeFilter.includes(record.attributeName)
            ) {
              this.#applyToChild(element);
            }
          }
        });

        observer.observe(element, {
          attributes: true,
          attributeFilter: this.#attributeFilter,
        });
        this.#observers.set(element, observer);
      }
    }
  }

  disconnect() {
    for (const observer of this.#observers.values()) {
      observer.disconnect();
    }

    this.#observers.clear();
  }
}
