
import {
  PanelLeft,
  Search,
  Sparkles,
  Code2,
  ChevronDown,
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function Navbar() {


  const { user, isAuthenticated } = useContext(AuthContext);
  

  return (
    <header className="flex h-[76px] shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-6">
      <button
        type="button"
        aria-label="Toggle sidebar"
        className="text-gray-600 hover:text-violet-600"
      >
        <PanelLeft size={20} />
      </button>

      <div className="h-6 w-px bg-gray-200" />

      <div className="hidden items-center gap-2 text-sm text-gray-500 sm:flex">
        <span>Notes</span>
        <span>/</span>
        <span className="font-medium text-gray-900">
          Select a note
        </span>
      </div>

      <div className="flex-1" />

      <div className="flex w-full max-w-[250px] items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5">
        <Search size={17} className="text-gray-400" />

        <input
          type="search"
          placeholder="Search notes..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      <button className="hidden items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 md:flex">
        <Sparkles size={16} className="text-violet-600" />
        AI Agent
      </button>

      <a
        href="https://github.com"
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
        className="hidden rounded-xl border border-gray-200 p-2.5 text-gray-600 hover:bg-gray-50 sm:block"
      >
        <Code2 size={18} />
      </a>

      <button
        type="button"
        aria-label="Account menu"
        className="flex items-center gap-2"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-sm font-medium text-white">
          {isAuthenticated &&
             user.username.charAt(0).toUpperCase()
         }
        </span>

        <ChevronDown size={15} className="text-gray-500" />
      </button>
    </header>
  );
}
