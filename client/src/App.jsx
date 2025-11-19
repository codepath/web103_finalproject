// client/src/App.jsx
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Habits from "./pages/Habits.jsx";
import HabitDetail from "./pages/HabitDetail.jsx";
import TimerView from "./pages/TimerView.jsx";
import FinishedTimerView from "./pages/FinishedTimerView.jsx";
import StickerGallery from "./pages/StickerGallery.jsx";
import { useUser } from "./UserContext.jsx";

function Header() {
  const { points } = useUser();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #ccc",
        marginBottom: "20px",
      }}
    >
      {/* Nav buttons */}
      <nav style={{ display: "flex", gap: "10px" }}>
        <Link to="/">
          <button>HOME</button>
        </Link>
        <Link to="/habits">
          <button>MY HABITS</button>
        </Link>
        <Link to="/stickers">
          <button>STICKER GALLERY</button>
        </Link>
      </nav>

      {/* Points display (THE ONLY ONE) */}
      <div style={{ fontWeight: "bold" }}>
        Points: {points}
      </div>
    </header>
  );
}


export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/habit/:id" element={<HabitDetail />} />
        <Route path="/habit/:id/timer" element={<TimerView />} />
        <Route path="/habit/:id/finished" element={<FinishedTimerView />} />
        <Route path="/stickers" element={<StickerGallery />} />
      </Routes>
    </>
  );
}
