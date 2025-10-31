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
  // (Optional) Get pathname for active state
  // const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-emerald-900 bg-opacity-30 lg:hidden transition-opacity duration-300",
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
          "fixed z-50 top-14 left-0 w-64 h-[calc(100vh-56px)]",
          "bg-linear-to-b from-emerald-50 to-white border-r shadow-xl flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        {/* Close button on mobile */}
        <div className="flex items-center justify-between px-4 py-4 lg:hidden border-b">
          <span className="font-extrabold text-2xl tracking-tight text-emerald-700 drop-shadow-sm">
            TalentHunt
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-2 rounded hover:bg-emerald-100 transition"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              className="text-emerald-700"
            >
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
          {navOptions.map(({ label, icon: Icon, href }) => {
            // Example active logic (uncomment if you use router):
            // const isActive = pathname === href;
            const isActive = false; // Replace with real logic
            return (
              <Link
                key={label}
                href={href}
                className={clsx(
                  "flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors duration-200",
                  isActive
                    ? "bg-emerald-100 text-emerald-700 shadow"
                    : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700",
                  "group"
                )}
                onClick={onClose}
              >
                <Icon
                  size={20}
                  className={clsx(
                    isActive
                      ? "text-emerald-600"
                      : "text-gray-400 group-hover:text-emerald-600 transition-colors"
                  )}
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        {/* Footer (optional) */}
        <div className="hidden lg:block px-4 py-4 border-t text-xs text-gray-400">
          © {new Date().getFullYear()} TalentHunt. All rights reserved.
        </div>
      </aside>
    </>
  );
}
