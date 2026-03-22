import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Fermer avec Escape
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

  if (!isOpen) return null;

  return (
    <div className="search">
      <div className="ct-search">
        <h1>What are you looking for?</h1>
        <form onSubmit={handleSearch}>
          <div>
            <input
              ref={inputRef}
              type="text"
              id="search-for"
              placeholder="Search products ..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="logo-header material-icons-outlined"
              aria-label="Search"
            >
              search
            </button>
          </div>
        </form>
      </div>
      <div className="opty-search" onClick={onClose} />
      <button
        className="cross material-icons-outlined"
        aria-label="Close search"
        onClick={onClose}
      >
        close
      </button>
    </div>
  );
}
