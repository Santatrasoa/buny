import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ArrowRight } from "lucide-react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTIONS = ["Baby romper", "Boys shirt", "Girls dress", "Toys", "Newborn"];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleSuggestion = (s: string) => {
    navigate(`/shop?search=${encodeURIComponent(s)}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col">
      {/* ── Panel ─────────────────────────────────────────────── */}
      <div className="relative bg-white shadow-xl px-6 py-8 flex flex-col items-center gap-6">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer text-gray-500"
          aria-label="Close search"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-light text-gray-800">What are you looking for?</h2>

        {/* Input */}
        <form onSubmit={handleSearch} className="w-full max-w-xl">
          <div className="flex items-center gap-3 border-b-2 border-gray-300 focus-within:border-[#719378] transition-colors pb-2">
            <Search size={20} className="text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-base outline-none border-none bg-transparent text-gray-800 placeholder-gray-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer text-gray-400"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="submit"
              disabled={!query.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#719378] text-white text-sm font-semibold hover:opacity-85 transition-opacity disabled:opacity-40 cursor-pointer border-none"
            >
              Search <ArrowRight size={14} />
            </button>
          </div>
        </form>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="text-xs text-gray-400 font-medium">Popular:</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestion(s)}
              className="px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-[#719378] hover:text-[#719378] hover:bg-green-50 transition-colors cursor-pointer bg-white"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Overlay sombre */}
      <div
        className="flex-1 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
    </div>
  );
}
