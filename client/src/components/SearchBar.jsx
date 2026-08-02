import { useState } from 'react'

const styles = {
  search: {
    padding: "8px 12px",
    width: "250px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    outline: "none",
  },
};

function SearchBar(/* { items, onSelect } */) {
  const [query, setQuery] = useState("");

  // const filteredItems = items.filter((item) =>
  //   item.name.toLowerCase().includes(query.toLowerCase())
  // );

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
      style={styles.search}
    />
  );
}

export default SearchBar;

//
// import { useState } from "react";
//
// const styles = {
//   search: {
//     padding: "8px 12px",
//     width: "250px",
//     fontSize: "16px",
//     border: "1px solid #ccc",
//     borderRadius: "8px",
//     outline: "none",
//   },
// };
//
// function SearchBar({ items, onSelect }) {
//   const [query, setQuery] = useState("");
//
//   const filtereditems = items.filter((item) =>
//     item.name.toLowerCase().includes(query.toLowerCase())
//   );
//
//   return (
//     <div>
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Search..."
//         style={styles.search}
//       />
//
//       <div>
//         {filteredItems.map((item) => (
//           <div
//             key={item.name}
//             onClick={() => onSelect(item)}
//           >
//             {item.name}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
//
// export default SearchBar;
