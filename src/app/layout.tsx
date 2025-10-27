import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { ReactNode } from "react";
import SidebarWrapper from "@/lib/utils/sidebarWrapper";

export default function RootLayout({ children }: { children: ReactNode }) {
  // Sidebar state must be in a client component, so use a wrapper
  return (
    <html lang="en" className="h-full">
      <body className="h-full w-full bg-white">
        <Theme>
          <SidebarWrapper>{children}</SidebarWrapper>
        </Theme>
      </body>
    </html>
  );
}
