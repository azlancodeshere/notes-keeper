import { useContext, useEffect, useState } from "react";
import {
  Command,
  Folder,
  FolderOpen,
  Plus,
  Pencil,
  ChevronDown,
  ChevronRight,
  Trash2,
  FileText,
  X,
  Heart,
  Tag,
  Sparkles,
  Settings,
} from "lucide-react";

import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

const getId = (item) =>
  item?._id?.toString?.() || item?.id?.toString?.() || "";

const getFolderId = (note) => {
  const folder = note?.folder;
  if (!folder) return "";
  if (typeof folder === "object") return getId(folder);
  return folder.toString();
};

export default function Sidebar({
  selectedNoteId,
  onSelectNote,
}) {
  const { user } = useContext(AuthContext);

  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState({});

  const [folderName, setFolderName] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);

  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState("");

  const [selectedFolder, setSelectedFolder] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [creatingNote, setCreatingNote] = useState(false);
  const [error, setError] = useState("");

  async function fetchFolders() {
    try {
      const response = await api.get("/folders/get-folders");
      const list =
        response.data.folders ||
        response.data.data ||
        [];

      const normalized = list.map((folder) => ({
        ...folder,
        id: getId(folder),
      }));

      setFolders(normalized);

      setExpandedFolders((previous) => {
        const next = { ...previous };
        normalized.forEach((folder) => {
          if (next[folder.id] === undefined) {
            next[folder.id] = true;
          }
        });
        return next;
      });
    } catch (err) {
      console.error(
        "Fetch folders error:",
        err.response?.data || err.message
      );
    }
  }

  async function fetchNotes() {
    try {
      const response = await api.get("/notes/getAll-notes");
      const list =
        response.data.notes ||
        response.data.data ||
        [];

      setNotes(
        list.map((note) => ({
          ...note,
          id: getId(note),
        }))
      );
    } catch (err) {
      console.error(
        "Fetch notes error:",
        err.response?.data || err.message
      );
    }
  }

  useEffect(() => {
    fetchFolders();
    fetchNotes();
  }, []);

  async function handleCreateFolder(event) {
    event.preventDefault();

    const name = folderName.trim();
    if (!name || creatingFolder) return;

    try {
      setCreatingFolder(true);

      const response = await api.post(
        "/folders/create-folder",
        { name }
      );

      const created =
        response.data.folder ||
        response.data.data;

      if (!created) {
        await fetchFolders();
      } else {
        const newFolder = {
          ...created,
          id: getId(created),
        };

        setFolders((previous) => [
          ...previous,
          newFolder,
        ]);

        setExpandedFolders((previous) => ({
          ...previous,
          [newFolder.id]: true,
        }));
      }

      setFolderName("");
      setShowFolderInput(false);
    } catch (err) {
      console.error(
        "Create folder error:",
        err.response?.data || err.message
      );

      window.alert(
        err.response?.data?.message ||
          "Folder create nahi hua."
      );
    } finally {
      setCreatingFolder(false);
    }
  }

  async function handleRenameFolder(event) {
    event.preventDefault();

    const name = editingFolderName.trim();
    if (!name || !editingFolderId) return;

    try {
      const response = await api.patch(
        `/folders/${editingFolderId}`,
        { name }
      );

      const updated =
        response.data.folder ||
        response.data.data ||
        {};

      setFolders((previous) =>
        previous.map((folder) =>
          folder.id === editingFolderId
            ? { ...folder, ...updated, id: folder.id, name }
            : folder
        )
      );

      setEditingFolderId(null);
      setEditingFolderName("");
    } catch (err) {
      window.alert(
        err.response?.data?.message ||
          "Folder rename nahi hua. Backend route check karo."
      );
    }
  }

  async function handleDeleteFolder(folderId) {
    if (
      !window.confirm(
        "Are you sure you want to delete this folder?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/folders/${folderId}`);

      setFolders((previous) =>
        previous.filter((folder) => folder.id !== folderId)
      );

      await fetchNotes();
    } catch (err) {
      window.alert(
        err.response?.data?.message ||
          "Folder delete nahi hua."
      );
    }
  }

  function openNewNoteForm(folder) {
    setSelectedFolder(folder);
    setNoteTitle("");
    setError("");
    setShowNoteInput(true);
  }

  async function handleCreateNote(event) {
    event.preventDefault();

    const title = noteTitle.trim();

    if (!title) {
      setError("Note title enter karo.");
      return;
    }

    if (!selectedFolder || creatingNote) return;

    try {
      setCreatingNote(true);
      setError("");

      const response = await api.post(
        "/notes/create-note",
        {
          title,
          content: "",
          folder: selectedFolder.id,
        }
      );

      const created =
        response.data.note ||
        response.data.data ||
        response.data;

      const noteId = getId(created);

      if (!noteId) {
        throw new Error(
          "Backend response mein note ID nahi mili."
        );
      }

      const newNote = {
        ...created,
        id: noteId,
        title: created.title || title,
        content: created.content || "",
        folder: created.folder || selectedFolder.id,
      };

      setNotes((previous) => [
        newNote,
        ...previous.filter((note) => note.id !== noteId),
      ]);

      setExpandedFolders((previous) => ({
        ...previous,
        [selectedFolder.id]: true,
      }));

      setShowNoteInput(false);
      setSelectedFolder(null);
      setNoteTitle("");

      
      onSelectNote?.(noteId);
    } catch (err) {
      console.error(
        "Create note error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Note create nahi hua."
      );
    } finally {
      setCreatingNote(false);
    }
  }

  async function handleDeleteNote(note) {
    if (
      !window.confirm(
        `Delete "${note.title || "Untitled"}"?`
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/notes/delete-notes/${note.id}`
      );

      setNotes((previous) =>
        previous.filter((item) => item.id !== note.id)
      );

      if (
        String(selectedNoteId) === String(note.id)
      ) {
        onSelectNote?.(null);
      }
    } catch (err) {
      window.alert(
        err.response?.data?.message ||
          "Note delete nahi hua."
      );
    }
  }

  return (
    <aside className="flex h-full min-h-0 w-[280px] shrink-0 flex-col border-r border-gray-200 bg-[#fafafa]">
      <div className="flex h-[76px] shrink-0 items-center gap-3 border-b border-gray-100 px-5">
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

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-5 pb-3 pt-7">
          <h2 className="text-sm font-medium text-gray-500">
            Folders
          </h2>

          <button
            type="button"
            title="Create folder"
            onClick={() => setShowFolderInput(true)}
            className="rounded-md p-1 text-gray-500 hover:bg-violet-50 hover:text-violet-600"
          >
            <Plus size={19} />
          </button>
        </div>

        {showFolderInput && (
          <form
            onSubmit={handleCreateFolder}
            className="mx-3 mb-3 rounded-xl border border-violet-200 bg-white p-3"
          >
            <input
              autoFocus
              value={folderName}
              onChange={(event) =>
                setFolderName(event.target.value)
              }
              placeholder="Folder name..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-500"
            />

            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowFolderInput(false);
                  setFolderName("");
                }}
                className="rounded-lg px-3 py-2 text-xs text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={creatingFolder}
                className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
              >
                {creatingFolder ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        )}

        {showNoteInput && (
          <div className="mx-3 mb-3 rounded-xl border border-violet-200 bg-white p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-800">
                New note
                {selectedFolder
                  ? ` in ${selectedFolder.name}`
                  : ""}
              </p>

              <button
                type="button"
                onClick={() => {
                  setShowNoteInput(false);
                  setSelectedFolder(null);
                  setNoteTitle("");
                  setError("");
                }}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateNote}>
              <input
                autoFocus
                maxLength={150}
                value={noteTitle}
                onChange={(event) =>
                  setNoteTitle(event.target.value)
                }
                placeholder="Enter note title..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-500"
              />

              {error && (
                <p className="mt-2 text-xs text-red-500">
                  {error}
                </p>
              )}

              <div className="mt-3 flex gap-2">
                <button
                  type="submit"
                  disabled={creatingNote}
                  className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
                >
                  {creatingNote ? "Creating..." : "Create note"}
                </button>

                <button
                  type="button"
                  disabled={creatingNote}
                  onClick={() => {
                    setShowNoteInput(false);
                    setSelectedFolder(null);
                    setNoteTitle("");
                    setError("");
                  }}
                  className="rounded-lg px-3 py-2 text-xs text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-1 px-3">
          {folders.map((folder) => {
            const folderNotes = notes.filter(
              (note) =>
                getFolderId(note) === folder.id
            );

            const expanded =
              !!expandedFolders[folder.id];

            return (
              <div key={folder.id}>
                {editingFolderId === folder.id ? (
                  <form
                    onSubmit={handleRenameFolder}
                    className="rounded-lg border border-violet-200 bg-white p-2"
                  >
                    <input
                      autoFocus
                      value={editingFolderName}
                      onChange={(event) =>
                        setEditingFolderName(event.target.value)
                      }
                      className="w-full rounded-md border border-gray-200 px-2 py-2 text-sm outline-none focus:border-violet-500"
                    />

                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingFolderId(null)}
                        className="px-2 py-1 text-xs text-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-md bg-violet-600 px-3 py-1 text-xs text-white"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="group flex items-center gap-1 rounded-lg px-2 py-3 hover:bg-violet-50">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedFolders((previous) => ({
                            ...previous,
                            [folder.id]: !previous[folder.id],
                          }))
                        }
                        className="flex min-w-0 flex-1 items-center gap-3 text-left text-sm text-gray-700"
                      >
                        {expanded ? (
                          <FolderOpen
                            size={19}
                            className="shrink-0 text-violet-500"
                          />
                        ) : (
                          <Folder
                            size={19}
                            className="shrink-0 text-violet-500"
                          />
                        )}

                        <span className="flex-1 truncate">
                          {folder.name}
                        </span>
                      </button>

                      <button
                        type="button"
                        title="Add note"
                        onClick={() =>
                          openNewNoteForm(folder)
                        }
                        className="rounded-md p-1.5 text-gray-500 hover:bg-white hover:text-violet-600"
                      >
                        <Plus size={16} />
                      </button>

                      <button
                        type="button"
                        title="Rename folder"
                        onClick={() => {
                          setEditingFolderId(folder.id);
                          setEditingFolderName(folder.name);
                        }}
                        className="rounded-md p-1.5 text-gray-500 hover:bg-white hover:text-violet-600"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        type="button"
                        title="Delete folder"
                        onClick={() =>
                          handleDeleteFolder(folder.id)
                        }
                        className="rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>

                      <button
                        type="button"
                        title="Expand/collapse"
                        onClick={() =>
                          setExpandedFolders((previous) => ({
                            ...previous,
                            [folder.id]: !previous[folder.id],
                          }))
                        }
                        className="rounded p-1 text-gray-400"
                      >
                        {expanded ? (
                          <ChevronDown size={15} />
                        ) : (
                          <ChevronRight size={15} />
                        )}
                      </button>
                    </div>

                    {expanded && (
                      <div className="ml-5 space-y-1 border-l border-gray-200 pl-3">
                        {folderNotes.map((note) => {
                          const active =
                            String(selectedNoteId) ===
                            String(note.id);

                          return (
                            <div
                              key={note.id}
                              className={`group/note flex items-center gap-1 rounded-lg px-2 py-2 ${
                                active
                                  ? "bg-violet-100 text-violet-700"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  onSelectNote?.(note.id)
                                }
                                className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm"
                              >
                                <FileText
                                  size={16}
                                  className="shrink-0"
                                />
                                <span className="truncate">
                                  {note.title || "Untitled"}
                                </span>
                              </button>

                              <button
                                type="button"
                                title="Delete note"
                                onClick={() =>
                                  handleDeleteNote(note)
                                }
                                className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          );
                        })}

                        {folderNotes.length === 0 && (
                          <p className="px-2 py-2 text-xs text-gray-400">
                            No notes yet
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}

          {folders.length === 0 && (
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
              onClick={() => onSelectNote?.(null)}
              className="flex w-full items-center gap-3 rounded-lg bg-violet-100 px-3 py-3 text-sm font-medium text-violet-700"
            >
              <FolderOpen size={19} />
              My Notes
            </button>

            <div className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-500">
              <Heart size={19} />
              Favorites
            </div>

            <div className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-500">
              <Tag size={19} />
              Tags
            </div>

            <div className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-500">
              <Sparkles size={19} />
              AI Assistant
            </div>
          </nav>
        </div>
      </div>

      <div className="shrink-0 border-t border-gray-200 p-4">
        <div className="flex items-center gap-3 rounded-lg p-2">
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
        </div>
      </div>
    </aside>
  );
}



dsfrhJHEghydyFDJYgfehwEGwjhkjhwqYWFGEQWeqfghegEF