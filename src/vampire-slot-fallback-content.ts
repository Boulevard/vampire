import { VampireSlot, VampireSlotEvents } from './vampire-slot';
import { toggleClass } from './utils';

export enum VampireSlotFallbackContentClasses {
  hidden = 'v-slot__fallback-content--hidden'
}
export class VampireSlotFallbackContent extends HTMLElement {
  static readonly tagName = 'v-slot-fallback-content';

  constructor() {
    super();
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  connectedCallback() {
    let hidden = false;

    if (this.parentElement instanceof VampireSlot) {
      hidden = Boolean(this.parentElement.assignedNodes().length);

      this.parentElement
        .addEventListener(VampireSlotEvents.SlotChange, this._onSlotChange);
    }

    // toggleClass(this, VampireSlotFallbackContent.Classes.Hidden, hidden);
    toggleClass(this, VampireSlotFallbackContentClasses.hidden, hidden);
  }

  disconnectedCallback() {
    if (this.parentElement instanceof VampireSlot) {
      this.parentElement
        .removeEventListener(VampireSlotEvents.SlotChange, this._onSlotChange);
    }
  }

  protected _onSlotChange(event: Event) {
    const slot = event.target as VampireSlot;
    const hidden = Boolean(slot.assignedNodes().length);

    // toggleClass(this, VampireSlotFallbackContent.Classes.Hidden, hidden);
    toggleClass(this, VampireSlotFallbackContentClasses.hidden, hidden);
  }
}

// export namespace VampireSlotFallbackContent {
//   export enum Classes {
//     Hidden = 'v-slot__fallback-content--hidden'
//   }
// }

// declare global {
//   interface HTMLElementTagNameMap {
//     [VampireSlotFallbackContent.tagName]: VampireSlotFallbackContent;
//   }
// }

customElements
  .define(VampireSlotFallbackContent.tagName, VampireSlotFallbackContent);
