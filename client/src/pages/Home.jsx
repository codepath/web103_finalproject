// client/src/pages/Home.jsx
import { useUser } from "../UserContext";

export default function Home() {
  const { points, purchasedStickers } = useUser();

  return (
    <div>
      <h1>Welcome Back!</h1>
      <p>Your purchased stickers:</p>

      <div className="purchased-stickers">
        {purchasedStickers.length === 0 ? (
          <p>You haven't bought any stickers yet.</p>
        ) : (
          purchasedStickers.map((s) => (
            <img key={s.id} src={s.image_url} alt={s.name} />
          ))
        )}
      </div>
    </div>
  );
}
