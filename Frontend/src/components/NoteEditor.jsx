
import { NotebookPen, Plus } from "lucide-react";

export default function NoteEditor() {
  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-white p-5">
      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-[#fafafa] px-6 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50">
          <NotebookPen size={29} className="text-violet-500" />
        </div>

        <h2 className="text-xl font-semibold text-gray-800">
          Your workspace is ready
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
          Select a note from the sidebar to view and edit it,
          or create a new note to get started.
        </p>

        <button className="mt-6 flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700">
          <Plus size={18} />
          Create New Note
        </button>
      </div>
    </main>
  );
}
