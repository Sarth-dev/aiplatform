"use client";
import { useEffect, useState } from "react";

// Dummy templates i used
const promptTemplates = [
  { name: "Greeting", text: "Hello! How can I help you today?" },
  { name: "Summarize Text", text: "Please summarize the following text:" },
];

// Model's
const models = ["gpt-3.5", "gpt-4", "mistral", "custom"];

export default function Home() {
  // State
  const [model, setModel] = useState("gpt-3.5");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(256);
  const [prompt, setPrompt] = useState("");
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Theme persistence
  useEffect(() => {
    const t = localStorage.getItem("theme");
    if (t) setTheme(t);
  }, []);
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Keyboard Accessibility: Focus trap
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        // Just as accessibility marker; advanced focus-trap can be added
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Handle Send
  const handleSend = async () => {
    setChat([...chat, { role: "user", content: prompt }]);
    setPrompt("");
    setLoading(true);
    setError(null);

    // Simulate API request
    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Echo: ${prompt}\n(Model: ${model}, Temp: ${temperature}, MaxTokens: ${maxTokens})`,
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  // Handle Copy Chat Output
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  // Download Chat as JSON
  const handleDownloadJSON = () => {
    const json = JSON.stringify(chat, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Theme Toggle Styles
  const themeStyles =
    theme === "dark"
      ? "bg-gray-900 text-white"
      : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900";

  return (
    <main
      className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${themeStyles}`}
      aria-label="AI Platform Main Interface"
    >
      <div className="w-full max-w-2xl bg-white/95 dark:bg-gray-800 shadow-xl rounded-2xl p-6 space-y-6 ring-1 ring-gray-200 dark:ring-gray-700">
        {/* Theme toggle */}
        <div className="flex justify-end">
          <button
            aria-label="Toggle light/dark theme"
            className="rounded-full px-3 py-1 bg-gray-200 dark:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "dark" ? "🌙 Dark" : "🌞 Light"}
          </button>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-100 dark:text-gray-100">
          AI Platform UI
        </h1>

        {/* Model Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="model-selector">
            Model
          </label>
          <select
            id="model-selector"
            className="w-full rounded-lg border border-gray-300 text-gray-100 bg-gray-50 dark:bg-gray-700 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            aria-label="Model selector"
          >
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Temperature & Max Tokens Panel */}
        <div className="flex gap-6 flex-wrap">
          <div className="space-y-2 flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="temp-slider">
              Temperature
            </label>
            <div className="flex items-center gap-3 ">
              <input
                id="temp-slider"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-blue-500"
                aria-label="Temperature slider"
              />
              <span className="text-gray-700 dark:text-gray-200 font-medium">{temperature}</span>
            </div>
          </div>
          <div className="space-y-2 flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="tokens-slider">
              Max Tokens
            </label>
            <div className="flex items-center gap-3">
              <input
                id="tokens-slider"
                type="range"
                min={64}
                max={2048}
                step={32}
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number(e.target.value))}
                className="w-full accent-blue-500"
                aria-label="Max tokens slider"
              />
              <span className="text-gray-700 dark:text-gray-200 font-medium">{maxTokens}</span>
            </div>
          </div>
        </div>

        {/* Prompt Editor with Templates */}
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <textarea
              rows={3}
              placeholder="Type your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full rounded-lg border text-gray-100 border-gray-300 dark:border-gray-600 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Prompt editor"
            />
            {/* Templates dropdown */}
            <select
              className="rounded-lg border text-gray-100 border-gray-300 bg-gray-50 dark:bg-gray-700 p-2"
              aria-label="Prompt template selector"
              onChange={(e) => setPrompt(e.target.value)}
              value=""
            >
              <option value="" disabled>
                Insert Template
              </option>
              {promptTemplates.map((tpl) => (
                <option key={tpl.name} value={tpl.text}>
                  {tpl.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSend}
            disabled={!prompt || loading}
            className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            aria-label="Send prompt"
          >
            {loading ? "Loading..." : "Send"}
          </button>
          {error && (
            <div className="p-2 text-sm text-red-600 rounded-md bg-red-100">
              {error}
            </div>
          )}
        </div>

        {/* Chat / Output Area */}
        <div className="space-y-4 text-gray-600 max-h-64 overflow-y-auto" aria-label="Chat output area">
          {chat.map((msg, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl ring-1 transition-shadow duration-300 ${
                msg.role === "user"
                  ? "bg-blue-50 border border-blue-200 hover:shadow-lg"
                  : "bg-gray-50 border border-gray-200 hover:shadow-lg dark:bg-gray-900 dark:border-gray-700"
              }`}
              tabIndex={0}
              aria-label={`Message from ${msg.role}`}
            >
              <p className="text-sm bg-amber-200 p-3 rounded-md text-gray-600 dark:text-gray-800">
                <strong className="capitalize">{msg.role}:</strong> {msg.content}
              </p>
              {/* Copy & Download JSON */}
              {msg.role !== "user" && (
                <div className="flex gap-2 mt-2">
                  <button
                    className="text-xs px-2 py-1 rounded bg-blue-200 hover:bg-blue-300 focus:outline-none transition"
                    onClick={() => handleCopy(msg.content)}
                    tabIndex={0}
                  >
                    Copy
                  </button>
                  <button
                    className="text-xs px-2 py-1 rounded bg-green-200 hover:bg-green-300 focus:outline-none transition"
                    onClick={handleDownloadJSON}
                    tabIndex={0}
                  >
                    Download JSON
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
