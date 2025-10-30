import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { ReactNode } from "react";
import SidebarWrapper from "@/lib/utils/sidebarWrapper";
import ReduxProvider from "@/providers/ReduxProvider";
import { MSWInit } from "./msw_init";
import ClientSeedProvider from "@/lib/utils/clientSeedProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full w-full bg-white">
        <MSWInit />
        <ReduxProvider>
          <ClientSeedProvider>
            <Theme>
              <SidebarWrapper>{children}</SidebarWrapper>
            </Theme>
          </ClientSeedProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
