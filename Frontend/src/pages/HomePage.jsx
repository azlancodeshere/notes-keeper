
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import NoteEditor from "./NoteEditor";

export default function HomePage({
  selectedNoteId,
  setSelectedNoteId,
}) {
  function handleNoteUpdated(updatedNote) {
   
    console.debug("Note updated:", updatedNote.id);
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden border-t-[3px] border-violet-600 bg-white">
      <Navbar />

      <div className="flex min-h-0 flex-1">
        <Sidebar
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
        />

        <NoteEditor
          noteId={selectedNoteId}
          onClose={() => setSelectedNoteId(null)}
          onNoteUpdated={handleNoteUpdated}
        />
      </div>
    </div>
  );
}
