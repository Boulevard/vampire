# Vampire 🧛‍♂️

Slots without shadows.

* [Installation](#installation)
* [Examples](#examples)
* [API Documentation](#api-documentation)
* [Browser Support](#browser-Support)
* [Caveats](#caveats)

## Installation

This module is installable through npm.

```
npm install --save @boulevard/vampire
```

## Examples

#### Basic Example

This example demonstrates moving content to a nameless slot.

```html
<script type="module" src="https://unpkg.com/@boulevard/vampire@1.0.0-beta.2/dist/index.js"></script>
<script>
  const div = Object.assign(document.createElement('div'), {
    innerHTML: `
      <v-root>
        <h4>Example</h4>
        <v-slot></v-slot>
      </v-root>
    `
  });

  div.appendChild(document.createTextNode('👻'));
</script>
```

The above script will produce the following output.

```html
<div>
  <v-root>
    <h4>Example</h4>
    <v-slot>
      <v-slot-assigned-content>
        👻
      </v-slot-assigned-content>
    </v-slot>
  </v-root>
</div>
```

#### Example Using LitElement

Slots are most useful when combined with custom elements. This is example shows
how easy it is to use Vampire with LitElement.

```typescript
import '@boulevard/vampire';
import { render } from 'lit-html';
import { customElement, html, LitElement } from 'lit-element';

const WithSlots = (BaseClass: typeof LitElement) => class extends BaseClass {
  static render = render;

  createRenderRoot() {
    return document.createElement('v-root');
  }

  connectedCallback() {
    if (!this.renderRoot.parentElement) {
      this.appendChild(this.renderRoot);
    }

    super.connectedCallback();
  }
}

@customElement('x-example')
export class ExampleElement extends WithSlots(LitElement) {
  render() {
    return html`
      <h5>Example</h5>
      <v-slot></v-slot>
    `;
  }
}
```

Given the following markup.

```html
<x-example>
  This content will be slotted.
<x-example>
```

The above component will produce the following output when rendered.

```html
<x-example>
  <v-root>
    <h5>Example</h5>
    <v-slot>
      <v-slot-assigned-content>
        This content will be slotted.
      </v-slot-assigned-content>
    </v-slot>
  </v-root>
<x-example>
```

#### Simple Todo List App

https://stackblitz.com/edit/typescript-uykxn4

## API Documentation

Vampire is distributed in ES2015 module format.

### VampireRoot

A `VampireRoot` is the root node of a DOM subtree.

### VampireSlot

A `VampireSlot` marks the insertion point of foreign content.

#### Properties

```typescript
VampireSlot::name: string = '';
```

A slot may be given a name so that it can be targeted.

#### Methods

```typescript
VampireSlot::assignedElements(options?: {flatten?: boolean}): Element[];
```

Returns the elements assigned to this slot. If the `flatten` option is set to
`true` it will return fallback content if, and only if, there is no assigned
content, otherwise it will still return the assigned content.

```typescript
VampireSlot::assignedNodes(options?: {flatten?: boolean}): Node[];
```

Returns the nodes assigned to this slot. If the `flatten` option is set to
`true` it will return fallback content if, and only if, there is no assigned
content, otherwise it will still return the assigned content.

**Example**

```html
<div>
  <v-root>
    <v-slot></v-slot>
    <v-slot name="second-slot"></v-slot>
  </v-root>
  <div>This will be moved to the default slot</div>
  <div v-slot="second-slot">This will be moved to the second slot.</div>
</div>
```

#### Events

```typescript
interface ISlotChangeEvent extends CustomEvent {
  readonly type = 'v::slotchange';
  readonly bubbles = true;
}
```

The `v::slotchange` event is fired when the slot's assigned content changes.

**Example**

```typescript
slot.addEventListener('v::slotchange', (event: Event) => {
  console.log(event.target.assignedNodes());
});
```

### VampireSlotFallbackContent

Allows fallback content to be assigned to a slot.

**Example**

```html
<v-slot>
  <v-slot-fallback-content>
    This will be rendered if no content is assigned to this slot.
  </v-slot-fallback-content>
</v-slot>
```

## Browser Support

The last 2 versions of all modern browsers are supported. In addition, IE 11 is
also supported.

IE 11 requires a custom elements polyfill as well as a `CustomEvent` constructor
polyfill.

## Caveats

* A `VampireRoot` cannot be a direct ancestor of a `VampireRoot`.
* Empty `Text` nodes will be assign to a slot and will prevent fallback content
from being rendered.
* Fallback content cannot contain more slots.
* IE and Edge do not support `display: contents`. If you need to support these
browsers you'll need to account for the extra elements when doing layout.
