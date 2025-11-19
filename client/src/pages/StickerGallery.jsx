import { useEffect, useState } from "react";
import { useUser } from "../UserContext";

const API_BASE = "http://localhost:3001";

export default function StickerGallery() {
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // from context
  const {
    points,
    setPoints,
    purchasedStickers,
    setPurchasedStickers,
  } = useUser();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/stickers`);
        if (!res.ok) throw new Error("Failed to load stickers rip!");
        const data = await res.json();
        if (alive) setStickers(data);
      } catch (e) {
        setMsg(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handlePurchase = async (stickerId) => {
    setMsg("");

    const sticker = stickers.find((s) => s.id === stickerId);
    if (!sticker) {
      setMsg("Sticker not found.");
      return;
    }

    if (points < sticker.price) {
      setMsg("You don't have enough points for that sticker.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/user-stickers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sticker_id: stickerId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Purchase failed");
      }

      setPoints((prev) => prev - sticker.price);

      setPurchasedStickers((prev) => {
      
        if (prev.some((p) => p.id === sticker.id)) return prev;
        return [...prev, sticker];
      });

      setMsg("Purchased!");
    } catch (e) {
      setMsg(e.message);
    }
  };

  if (loading) return <div>Sticker Gallery<br />Loading…</div>;

  return (
    <div>
      <h1>Sticker Gallery</h1>
      <p>Current points: {points}</p>
      {msg && <p>{msg}</p>}

      {stickers.length === 0 && <p>No stickers available.</p>}

      <ul className="sticker-grid">
        {stickers.map((s) => (
          <li key={s.id} className="sticker-card">
            {s.image_url && (
              <img src={s.image_url} alt={s.name} />
            )}

            <strong>{s.name}</strong>
            <p>${s.price}</p>

            <button
              className="purchase-btn"
              onClick={() => handlePurchase(s.id)}
            >
              Purchase
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
