import { useEffect, useState } from "react";
import { getMerch, getArtists } from "../api.js";
import MerchCard from "../components/MerchCard.jsx";

export default function MerchShop() {
  const [merch, setMerch] = useState([]);
  const [artists, setArtists] = useState([]);
  const [artistId, setArtistId] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArtists().then(setArtists);
  }, []);

  useEffect(() => {
    setLoading(true);
    getMerch({ artist_id: artistId, type, sort })
      .then(setMerch)
      .finally(() => setLoading(false));
  }, [artistId, type, sort]);

  return (
    <section>
      <h1>Merch Shop</h1>

      <div className="filters">
        <select value={artistId} onChange={(e) => setArtistId(e.target.value)}>
          <option value="">All Artists</option>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>{artist.name}</option>
          ))}
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="apparel">Apparel</option>
          <option value="music">Music</option>
          <option value="accessory">Accessory</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : merch.length === 0 ? (
        <p>No merch found.</p>
      ) : (
        <div className="grid">
          {merch.map((item) => (
            <MerchCard key={item.id} merch={item} />
          ))}
        </div>
      )}
    </section>
  );
}