"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    __MSW_READY__?: boolean;
    __ON_MSW_READY__?: () => void;
  }
}

export function MSWInit() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      import("../services/msw/browser").then(({ worker }) =>
        worker.start().then(() => {
          window.__MSW_READY__ = true;
          if (window.__ON_MSW_READY__) window.__ON_MSW_READY__();
        })
      );
    }
  }, []);
  return null;
}
