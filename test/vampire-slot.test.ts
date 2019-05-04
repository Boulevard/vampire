import '../src/vampire-root';
import '../src/vampire-slot';

import { VampireRoot, VampireSlot, VampireSlotFallbackContent } from '../src';
import { scheduleMicroTask } from './utils';

class ElementWithSlots extends HTMLElement {

  lightRoot: VampireRoot = document.createElement('v-root');

  constructor() {
    super();
    this.appendChild(this.lightRoot);
  }

  connectedCallback() {
    debugger;
    this.render();
  }

  render() {
    this.lightRoot.innerHTML = `
      <v-slot>
        <v-slot-fallback-content>
          👻
        </v-slot-fallback-content>
      </v-slot>
    `;
  }
}

customElements.define('element-with-slots', ElementWithSlots);

test('Upgrading a VampireSlot element.', () => {
  const lightSlot = document.createElement('v-slot');
  expect(lightSlot).toBeInstanceOf(VampireSlot);
});

describe('Slotting Content', () => {

  test('Slotting content to a nameless slot.', async () => {
    const elementWithSlots = document.createElement('element-with-slots');
    document.body.appendChild(elementWithSlots);

    const slot = elementWithSlots.querySelector('v-slot:not([name])') as VampireSlot;
    const node0 = document.createElement('div');
    const node1 = document.createElement('div');

    elementWithSlots.appendChild(node0);
    elementWithSlots.appendChild(node1);

    await scheduleMicroTask();

    const assignedNodes = slot.assignedNodes();

    expect(assignedNodes).toContain(node0);
    expect(assignedNodes).toContain(node1);

    // Need to remove the element before the end of the test so that `document`
    // is still defined with the element's disconnected lifecycle method is
    // called.
    elementWithSlots.remove();
  });

  describe('Fallback Content', () => {
    test('Rendering fallback contnet.', () => {
      const elementWithSlots = document.createElement('element-with-slots');
      document.body.appendChild(elementWithSlots);

      const slot = elementWithSlots.querySelector('v-slot:not([name])') as VampireSlot;
      const fallbackContent = slot.querySelector('v-slot-fallback-content') as VampireSlotFallbackContent;

      expect(slot.assignedNodes({flatten: true})).toContain(fallbackContent.firstChild);
      elementWithSlots.remove();
    });

    test('Rendering fallback contnet after slotted content is removed.', async () => {
      const elementWithSlots = document.createElement('element-with-slots');
      document.body.appendChild(elementWithSlots);

      const slot = elementWithSlots.querySelector('v-slot:not([name])') as VampireSlot;
      const fallbackContent = slot.querySelector('v-slot-fallback-content') as VampireSlotFallbackContent;
      const node0 = document.createElement('div');

      expect(slot.assignedNodes({flatten: true})).toContain(fallbackContent.firstChild);

      elementWithSlots.appendChild(node0);

      await scheduleMicroTask();

      const assignedNodes = slot.assignedNodes({flatten: true});

      expect(assignedNodes).toContain(node0);
      expect(assignedNodes).not.toContain(fallbackContent.firstChild);

      node0.remove();

      expect(slot.assignedNodes({flatten: true})).toContain(fallbackContent.firstChild);
      elementWithSlots.remove();
    });
  });
});
