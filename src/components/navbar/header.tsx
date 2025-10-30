"use client";
import { Menu } from "lucide-react";

export default function Header({
  onSidebarOpen,
}: {
  onSidebarOpen: () => void;
}) {
  return (
    <nav className="fixed top-0 left-0 w-full h-14 flex items-center justify-between px-6 bg-white border-b shadow z-50">
      <div className="flex items-center space-x-3">
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={onSidebarOpen}
          className="lg:hidden p-2 rounded hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>
        <span className="font-bold text-xl text-blue-700 hidden lg:inline">
          TalentHunt
        </span>
      </div>
      <div className="text-gray-600 font-medium">HR Platform</div>
    </nav>
  );
}
