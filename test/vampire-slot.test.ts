import '../src';
import { VampireSlot } from '../src';
import { render, scheduleMicroTask, template } from './utils';

/**
 * The ugly template formatting is because empty Text nodes will be slotted.
 * Therefore, there can't be any spaces or new lines before or after a <v-root>
 * element.
 */

afterEach(() => {
  // Need to remove the element before the end of the test so that `document`
  // is still defined when the element's disconnected lifecycle method is
  // called.
  Array.from(document.body.children).forEach(child => child.remove());
});

test('Slotting content to a nameless slot.', async () => {
  render(document.body, template`
    <div id="test"><v-root>
      <v-slot></v-slot>
    </v-root></div>
  `);

  const element = document.getElementById('test')!;
  const slot = element.querySelector('v-slot')!;
  const node0 = document.createElement('div');
  const node1 = document.createElement('div');

  element.appendChild(node0);
  element.appendChild(node1);

  await scheduleMicroTask();

  const assignedNodes = slot.assignedNodes();

  expect(assignedNodes).toContain(node0);
  expect(assignedNodes).toContain(node1);
});

test('Slotting content to a named slot.', async () => {
  render(document.body, template`
    <div id="test"><v-root>
      <v-slot></v-slot>
      <v-slot name="test"></v-slot>
    </v-root></div>
  `);

  const element = document.getElementById('test')!;
  const slot = element.querySelector('v-slot[name="test"]')! as VampireSlot;
  const node0 = document.createElement('div');
  const node1 = document.createElement('div');

  node1.setAttribute('v-slot', 'test');

  element.appendChild(node0);
  element.appendChild(node1);

  await scheduleMicroTask();

  const assignedNodes = slot.assignedNodes();

  expect(assignedNodes).not.toContain(node0);
  expect(assignedNodes).toContain(node1);
});

test('Rendering fallback contnet.', () => {
  render(document.body, template`
    <div id="test"><v-root>
      <v-slot>
        <v-slot-fallback-content>Test</v-slot-fallback-content>
      </v-slot>
    </v-root></div>
  `);

  const element = document.getElementById('test')!;
  const slot = element.querySelector('v-slot')!;
  const fallbackContent = slot.querySelector('v-slot-fallback-content')!;
  const assignedNodes = slot.assignedNodes({flatten: true});

  expect(assignedNodes).toContain(fallbackContent.firstChild);
});

test('Rendering fallback contnet after slotted content is removed.', async () => {
  render(document.body, template`
    <div id="test"><v-root>
      <v-slot>
        <v-slot-fallback-content>Test</v-slot-fallback-content>
      </v-slot>
    </v-root></div>
  `);

  const element = document.getElementById('test')!;
  const slot = element.querySelector('v-slot')!;
  const fallbackContent = slot.querySelector('v-slot-fallback-content')!;
  const node0 = document.createElement('div');

  element.appendChild(node0);

  await scheduleMicroTask();

  let assignedNodes = slot.assignedNodes({flatten: true});

  expect(assignedNodes).toContain(node0);
  expect(assignedNodes).not.toContain(fallbackContent.firstChild);

  node0.remove();
  assignedNodes = slot.assignedNodes({flatten: true});

  expect(assignedNodes).toContain(fallbackContent.firstChild);
});

test('Dispatching an event on slot change.', async () => {
  render(document.body, template`
    <div id="test"><v-root>
      <v-slot></v-slot>
    </v-root></div>
  `);

  const element = document.getElementById('test')!;
  const slot = element.querySelector('v-slot')!;
  const node0 = document.createElement('div');
  const onSlotChange = jest.fn();

  slot.addEventListener(VampireSlot.Events.SlotChange, onSlotChange);

  element.appendChild(node0);
  await scheduleMicroTask();
  node0.remove();
  await scheduleMicroTask();

  expect(onSlotChange).toHaveBeenCalledTimes(2);
});

test('Nested roots.', async () => {
  render(document.body, template`
    <div id="test"><v-root id="root-0">
      <v-slot></v-slot>
      <div><v-root id="root-1">
        <v-slot></v-slot>
      </v-root></div>
    </v-root></div>
  `);

  const element = document.getElementById('test')!;
  const root0 = document.getElementById('root-0')!;
  const root1 = document.getElementById('root-1')!;
  const slot0 = root0.querySelector(':scope > v-slot')! as VampireSlot;
  const slot1 = root1.querySelector(':scope > v-slot')! as VampireSlot;
  const node0 = document.createElement('div');
  const node1 = document.createElement('div');

  element.appendChild(node0);
  root1.parentElement!.appendChild(node1);

  await scheduleMicroTask();

  expect(slot0.assignedNodes()).toContain(node0);
  expect(slot1.assignedNodes()).toContain(node1);
});

test('Slots inside of fallback content are ignored.', async () => {
  render(document.body, template`
    <div id="test"><v-root>
      <v-slot id="slot-0">
        <v-slot-fallback-content>
          <v-slot></v-slot>
        </v-slot-fallback-content>
      </v-slot>
    </v-root></div>
  `);

  const element = document.getElementById('test')!;
  const slot0 = document.getElementById('slot-0')! as VampireSlot;
  const node0 = document.createElement('div');

  element.appendChild(node0);

  await scheduleMicroTask();

  expect(slot0.assignedNodes()).toContain(node0);
});


test('Removing a slot will return its content to the parent of the root.', async () => {
  render(document.body, template`
    <div id="test"><v-root>
      <v-slot></v-slot>
    </v-root></div>
  `);

  const element = document.getElementById('test')!;
  const slot = element.querySelector('v-slot')!;
  const node0 = document.createElement('div');

  element.appendChild(node0);
  await scheduleMicroTask();
  expect(slot.assignedNodes()).toContain(node0);
  slot.remove();
  await scheduleMicroTask();
  expect(node0.parentElement).toBe(element);
});

test('The number of assigned nodes and elements of a slot.', async () => {
  render(document.body, template`
    <div id="test"><v-root>
      <v-slot>
        <v-slot-fallback-content>
          Text
          <div></div>
        </v-slot-fallback-content>
      </v-slot>
    </v-root></div>
  `);

  const element = document.getElementById('test')!;
  const slot = element.querySelector('v-slot')!;

  expect(slot.assignedNodes().length).toBe(0);
  expect(slot.assignedNodes({flatten: true}).length).toBe(3);
  expect(slot.assignedElements().length).toBe(0);
  expect(slot.assignedElements({flatten: true}).length).toBe(1);

  const node = document.createElement('div');
  element.appendChild(node);

  await scheduleMicroTask();

  const numberOfAssignedNodes = slot.assignedNodes().length;
  const numberOfAssignedNodesFlattened = slot.assignedNodes({flatten: true}).length;
  const numberOfAssignedElements = slot.assignedElements().length;
  const numberOfAssignedElementsFlattend = slot.assignedElements({flatten: true}).length;

  expect(numberOfAssignedNodes).toBe(1);
  expect(numberOfAssignedNodesFlattened).toEqual(numberOfAssignedNodes);
  expect(numberOfAssignedElements).toBe(1);
  expect(numberOfAssignedElementsFlattend).toEqual(numberOfAssignedElements);
});
