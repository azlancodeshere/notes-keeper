
import { useState } from "react";
import {
  Sparkles,
  Send,
  Bot,
  Zap,
  Quote,
  RefreshCw,
  CheckSquare,
  BarChart3,
  Copy,
  Trash2,
  LoaderCircle,
  X,
  Sun,
  BookOpen,
} from "lucide-react";
import api from "../api/api";


export default function AIAgent({
  note,
  onClose,
  variant = "sidebar",
}) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const quickActions = [
    {
      label: "Morning boost",
      icon: Sun,
      prompt: "Give me a motivational morning boost.",
    },
    {
      label: "Productivity hack",
      icon: Zap,
      prompt: "Suggest a useful productivity hack.",
    },
    {
      label: "Quote of the day",
      icon: Quote,
      prompt: "Give me an inspiring quote of the day.",
    },
    {
      label: "Catch me up",
      icon: RefreshCw,
      prompt: "Summarize my current note.",
    },
    {
      label: "Find action items",
      icon: CheckSquare,
      prompt: "Find action items in my current note.",
    },
    {
      label: "What's important?",
      icon: BarChart3,
      prompt: "Identify the most important points in my note.",
    },
  ];

  
async function handleSubmit(event, customPrompt) {
  event.preventDefault();

  const question = (customPrompt ?? prompt).trim();

  if (!question || loading) return;

  const userMessage = {
    role: "user",
    content: question,
  };

  setMessages((previous) => [...previous, userMessage]);
  setPrompt("");
  setLoading(true);

  try {
    const response = await api.post("/ai/ask", {
      prompt: question,
      noteTitle: note?.title || "",
      noteContent: note?.content || "",
    });

    setMessages((previous) => [
      ...previous,
      {
        role: "assistant",
        content: response.data.answer 
      },
    ]);
  } catch (error) {
    setMessages((previous) => [
      ...previous,
      {
        role: "assistant",
        content:
          error.response?.data?.message 
         
      },
    ]);
  } finally {
    setLoading(false);
  }
}



function handleQuickAction(action) {
  const event = { preventDefault() {} };
  handleSubmit(event, action.prompt);
}
  

  async function copyMessage(content) {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
     console.log(error)
    }
  }

  return (
    <aside
      className={`flex min-h-0 min-w-0 flex-col bg-white ${
        variant === "mobile"
          ? "h-full w-full"
          : "h-full w-full"
      }`}
    >
      
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-100 px-3 py-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <Sparkles size={19} />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-gray-900">
              AI Agent
            </h2>
            <p className="truncate text-xs text-gray-400">
              Your AI notetaker
            </p>
          </div>
        </div>

        {variant === "mobile" && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close AI Agent"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        )}

        <button
          type="button"
          onClick={() => setMessages([])}
          title="Clear conversation"
          aria-label="Clear conversation"
          className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>
      </header>

      
      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-b border-gray-100 p-3 sm:p-4"
      >
        <div className="flex min-w-0 items-center gap-2 rounded-xl border border-gray-300 p-2 transition focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
          <Sparkles
            size={17}
            className="shrink-0 text-violet-500"
          />

          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Ask AI anything..."
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <LoaderCircle
                size={14}
                className="animate-spin"
              />
            ) : (
              <Send size={14} />
            )}
            <span>Run</span>
          </button>
        </div>
      </form>

     
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        
        <section className="shrink-0 border-b border-gray-100 p-3 sm:p-4">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <Sparkles size={14} />
            Daily Boost
          </p>

          <div className="flex flex-wrap gap-2">
            {quickActions.slice(0, 3).map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => handleQuickAction(action)}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-2 text-left text-xs text-gray-700 transition hover:border-violet-200 hover:bg-violet-50"
                >
                  <Icon size={14} className="shrink-0" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>

          <p className="mb-3 mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <BookOpen size={14} />
            Your Notes
          </p>

          <div className="flex flex-wrap gap-2">
            {quickActions.slice(3).map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => handleQuickAction(action)}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-2 text-left text-xs text-gray-700 transition hover:border-violet-200 hover:bg-violet-50"
                >
                  <Icon size={14} className="shrink-0" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        
        <section className="flex min-h-[180px] flex-1 flex-col gap-3 p-3 sm:p-4">
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                <Bot size={25} />
              </div>

              <h3 className="mt-3 text-sm font-semibold text-gray-800">
                How can I help?
              </h3>

              <p className="mt-2 max-w-[240px] text-xs leading-5 text-gray-500">
                {note?.title
                  ? `Ask anything about "${note.title}".`
                  : "Select a note to get AI-powered assistance."}
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={`${index}-${message.role}`}
                className={`max-w-[95%] break-words rounded-xl p-3 text-sm ${
                  message.role === "user"
                    ? "self-end bg-violet-600 text-white"
                    : "self-start bg-gray-50 leading-6 text-gray-700"
                }`}
              >
                <p className="whitespace-pre-wrap">
                  {message.content}
                </p>

                {message.role === "assistant" && (
                  <button
                    type="button"
                    onClick={() => copyMessage(message.content)}
                    className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-violet-600"
                  >
                    <Copy size={12} />
                    Copy
                  </button>
                )}
              </div>
            ))
          )}

          {loading && (
            <div className="flex items-center gap-2 self-start rounded-xl bg-gray-50 p-3 text-xs text-gray-500">
              <LoaderCircle
                size={15}
                className="animate-spin text-violet-600"
              />
              Thinking...
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="shrink-0 border-t border-gray-100 px-3 py-3 sm:px-4">
        <p className="text-center text-[10px] leading-4 text-gray-400">
          AI can make mistakes. Verify important information.
        </p>
      </footer>
    </aside>
  );
}
