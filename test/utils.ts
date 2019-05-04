export function noop() {

}

// @ts-ignore
export function scheduleMicroTask<T extends () => any>(task: T = noop): Promise<ReturnType<T>> {
  return Promise.resolve().then(task);
}
