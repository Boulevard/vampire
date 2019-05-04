export function waitForMutation<T extends HTMLElement>(element: T, options?: MutationObserverInit): Promise<void> {
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      resolve();
      observer.disconnect();
    });

    observer.observe(element, options);
  });
}
