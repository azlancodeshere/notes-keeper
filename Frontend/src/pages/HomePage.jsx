
import { useState } from "react";
import {
  Command, Folder, FolderOpen, Heart, Tag, Plus,
  ChevronRight, Sparkles, Trash2, Settings, PanelLeft,
  Search, Code2, NotebookPen, BookOpen, FileText,
  SpellCheck, Brain, Layers, Send, X, Sun, Moon,
  MoreHorizontal, Clock, Check, PanelRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const initialNotes = [
  {
    id: 1,
    title: "Introduction to Artificial Intelligence",
    content:
      "Artificial Intelligence (AI) is a branch of computer science that focuses on creating machines capable of performing tasks that usually require human intelligence.\n\nKey concepts:\n• Machine Learning\n• Deep Learning\n• Natural Language Processing\n• Computer Vision",
    folder: "Computer Science",
    favorite: true,
  },
  {
    id: 2,
    title: "JavaScript Fundamentals",
    content:
      "JavaScript is a programming language used to create dynamic and interactive web applications.\n\nImportant topics:\n• Variables and data types\n• Functions\n• Arrays and objects\n• Promises and async/await",
    folder: "Programming",
    favorite: false,
  },
  {
    id: 3,
    title: "Database Management System",
    content:
      "A Database Management System (DBMS) is software used to store, organize, retrieve, and manage data efficiently.\n\nImportant topics:\n• Relational databases\n• Primary and foreign keys\n• SQL queries\n• Normalization",
    folder: "Computer Science",
    favorite: false,
  },
];

const aiActions = [
  { label: "Explain this note", icon: BookOpen },
  { label: "Summarize notes", icon: FileText },
  { label: "Fix grammar", icon: SpellCheck },
  { label: "Generate quiz", icon: Brain },
  { label: "Create flashcards", icon: Layers },
];

export default function HomePage() {
  const [notes, setNotes] = useState(initialNotes);
  const [folders, setFolders] = useState([
    "Computer Science",
    "Programming",
    "Personal",
  ]);
  const [selectedId, setSelectedId] = useState(1);
  const [activeView, setActiveView] = useState("All Notes");
  const [search, setSearch] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [dark, setDark] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAI, setShowAI] = useState(true);

  const selectedNote = notes.find((note) => note.id === selectedId);

  const visibleNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (activeView === "Favorites") return note.favorite;
    if (activeView.startsWith("folder:")) {
      return note.folder === activeView.slice(7);
    }
    if (activeView === "Trash") return false;
    return true;
  });

  function updateNote(field, value) {
    setNotes((previous) =>
      previous.map((note) =>
        note.id === selectedId ? { ...note, [field]: value } : note
      )
    );
  }

  function createNote() {
    const note = {
      id: Date.now(),
      title: "",
      content: "",
      folder: folders[0] || "Personal",
      favorite: false,
    };

    setNotes((previous) => [note, ...previous]);
    setSelectedId(note.id);
    setActiveView("All Notes");
  }

  function addFolder() {
    const name = window.prompt("Enter folder name");
    if (!name?.trim()) return;

    if (folders.some((f) => f.toLowerCase() === name.trim().toLowerCase())) {
      window.alert("Folder already exists.");
      return;
    }

    setFolders((previous) => [...previous, name.trim()]);
  }

  function toggleFavorite(id) {
    setNotes((previous) =>
      previous.map((note) =>
        note.id === id ? { ...note, favorite: !note.favorite } : note
      )
    );
  }

  function deleteNote(id) {
    setNotes((previous) => previous.filter((note) => note.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function runAI(label) {
    if (!selectedNote) {
      window.alert("Pehle ek note select karo.");
      return;
    }

    const prompt = `${label}: ${selectedNote.title || "Untitled note"}`;
    setQuestion(prompt);
    setMessages((previous) => [
      ...previous,
      { role: "user", text: prompt },
      {
        role: "assistant",
        text: "AI response ke liye Gemini API connect karni hogi. Abhi ye interface preview hai.",
      },
    ]);
  }

  function sendQuestion(event) {
    event.preventDefault();
    if (!question.trim()) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", text: question.trim() },
      {
        role: "assistant",
        text: "Gemini API abhi connect nahi hai. Is chat ko agle step mein functional banayenge.",
      },
    ]);

    setQuestion("");
  }

  const surface = dark
    ? "bg-[#191920] text-gray-100"
    : "bg-white text-gray-900";

  const mutedSurface = dark ? "bg-[#202027]" : "bg-[#faf9fc]";
  const borderColor = dark ? "border-gray-700" : "border-gray-200";

  return (
    <div className={`flex h-screen flex-col overflow-hidden border-t-[3px] border-violet-600 ${surface}`}>

      {/* TOPBAR */}
      <Navbar/>

      {/* THREE-COLUMN WORKSPACE */}
      <div className="flex min-h-0 flex-1">

        {/* LEFT SIDEBAR */}
       <Sidebar/>

        {/* CENTER: NOTES + EDITOR */}
        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto p-4 md:p-5">
          {!selectedNote ? (
            <>
              <div className={`rounded-2xl border ${borderColor} bg-gradient-to-r from-violet-50 via-white to-indigo-50 p-5 md:p-7`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                      <Sparkles size={13} /> Your intelligent workspace
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                      Your ideas, organized.
                    </h2>
                    <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                      Capture your thoughts, organize your learning, and use AI to understand your notes.
                    </p>
                  </div>

                  <button
                    onClick={createNote}
                    className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
                  >
                    <Plus size={17} /> Create New Note
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { label: "Total Notes", value: notes.length, icon: FileText },
                    { label: "Folders", value: folders.length, icon: Folder },
                    { label: "Favorites", value: notes.filter((n) => n.favorite).length, icon: Heart },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-xl border border-white bg-white/90 p-3 shadow-sm">
                      <Icon size={17} className="text-violet-600" />
                      <p className="mt-3 text-xl font-bold text-gray-900">{value}</p>
                      <p className="mt-1 text-xs text-gray-500">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold">
                    {activeView === "Favorites"
                      ? "Favorite Notes"
                      : activeView.startsWith("folder:")
                        ? activeView.slice(7)
                        : activeView === "Trash"
                          ? "Trash"
                          : "Recent Notes"}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Pick up where you left off.
                  </p>
                </div>
                <button
                  onClick={createNote}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium hover:bg-violet-50"
                >
                  <Plus size={15} /> New note
                </button>
              </div>

              {activeView === "Trash" ? (
                <div className="mt-8 rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
                  Trash functionality will be added next.
                </div>
              ) : visibleNotes.length === 0 ? (
                <div className={`mt-4 flex min-h-[230px] flex-col items-center justify-center rounded-2xl border border-dashed ${borderColor} px-6 text-center`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <NotebookPen size={24} />
                  </div>
                  <h3 className="mt-4 font-semibold">
                    {search ? "No matching notes" : "Ready for your next idea?"}
                  </h3>
                  <p className="mt-1 max-w-xs text-sm text-gray-500">
                    {search
                      ? "Try another search term."
                      : "Create a note to start organizing your knowledge."}
                  </p>
                  {!search && (
                    <button
                      onClick={createNote}
                      className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
                    >
                      Create your first note
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                  {visibleNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`group rounded-2xl border ${borderColor} p-4 transition hover:border-violet-300 hover:shadow-md`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                          <FileText size={19} />
                        </div>
                        <button
                          onClick={() => toggleFavorite(note.id)}
                          title="Toggle favorite"
                          className={note.favorite ? "text-rose-500" : "text-gray-300 hover:text-rose-500"}
                        >
                          <Heart size={17} fill={note.favorite ? "currentColor" : "none"} />
                        </button>
                      </div>

                      <button
                        onClick={() => setSelectedId(note.id)}
                        className="mt-4 block w-full text-left"
                      >
                        <h4 className="line-clamp-2 text-sm font-semibold">
                          {note.title || "Untitled note"}
                        </h4>
                        <p className="mt-2 line-clamp-3 whitespace-pre-line text-xs leading-5 text-gray-500">
                          {note.content || "No content yet. Open this note to start writing."}
                        </p>
                      </button>

                      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                        <span className="truncate rounded-md bg-gray-100 px-2 py-1 text-[10px] text-gray-600">
                          {note.folder}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedId(note.id)}
                            className="text-xs font-medium text-violet-600 hover:text-violet-800"
                          >
                            Open
                          </button>
                          <button
                            onClick={() => deleteNote(note.id)}
                            title="Delete note"
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <Sparkles size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Learn smarter with AI</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Turn your notes into summaries, quizzes and flashcards.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAI(true);
                    if (!selectedNote && notes.length) setSelectedId(notes[0].id);
                  }}
                  className="rounded-lg border border-violet-200 px-3 py-2 text-xs font-medium text-violet-700 hover:bg-violet-50"
                >
                  Explore AI
                </button>
              </div>
            </>
          ) : (
            <div className={`flex min-h-[500px] flex-1 flex-col rounded-2xl border ${borderColor} ${mutedSurface} p-5 md:p-8`}>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <button onClick={() => setSelectedId(null)} className="hover:text-violet-600">
                    My Notes
                  </button>
                  <ChevronRight size={14} />
                  <span>Editing</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Check size={13} /> Draft
                  </span>
                  <button
                    onClick={() => toggleFavorite(selectedId)}
                    title="Toggle favorite"
                    className={selectedNote.favorite ? "text-rose-500" : "text-gray-400"}
                  >
                    <Heart size={18} fill={selectedNote.favorite ? "currentColor" : "none"} />
                  </button>
                  <button onClick={() => deleteNote(selectedId)} title="Delete note" className="text-gray-400 hover:text-red-500">
                    <Trash2 size={17} />
                  </button>
                  <button onClick={() => setSelectedId(null)} title="Close editor" className="text-gray-400">
                    <X size={17} />
                  </button>
                </div>
              </div>

              <input
                value={selectedNote.title}
                onChange={(e) => updateNote("title", e.target.value)}
                placeholder="Untitled note"
                className="mb-4 w-full bg-transparent text-3xl font-bold outline-none placeholder:text-gray-300"
              />

              <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <Folder size={14} />
                <select
                  value={selectedNote.folder}
                  onChange={(e) => updateNote("folder", e.target.value)}
                  className={`rounded-lg border ${borderColor} bg-transparent px-2 py-1.5 outline-none`}
                >
                  {folders.map((folder) => (
                    <option key={folder} value={folder}>{folder}</option>
                  ))}
                </select>
                <span className="flex items-center gap-1">
                  <Clock size={13} /> Editing note
                </span>
              </div>

              <div className={`mb-5 flex flex-wrap gap-1 rounded-xl border ${borderColor} p-2`}>
                {["B", "I", "H1", "H2", "• List", "Code"].map((tool) => (
                  <button
                    key={tool}
                    onClick={() => {
                      if (tool === "• List") updateNote("content", selectedNote.content + "\n• ");
                      else if (tool === "Code") updateNote("content", selectedNote.content + "\n```\n\n```");
                      else if (tool === "H1") updateNote("content", selectedNote.content + "\n# ");
                      else if (tool === "H2") updateNote("content", selectedNote.content + "\n## ");
                      else updateNote("content", selectedNote.content + ` ${tool === "B" ? "**bold text**" : "_italic text_"}`);
                    }}
                    className="rounded-md px-3 py-1.5 text-xs font-semibold hover:bg-violet-100 hover:text-violet-700"
                  >
                    {tool}
                  </button>
                ))}
              </div>

              <textarea
                value={selectedNote.content}
                onChange={(e) => updateNote("content", e.target.value)}
                placeholder="Start writing your ideas here..."
                className="min-h-[300px] flex-1 resize-y bg-transparent text-sm leading-8 outline-none placeholder:text-gray-400"
              />

              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-xs text-gray-400">
                <span>{selectedNote.content.length} characters</span>
                <span>Local draft · Database not connected</span>
              </div>
            </div>
          )}
        </main>

        {/* RIGHT AI ASSISTANT */}
        {showAI && (
          <aside className={`hidden w-[275px] shrink-0 flex-col border-l ${borderColor} p-4 xl:flex`}>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="text-sm font-semibold">AI Assistant</h2>
                <p className="text-[10px] text-gray-500">Your study partner</p>
              </div>
              <button onClick={() => setMessages([])} title="Clear chat" className="ml-auto rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                <MoreHorizontal size={18} />
              </button>
            </div>

            <div className={`mt-5 rounded-xl border ${borderColor} p-3`}>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Sparkles size={15} className="text-violet-600" />
                Note context
              </div>
              <p className="mt-2 line-clamp-3 text-xs leading-5 text-gray-500">
                {selectedNote
                  ? selectedNote.title || "Untitled note"
                  : "Select a note to give AI context for your questions."}
              </p>
            </div>

            <p className="mb-2 mt-6 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Quick Actions
            </p>

            <div className="space-y-2">
              {aiActions.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => runAI(label)}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-3 py-3 text-left text-xs transition hover:border-violet-200 hover:bg-violet-50"
                >
                  <Icon size={17} className="shrink-0 text-violet-600" />
                  <span className="flex-1">{label}</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
              ))}
            </div>

            <div className="mt-5 flex min-h-0 flex-1 flex-col overflow-y-auto">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Conversation
              </p>

              {messages.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                    <Sparkles size={22} />
                  </div>
                  <p className="mt-3 text-xs font-medium">How can I help you?</p>
                  <p className="mt-1 text-[11px] leading-5 text-gray-500">
                    Choose an action or ask a question about your notes.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`rounded-xl p-3 text-xs leading-5 ${
                        message.role === "user"
                          ? "ml-5 bg-violet-100 text-violet-900"
                          : "mr-2 border border-gray-200"
                      }`}
                    >
                      {message.text}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={sendQuestion} className={`mt-4 flex items-center gap-2 rounded-xl border ${borderColor} p-2`}>
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about your notes..."
                className="min-w-0 flex-1 bg-transparent px-1 py-2 text-xs outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                title="Send question"
                className="rounded-lg bg-violet-600 p-2 text-white hover:bg-violet-700"
              >
                <Send size={15} />
              </button>
            </form>

            <p className="mt-2 text-center text-[10px] text-gray-400">
              AI responses require Gemini API integration
            </p>
          </aside>
        )}
      </div>
    </div>
  );
}
