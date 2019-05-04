export class VampireRoot extends HTMLElement {
  static readonly tagName = 'v-root';
}

declare global {
  interface HTMLElementTagNameMap {
    [VampireRoot.tagName]: VampireRoot;
  }
}

customElements.define(VampireRoot.tagName, VampireRoot);
