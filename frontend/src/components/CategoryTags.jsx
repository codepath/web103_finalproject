export default function CategoryTags({ categories }) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <ul className="category-tags" aria-label="Categories">
      {categories.map((category) => (
        <li
          key={category.id}
          className="category-tag"
          style={{ "--category-color": category.color }}
        >
          {category.name}
        </li>
      ))}
    </ul>
  );
}
