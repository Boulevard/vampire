function clearElementContent(element: HTMLElement) {
  element.childNodes.forEach(child => element.removeChild(child));
}

export function noop() {

}

export function render(parent: HTMLElement, element: Element) {
  clearElementContent(parent);

  if (element instanceof HTMLTemplateElement) {
    parent.appendChild(document.importNode(element.content, true));
  } else {
    parent.appendChild(element);
  }
}

// @ts-ignore
export async function scheduleMicroTask<T extends () => any>(task: T = noop): Promise<ReturnType<T>> {
  await Promise.resolve().then(task);
}

export function template(strings: TemplateStringsArray, ...values: any[]): HTMLTemplateElement {
  return Object.assign(document.createElement('template'), {
    innerHTML: strings.join('')
  });
}
