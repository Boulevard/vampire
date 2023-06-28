export enum VampireSlotAssignedContentClasses {
  hidden = 'v-slot__assigned-content--hidden'
}

export class VampireSlotAssignedContent extends HTMLElement {
  static readonly tagName = 'v-slot-assigned-content';
}

// export namespace VampireSlotAssignedContent {
//   export enum Classes {
//     Hidden = 'v-slot__assigned-content--hidden'
//   }
// }

// declare global {
//   interface HTMLElementTagNameMap {
//     [VampireSlotAssignedContent.tagName]: VampireSlotAssignedContent;
//   }
// }

customElements
  .define(VampireSlotAssignedContent.tagName, VampireSlotAssignedContent);
