
import { useContext, useState } from "react";
import {
  Command,
  Folder,
  FolderOpen,
  Heart,
  Tag,
  Plus,
  Pencil,
  ChevronRight,
  Sparkles,
  Trash2,
  Settings,
  X,
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useContext(AuthContext);

  
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);

  
  const handleAddFolder = (e) => {
    e.preventDefault();

    const name = folderName.trim();

    
    if (!name) return;

    
    const exists = folders.some(
      (folder) =>
        folder.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      alert("Folder already exists!");
      return;
    }

    
    const newFolder = {
      id: crypto.randomUUID(),
      name: name,
      color: "text-violet-500",
    };

    setFolders((prevFolders) => [...prevFolders, newFolder]);

    
    setFolderName("");
    setShowFolderInput(false);
  };

  
  const handleCancelFolder = () => {
    setFolderName("");
    setShowFolderInput(false);
  };

  return (
    <aside className="flex h-full min-h-0 w-[260px] shrink-0 flex-col border-r border-gray-200 bg-[#fafafa]">

      {/* Logo */}
      <div className="flex h-[76px] items-center gap-3 border-b border-gray-100 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
          <Command size={22} />
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900">
            NotesKeeper <span className="text-violet-600">AI</span>
          </h1>
          <p className="text-xs text-gray-500">
            Your AI notetaker
          </p>
        </div>
      </div>

      {/* Folders heading */}
      <div className="flex items-center justify-between px-5 pb-3 pt-7">
        <h2 className="text-sm font-medium text-gray-500">
          Folders
        </h2>

        <div className="flex items-center gap-3 text-gray-500">
          <button
            type="button"
            aria-label="Edit folders"
            className="hover:text-violet-600"
            title="Edit folders"
            onClick={() => {
              if (folders.length === 0) {
                alert("Create a folder first!");
              } else {
                alert("Folder editing will be added next.");
              }
            }}
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            aria-label="Add folder"
            title="Add folder"
            onClick={() => setShowFolderInput(true)}
            className="hover:text-violet-600"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

    
      {showFolderInput && (
        <form
          onSubmit={handleAddFolder}
          className="mx-3 mb-3 rounded-xl border border-violet-200 bg-white p-3"
        >
          <label
            htmlFor="folderName"
            className="mb-2 block text-xs font-medium text-gray-600"
          >
            New folder name
          </label>

          <input
            id="folderName"
            type="text"
            autoFocus
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="e.g. Programming"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleCancelFolder}
              className="rounded-lg px-3 py-2 text-xs text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white hover:bg-violet-700"
            >
              Create folder
            </button>
          </div>
        </form>
      )}

      
      <div className="space-y-1 px-3">
        {folders.map((folder) => (
          <button
            key={folder.id}
            type="button"
            onClick={() => console.log("Selected folder:", folder.name)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-gray-700 transition hover:bg-violet-50"
          >
            <Folder size={19} className={folder.color} />

            <span className="flex-1 truncate">
              {folder.name}
            </span>

            <ChevronRight size={17} className="text-gray-400" />
          </button>
        ))}

        {!showFolderInput && folders.length === 0 && (
          <p className="px-3 py-3 text-xs text-gray-400">
            No folders yet. Click + to create one.
          </p>
        )}
      </div>

     
      <div className="mt-8 px-5">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
          Workspace
        </p>

        <nav className="space-y-1">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg bg-violet-100 px-3 py-3 text-sm font-medium text-violet-700"
          >
            <FolderOpen size={19} />
            My Notes
          </button>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-600 hover:bg-gray-100"
          >
            <Heart size={19} />
            Favorites
          </button>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-600 hover:bg-gray-100"
          >
            <Tag size={19} />
            Tags
          </button>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-600 hover:bg-gray-100"
          >
            <Sparkles size={19} />
            AI Assistant
          </button>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-600 hover:bg-gray-100"
          >
            <Trash2 size={19} />
            Trash
          </button>
        </nav>
      </div>

    
      <div className="mt-auto border-t border-gray-200 p-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-gray-100"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-700">
            {user?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-800">
              {user?.username || "My Account"}
            </p>
            <p className="text-xs text-gray-500">
              Personal workspace
            </p>
          </div>

          <Settings size={17} className="text-gray-400" />
        </button>
      </div>
    </aside>
  );
}
