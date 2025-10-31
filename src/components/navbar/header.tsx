"use client";
import { Menu } from "lucide-react";

export default function Header({
  onSidebarOpen,
}: {
  onSidebarOpen: () => void;
}) {
  return (
    <nav className="fixed top-0 left-0 w-full h-14 flex items-center justify-between px-6 bg-linear-to-b from-emerald-50 to-white/90 border-b shadow-md backdrop-blur z-50">
      <div className="flex items-center space-x-3">
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={onSidebarOpen}
          className="lg:hidden p-2 rounded hover:bg-emerald-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 transition"
        >
          <Menu size={24} className="text-emerald-700" />
        </button>
        <span className="font-extrabold text-2xl tracking-tight text-emerald-700 hidden lg:inline select-none">
          TalentHunt
        </span>

        <span className="hidden lg:inline h-5 w-px bg-emerald-100 mx-4" />
      </div>
      <div className="text-emerald-700 font-medium tracking-wide text-base drop-shadow-sm">
        HR Platform
      </div>
    </nav>
  );
}
