import { VampireRoot } from './vampire-root';
import { VampireSlotAssignedContent, VampireSlotAssignedContentClasses } from './vampire-slot-assigned-content';
import { VampireSlotFallbackContent } from './vampire-slot-fallback-content';
import { toggleClass } from './utils';

export enum VampireSlotEvents {
  SlotChange = 'v::slotchange'
}

export class VampireSlot extends HTMLElement {
  static readonly tagName = 'v-slot';

  name: string = this.getAttribute('name') || '';

  protected _assignedContent: VampireSlotAssignedContent;
  protected _observer = new MutationObserver(() => this._updateAssignedContent());
  protected _vampireRoot: VampireRoot | null = null;

  constructor() {
    super();

    this._assignedContent = document.createElement(VampireSlotAssignedContent.tagName);
    this._assignedContent.classList.add(VampireSlotAssignedContentClasses.hidden);

    const observer = new MutationObserver(() => {
      const hidden = this._assignedContent.childNodes.length === 0;

      toggleClass(this._assignedContent, VampireSlotAssignedContentClasses.hidden, hidden);
      this.dispatchEvent(new CustomEvent(VampireSlotEvents.SlotChange, {
        bubbles: true
      }));
    });

    observer.observe(this._assignedContent, {childList: true});
  }

  connectedCallback() {
    if (!this._assignedContent.parentElement) {
      this.appendChild(this._assignedContent);
    }

    this._vampireRoot = this._getVampireRoot();

    if (!this._vampireRoot) {
      return;
    }

    this._updateAssignedContent();
    this._observer.observe(this._vampireRoot.parentElement!, {childList: true});
  }

  disconnectedCallback() {
    this._observer.disconnect();

    const element = this._vampireRoot && this._vampireRoot.parentElement;
    const fragment = document.createDocumentFragment();

    Array.from(this._assignedContent.childNodes).forEach((child) => {
      fragment.appendChild(child);
    });

    if (element) {
      element.appendChild(fragment);
    }

    this._vampireRoot = null;
  }

  assignedElements(options: {flatten?: boolean} = {}): Element[] {
    const assignedElements = Array.from(this._assignedContent.children);
    const fallbackContent = this.querySelector(VampireSlotFallbackContent.tagName);

    return options.flatten && !assignedElements.length
      ? fallbackContent ? Array.from(fallbackContent.children) : []
      : assignedElements;
  }

  assignedNodes(options: {flatten?: boolean} = {}): Node[] {
    const assignedNodes = Array.from(this._assignedContent.childNodes);
    const fallbackContent = this.querySelector(VampireSlotFallbackContent.tagName);

    return options.flatten && !assignedNodes.length
      ? fallbackContent ? Array.from(fallbackContent.childNodes) : []
      : assignedNodes;
  }

  protected _getSlotForNode(node: Node): string {
    return node instanceof HTMLElement ? node.getAttribute('v-slot') || '' : '';
  }

  protected _getVampireRoot(): VampireRoot | null {
    let parent = this.parentElement;

    while (parent !== null && !(parent instanceof VampireRoot)) {
      if (parent instanceof VampireSlot) {
        /**
         * There is nothing stoping someone from placing a <v-slot> in their
         * slotted content. If we encounter a <v-slot> within a <v-slot> just
         * ignore it.
         */
        parent = null;
        break;
      }

      parent = parent.parentElement;
    }

    return parent;
  }

  protected _updateAssignedContent() {
    if (!this._vampireRoot || !this._vampireRoot.parentElement) {
      return;
    }

    const assignedContent = Array
      .from(this._vampireRoot.parentElement.childNodes)
      .filter((node) => !(node instanceof VampireRoot)
        && this._getSlotForNode(node) === this.name);

    if (assignedContent.length) {
      const fragment = document.createDocumentFragment();

      assignedContent.forEach((node) => {
        fragment.appendChild(node);
      });

      this._assignedContent.appendChild(fragment);
    }
  }
}

// export namespace VampireSlot {
//   export enum Events {
//     SlotChange = 'v::slotchange'
//   }
// }

// declare global {
//   interface HTMLElementTagNameMap {
//     [VampireSlot.tagName]: VampireSlot;
//   }
// }

customElements.define(VampireSlot.tagName, VampireSlot);
