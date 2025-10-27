import { LayoutDashboard, Briefcase, Users, FileText } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

const navOptions = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Jobs", icon: Briefcase, href: "/jobs" },
  { label: "Candidates", icon: Users, href: "/candidates" },
  { label: "Assessments", icon: FileText, href: "/assessments" },
];

export default function AppSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black bg-opacity-30 lg:hidden transition-opacity",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed z-50 top-14 left-0 w-64 h-[calc(100vh-56px)] bg-white border-r shadow-lg flex flex-col transition-transform",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        {/* Close button on mobile */}
        <div className="flex items-center justify-between px-4 py-4 lg:hidden">
          <span className="font-bold text-xl text-blue-700">TalentHunt</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-2 rounded hover:bg-gray-100"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navOptions.map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 px-4 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium"
              onClick={onClose}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
