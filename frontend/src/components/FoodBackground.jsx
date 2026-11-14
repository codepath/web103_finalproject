
import "../styles/foodBackground.css";

const foods = [
  "🥑", "🍅", "🥦", "🥕", "🍋",
  "🍓", "🧄", "🌽", "🍄", "🍎",
  "🫑", "🍇", "🥬", "🍊", "🧅"
];

export default function FoodBackground() {
  return (
    <div className="food-background" aria-hidden="true">
      {foods.map((food, index) => (
        <span
          key={index}
          className="floating-food"
          style={{
            left: `${(index * 37 + 8) % 95}%`,
            top: `${(index * 23 + 5) % 90}%`,
            animationDelay: `${-(index * 1.7)}s`,
            animationDuration: `${12 + index % 7}s`,
            fontSize: `${30 + (index % 4) * 12}px`,
          }}
        >
          {food}
        </span>
      ))}
    </div>
  );
}
