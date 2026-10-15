
import {
  PanelLeft,
  Search,
  Sparkles,
  Code2,
  ChevronDown,
  X,
} from "lucide-react";

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar({
  onToggleSidebar = () => {},
  onOpenAI = () => {},
  onSearch = () => {},
  noteTitle = "Select a note",
}) {
  const { user, isAuthenticated } = useContext(AuthContext);

  const [searchValue, setSearchValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const username = user?.username || "";
  const avatarLetter = username
    ? username.charAt(0).toUpperCase()
    : "U";

  function handleSearchChange(event) {
    const value = event.target.value;
    setSearchValue(value);
    onSearch(value);
  }

  return (
    <header className="relative z-30 flex h-16 w-full shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-3 sm:h-[76px] sm:gap-4 sm:px-5 lg:px-6">
      
      <button
        type="button"
        aria-label="Toggle sidebar"
        onClick={onToggleSidebar}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-600 transition hover:bg-violet-50 hover:text-violet-600"
      >
        <PanelLeft size={21} />
      </button>

      <div className="hidden h-6 w-px shrink-0 bg-gray-200 sm:block" />

      {/* Breadcrumb */}
      <div className="hidden min-w-0 max-w-[220px] items-center gap-2 sm:flex">
        <span className="shrink-0 text-sm text-gray-500">
          Notes
        </span>

        <span className="text-gray-300">/</span>

        <span
          className="truncate text-sm font-medium text-gray-900"
          title={noteTitle}
        >
          {noteTitle}
        </span>
      </div>

      <div className="flex-1" />

      
      <div className="hidden w-full max-w-[320px] items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 transition focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 sm:flex">
        <Search
          size={17}
          className="shrink-0 text-gray-400"
        />

        <input
          type="search"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search notes..."
          aria-label="Search notes"
          className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
        />

        {searchValue && (
          <button
            type="button"
            onClick={() => {
              setSearchValue("");
              onSearch("");
            }}
            aria-label="Clear search"
            className="shrink-0 text-gray-400 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        )}
      </div>

     
      <button
        type="button"
        aria-label="Open search"
        onClick={() => setShowSearch((previous) => !previous)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-violet-50 hover:text-violet-600 sm:hidden"
      >
        {showSearch ? <X size={20} /> : <Search size={20} />}
      </button>

      {/* AI Agent */}
      <button
        type="button"
        onClick={onOpenAI}
        className="hidden shrink-0 items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 transition hover:border-violet-200 hover:bg-violet-50 md:flex"
      >
        <Sparkles size={16} className="text-violet-600" />
        AI Agent
      </button>

     
      <a
        href="https://github.com"
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
        className="hidden shrink-0 rounded-xl border border-gray-200 p-2.5 text-gray-600 transition hover:bg-gray-50 sm:block"
      >
        <Code2 size={18} />
      </a>

     
      <div className="relative shrink-0">
        <button
          type="button"
          aria-label="Account menu"
          aria-expanded={showAccountMenu}
          onClick={() =>
            setShowAccountMenu((previous) => !previous)
          }
          className="flex items-center gap-1.5 rounded-xl p-1 transition hover:bg-gray-50 sm:gap-2"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
            {isAuthenticated ? avatarLetter : "U"}
          </span>

          <ChevronDown
            size={15}
            className="text-gray-500"
          />
        </button>

        {showAccountMenu && (
          <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
            <p className="truncate text-sm font-semibold text-gray-800">
              {username || "Guest"}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {isAuthenticated
                ? "Personal workspace"
                : "Not signed in"}
            </p>

            <button
              type="button"
              onClick={() => setShowAccountMenu(false)}
              className="mt-3 w-full rounded-lg px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
            >
              Close menu
            </button>
          </div>
        )}
      </div>

      
      {showSearch && (
        <div className="absolute left-0 right-0 top-full border-b border-gray-200 bg-white p-3 shadow-md sm:hidden">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 focus-within:border-violet-400">
            <Search
              size={18}
              className="shrink-0 text-gray-400"
            />

            <input
              autoFocus
              type="search"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search notes..."
              aria-label="Search notes"
              className="w-full min-w-0 bg-transparent text-sm outline-none"
            />

            {searchValue && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setSearchValue("");
                  onSearch("");
                }}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
