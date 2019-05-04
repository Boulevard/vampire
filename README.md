# Vampire

Slots without shadows.

* [License](#license)
* [Installation](#installation)
* [Example](#example)

## License

This software is provided free of charge and without restriction under the
[MIT License](LICENSE.md).

## Installation

This module is installable through npm.

```
npm install --save @boulevard/vampire
```

## Example

This example uses LitElement; however, LitElement is not required to use this
module.

```typescript
import '@boulevard/vampire';
import { render } from 'lit-html';
import { customElement, html, LitElement } from 'lit-element';

const WithSlots = (BaseClass: typeof LitElement) => class extends BaseClass {
  static render = render;

  constructor() {
    super();
    this.appendChild(this.renderRoot);
  }

  createRenderRoot() {
    return document.createElement('v-root');
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

Given the following markup

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
