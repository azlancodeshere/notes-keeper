import { useEffect, useRef, useState } from "react";
import {
  Check,
  Clock,
  FileText,
  Folder,
  Heart,
  LoaderCircle,
  Trash2,
  X,
} from "lucide-react";

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

  const requestVersion = useRef(0);

  useEffect(() => {
    if (!noteId) {
      setNote(null);
      setError("");
      return;
    }

    let cancelled = false;
    const version = ++requestVersion.current;

    async function fetchNote() {
      setLoading(true);
      setError("");
      setNote(null);

      try {
        const response = await api.get(
          `/notes/getSingle-notes/${noteId}`
        );

        const result = getNoteFromResponse(response.data);

        if (cancelled || version !== requestVersion.current) {
          return;
        }

        setNote({
          ...result,
          id: result._id || result.id || noteId,
          title: result.title || "",
          content: result.content || "",
        });

        setFavorite(Boolean(result.favorite));
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

  useEffect(() => {
    if (!note?.id) return;

    const id = note.id;
    const title = note.title;
    const content = note.content;

    const timer = setTimeout(async () => {
      setSaving(true);
      setError("");

      try {
        const response = await api.patch(
          `/notes/edit-notes/${id}`,
          { title, content }
        );

        const result = getNoteFromResponse(response.data);

        onNoteUpdated?.({
          ...note,
          ...result,
          id,
          title,
          content,
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Save nahi hua. Backend update route check karo."
        );
      } finally {
        setSaving(false);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [note?.id, note?.title, note?.content]);

  async function deleteCurrentNote() {
    if (!note?.id) return;

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
      <div className="flex min-h-0 flex-1 items-center justify-center bg-white p-8">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <FileText size={26} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Your notes, your ideas
          </h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <LoaderCircle
          className="animate-spin text-violet-600"
          size={28}
        />
      </div>
    );
  }

  if (error && !note) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center p-8 text-center">
        <p className="text-sm text-red-500">{error}</p>
        <button
          onClick={onClose}
          className="mt-4 rounded-lg border px-4 py-2 text-sm"
        >
          Back to notes
        </button>
      </div>
    );
  }

  if (!note) return null;

  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-white p-5 md:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Folder size={15} />
          <span>My Notes</span>
          <span>/</span>
          <span>Editing</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            {saving ? (
              <>
                <LoaderCircle
                  size={13}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : error ? (
              <span className="text-red-500">{error}</span>
            ) : (
              <>
                <Check size={13} />
                Saved
              </>
            )}
          </span>

          <button
            type="button"
            onClick={() => setFavorite((value) => !value)}
            title="Toggle favorite (UI only)"
            className={
              favorite
                ? "text-rose-500"
                : "text-gray-400 hover:text-rose-500"
            }
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
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 size={17} />
          </button>

          <button
            type="button"
            onClick={onClose}
            title="Close editor"
            className="text-gray-400 hover:text-gray-800"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <input
        value={note.title}
        onChange={(event) =>
          setNote((previous) => ({
            ...previous,
            title: event.target.value,
          }))
        }
        placeholder="Untitled note"
        className="mb-4 w-full bg-transparent text-3xl font-bold tracking-tight text-gray-900 outline-none placeholder:text-gray-300"
      />

      <div className="mb-5 flex items-center gap-2 text-xs text-gray-500">
        <Clock size={14} />
        <span>Changes save automatically</span>
      </div>

      <textarea
        value={note.content}
        onChange={(event) =>
          setNote((previous) => ({
            ...previous,
            content: event.target.value,
          }))
        }
        placeholder="Start writing your ideas here..."
        className="min-h-[350px] w-full flex-1 resize-y bg-transparent text-sm leading-8 text-gray-800 outline-none placeholder:text-gray-400"
      />

      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-xs text-gray-400">
        <span>{note.content.length} characters</span>
        <span>NotesKeeper AI</span>
      </div>
    </main>
  );
}