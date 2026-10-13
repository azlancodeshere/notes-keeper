
import {
  Sparkles,
  BookOpen,
  FileText,
  SpellCheck,
  Brain,
  Layers,
  Send,
} from "lucide-react";

const actions = [
  { label: "Explain this note", icon: BookOpen },
  { label: "Summarize", icon: FileText },
  { label: "Fix grammar", icon: SpellCheck },
  { label: "Generate quiz", icon: Brain },
  { label: "Create flashcards", icon: Layers },
];

export default function AIAssistant() {
  return (
    <aside className="flex w-[290px] shrink-0 flex-col border-l border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <Sparkles size={20} className="text-violet-600" />
        <h2 className="text-base font-semibold text-gray-900">
          AI Assistant
        </h2>
      </div>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        Your personal study partner. What would you like to do?
      </p>

      <div className="mt-6 space-y-2">
        {actions.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-3 py-3 text-left text-sm text-gray-700 transition hover:border-violet-200 hover:bg-violet-50"
          >
            <Icon size={18} className="text-violet-600" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <div className="rounded-xl bg-violet-50 p-3">
          <p className="text-sm font-semibold text-violet-800">
            Ask your notes
          </p>
          <p className="mt-1 text-xs leading-5 text-violet-600">
            Select a note and ask AI to explain its content.
          </p>
        </div>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="mt-3 flex items-center gap-2 rounded-xl border border-gray-200 p-2"
        >
          <input
            placeholder="Ask anything..."
            className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            aria-label="Send question"
            className="rounded-lg bg-violet-600 p-2 text-white hover:bg-violet-700"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </aside>
  );
}
