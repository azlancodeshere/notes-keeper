
import { useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import NoteEditor from "./NoteEditor";

export default function HomePage({
  selectedNoteId,
  setSelectedNoteId,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function handleNoteUpdated(updatedNote) {
    console.debug("Note updated:", updatedNote?.id);
  }

  function handleSelectNote(noteId) {
    setSelectedNoteId(noteId);
    setIsSidebarOpen(false);
  }

  function handleCloseSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden border-t-[3px] border-violet-600 bg-white">
      <Navbar
        onToggleSidebar={() =>
          setIsSidebarOpen((previous) => !previous)
        }
        noteTitle="Select a note"
      />

      <div className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden">
        <Sidebar
          selectedNoteId={selectedNoteId}
          onSelectNote={handleSelectNote}
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
        />

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          <NoteEditor
            noteId={selectedNoteId}
            onClose={() => setSelectedNoteId(null)}
            onNoteUpdated={handleNoteUpdated}
          />
        </main>
      </div>
    </div>
  );
}
