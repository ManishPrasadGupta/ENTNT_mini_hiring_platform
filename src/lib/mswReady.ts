// mswReady.ts
export function waitForMSWReady(): Promise<void> {
  // @ts-ignore
  if (window.__MSW_READY__) return Promise.resolve();
  return new Promise((resolve) => {
    // @ts-ignore
    window.__ON_MSW_READY__ = resolve;
  });
}
