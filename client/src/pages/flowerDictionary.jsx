import { useEffect, useMemo, useState } from "react";
import "../Pages_css/flowerDictionary.css";
import { flowerMeaningsFallback } from "../data/flowerMeanings";

const FlowerDictionary = () => {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState("All");
  const [loading, setLoading] = useState(true);

  const fallbackEntries = useMemo(
    () =>
      Object.entries(flowerMeaningsFallback)
        .map(([name, meaning]) => ({ name, meaning }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  useEffect(() => {
    const loadMeanings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/flowers/meanings");
        if (!response.ok) {
          throw new Error("Meanings API request failed.");
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Meanings API returned invalid shape.");
        }

        const validEntries = data.filter(
          (entry) =>
            typeof entry?.name === "string" && typeof entry?.meaning === "string"
        );
        const sorted = [...validEntries].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setEntries(sorted.length ? sorted : fallbackEntries);
      } catch (error) {
        console.error("Error fetching flower meanings:", error);
        setEntries(fallbackEntries);
      } finally {
        setLoading(false);
      }
    };

    loadMeanings();
  }, [fallbackEntries]);

  const letters = useMemo(() => {
    const unique = new Set(
      entries.map((entry) => entry.name.charAt(0).toUpperCase())
    );
    return ["All", ...Array.from(unique).sort()];
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesLetter =
        activeLetter === "All" ||
        entry.name.charAt(0).toUpperCase() === activeLetter;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        entry.name.toLowerCase().includes(normalizedQuery) ||
        entry.meaning.toLowerCase().includes(normalizedQuery);
      return matchesLetter && matchesSearch;
    });
  }, [entries, search, activeLetter]);

  return (
    <main className="floriography-page">
      <section className="floriography-header">
        <h1>Floriography</h1>
        <p>
          Explore the language of flowers and browse symbolic meanings by name,
          mood, and letter.
        </p>
      </section>

      <section className="floriography-controls">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search flowers or meanings..."
          aria-label="Search flower meanings"
        />
        <div className="letter-nav">
          {letters.map((letter) => (
            <button
              key={letter}
              type="button"
              className={activeLetter === letter ? "active" : ""}
              onClick={() => setActiveLetter(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <p className="floriography-state">Loading flower meanings...</p>
      ) : filteredEntries.length === 0 ? (
        <p className="floriography-state">
          No flowers match that filter yet. Try a different search term.
        </p>
      ) : (
        <section className="floriography-grid">
          {filteredEntries.map((entry) => (
            <article key={entry.name} className="meaning-card">
              <h2>{entry.name}</h2>
              <p>{entry.meaning}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default FlowerDictionary;
