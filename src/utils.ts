export function toggleClass(element: HTMLElement, className: string, state?: boolean): boolean {
  let addClass = typeof state === 'boolean'
    ? state
    : !element.classList.contains(className);

  if (addClass) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }

  return addClass;
}
