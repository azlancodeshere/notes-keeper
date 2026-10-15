
import { useEffect, useRef, useState } from "react";
import {
  Check,
  Clock,
  FileText,
  Folder,
  Heart,
  LoaderCircle,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import AIAgent from "../components/AIAgent";
import api from "../api/api";

function getNoteFromResponse(data) {
  return data?.note || data?.data || data;
}

export default function NoteEditor({
  noteId,
  onClose,
  onNoteUpdated,
}) {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [mobileAiOpen, setMobileAiOpen] = useState(false);

  const requestVersion = useRef(0);
  const savedSnapshot = useRef("");

  
  useEffect(() => {
    if (!noteId) {
      setNote(null);
      setError("");
      setLoading(false);
      setMobileAiOpen(false);
      savedSnapshot.current = "";
      return;
    }

    let cancelled = false;
    const version = ++requestVersion.current;

    async function fetchNote() {
      setLoading(true);
      setError("");
      setNote(null);
      setMobileAiOpen(false);
      savedSnapshot.current = "";

      try {
        const response = await api.get(
          `/notes/getSingle-notes/${noteId}`
        );

        const result = getNoteFromResponse(response.data);

        if (cancelled || version !== requestVersion.current) {
          return;
        }

        const loadedNote = {
          ...result,
          id: result?._id || result?.id || noteId,
          title: result?.title || "",
          content: result?.content || "",
        };

        savedSnapshot.current = JSON.stringify({
          title: loadedNote.title,
          content: loadedNote.content,
        });

        setNote(loadedNote);
        setFavorite(Boolean(result?.favorite));
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Note load nahi hua. API endpoint check karo."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchNote();

    return () => {
      cancelled = true;
    };
  }, [noteId]);

  // Automatically save title and content after typing stops.
  useEffect(() => {
    if (!note?.id) return;

    const snapshot = JSON.stringify({
      title: note.title,
      content: note.content,
    });

    if (snapshot === savedSnapshot.current) return;

    const currentNote = { ...note };
    let cancelled = false;

    const timer = setTimeout(async () => {
      setSaving(true);
      setError("");

      try {
        await api.patch(
          `/notes/edit-notes/${currentNote.id}`,
          {
            title: currentNote.title,
            content: currentNote.content,
          }
        );

        if (cancelled) return;

        savedSnapshot.current = snapshot;
        onNoteUpdated?.(currentNote);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Save nahi hua. Backend update route check karo."
          );
        }
      } finally {
        if (!cancelled) setSaving(false);
      }
    }, 700);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [note?.id, note?.title, note?.content]);

 
  useEffect(() => {
    if (!mobileAiOpen) return;

    function handleEscape(event) {
      if (event.key === "Escape") {
        setMobileAiOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileAiOpen]);

  async function deleteCurrentNote() {
    if (!note?.id) return;

    const confirmed = window.confirm(
      `Delete "${note.title || "Untitled"}"?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/notes/delete-notes/${note.id}`);
      setMobileAiOpen(false);
      onClose?.();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Note delete nahi hua."
      );
    }
  }

 
  if (!noteId) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center bg-white px-5 py-10 sm:p-6">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <FileText size={26} />
          </div>

          <h2 className="mt-4 text-xl font-semibold text-gray-900 sm:text-2xl">
            Your notes, your ideas
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Select a note from the sidebar to start writing.
          </p>
        </div>
      </div>
    );
  }

  
  if (loading) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center bg-white">
        <LoaderCircle
          className="animate-spin text-violet-600"
          size={28}
        />
      </div>
    );
  }

  
  if (error && !note) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center bg-white p-5 text-center sm:p-6">
        <p className="break-words text-sm text-red-500">
          {error}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
        >
          Back to notes
        </button>
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
    
      <header className="flex min-h-14 shrink-0 items-center justify-between gap-2 border-b border-gray-200 px-3 py-2.5 sm:min-h-[64px] sm:px-5 sm:py-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 text-xs text-gray-500 sm:gap-2 sm:text-sm">
          <Folder size={15} className="shrink-0 sm:h-4 sm:w-4" />

          <span className="shrink-0">Notes</span>
          <span className="shrink-0 text-gray-300">/</span>

          <span
            className="truncate font-medium text-gray-800"
            title={note.title || "Untitled"}
          >
            {note.title || "Untitled"}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
         
          <span className="hidden items-center gap-1 text-xs text-gray-400 sm:flex">
            {saving ? (
              <>
                <LoaderCircle
                  size={13}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : error ? (
              <span className="text-red-500">Save failed</span>
            ) : (
              <>
                <Check size={13} />
                Saved
              </>
            )}
          </span>

       
          <button
            type="button"
            onClick={() => setMobileAiOpen(true)}
            aria-label="Open AI Agent"
            className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-violet-200 px-2.5 text-violet-600 transition hover:bg-violet-50 sm:px-3 lg:hidden"
          >
            <Sparkles size={17} />
            <span className="hidden text-sm sm:inline">
              AI Agent
            </span>
          </button>

         
          <button
            type="button"
            onClick={onClose}
            title="Close note"
            aria-label="Close note"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-800"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      
      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        
          <div className="mb-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <span className="flex min-w-0 items-center gap-1.5 text-xs text-gray-500 sm:gap-2">
              <Clock size={14} className="shrink-0" />
              <span>Changes save automatically</span>
            </span>

            <div className="flex shrink-0 items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-gray-400 sm:hidden">
                {saving ? (
                  <LoaderCircle
                    size={13}
                    className="animate-spin"
                  />
                ) : error ? (
                  <X size={13} className="text-red-500" />
                ) : (
                  <Check size={13} />
                )}

                {saving
                  ? "Saving"
                  : error
                    ? "Error"
                    : "Saved"}
              </span>

              <button
                type="button"
                onClick={() => setFavorite((value) => !value)}
                title="Toggle favorite"
                aria-label="Toggle favorite"
                aria-pressed={favorite}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-rose-50 ${
                  favorite
                    ? "text-rose-500"
                    : "text-gray-400 hover:text-rose-500"
                }`}
              >
                <Heart
                  size={18}
                  fill={favorite ? "currentColor" : "none"}
                />
              </button>

              <button
                type="button"
                onClick={deleteCurrentNote}
                title="Delete note"
                aria-label="Delete note"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>

         
          {error && (
            <p
              role="alert"
              className="mb-3 break-words rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          
          <input
            value={note.title}
            onChange={(event) =>
              setNote((previous) => ({
                ...previous,
                title: event.target.value,
              }))
            }
            placeholder="Untitled note"
            aria-label="Note title"
            className="mb-4 w-full min-w-0 border-0 bg-transparent py-1 text-2xl font-bold tracking-tight text-gray-900 outline-none placeholder:text-gray-300 focus:ring-0 sm:mb-5 sm:text-3xl lg:text-4xl"
          />

          <textarea
            value={note.content}
            onChange={(event) =>
              setNote((previous) => ({
                ...previous,
                content: event.target.value,
              }))
            }
            placeholder="Start writing your ideas here..."
            aria-label="Note content"
            className="min-h-[240px] w-full min-w-0 flex-1 resize-y border-0 bg-transparent text-sm leading-7 text-gray-800 outline-none placeholder:text-gray-400 focus:ring-0 sm:min-h-[350px] sm:text-base sm:leading-8"
          />

        
          <footer className="mt-4 flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-4 pb-1 text-xs text-gray-400">
            <span>{(note.content || "").length} characters</span>
            <span>NotesKeeper AI</span>
          </footer>
        </main>

       
        <aside className="hidden h-full min-h-0 w-[300px] shrink-0 border-l border-gray-200 bg-white lg:flex xl:w-[350px]">
          <AIAgent
            note={note}
            variant="sidebar"
          />
        </aside>
      </div>

      
      {mobileAiOpen && (
        <div className="fixed inset-0 z-[60] flex h-dvh min-h-0 flex-col overflow-hidden bg-white lg:hidden">
          <AIAgent
            note={note}
            variant="mobile"
            onClose={() => setMobileAiOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
