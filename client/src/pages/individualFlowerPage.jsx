import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import "../Pages_css/individualFlowerPage.css";

const detailsRows = [
  ["Order", "order"],
  ["Family", "flower_family"],
  ["Genus", "genus"],
  ["Species", "species"],
  ["Flower Type", "flower_type"],
  ["Flower Array", "flower_array"],
  ["Petal Shape", "petal_shape"],
  ["Leaf Type", "leaf_type"],
  ["Leaf Edge", "leaf_edge"],
  ["Life Type", "life_type"],
  ["Flower Colors", "flower_colors"],
  ["Leaf Colors", "leaf_colors"],
  ["Fruit Colors", "fruit_colors"],
  ["Height", "height"],
  ["Flower Diameter", "flower_diameter"],
  ["Flower Meaning", "flower_meaning"],
];

const fallbackFlower = {
  id: "sample",
  name: "Flower Name",
  description: "Flower details will appear here once a flower is selected.",
  image_url: "",
};

const IndividualFlowerPage = ({ flowers = [] }) => {
  const { flowerId } = useParams();
  const [flowerFromApi, setFlowerFromApi] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const flowerFromList = useMemo(
    () => flowers.find((flower) => String(flower.id) === String(flowerId)),
    [flowers, flowerId]
  );

  useEffect(() => {
    if (flowerFromList || !flowerId) {
      return;
    }

    const loadFlower = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/flowers/${flowerId}`);
        if (!response.ok) {
          setFlowerFromApi(null);
          return;
        }
        const data = await response.json();
        setFlowerFromApi(data);
      } catch (error) {
        console.error("Error fetching individual flower:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFlower();
  }, [flowerFromList, flowerId]);

  const activeFlower = flowerFromList || flowerFromApi || fallbackFlower;

  return (
    <main className="individual-flower-page">
      <section className="flower-hero">
        <div className="flower-layout">
          <div className="flower-main-column">
            <h1 className="flower-title">{activeFlower.name || "Flower Name"}</h1>
            <div className="primary-flower-image">
              {activeFlower.image_url ? (
                <img src={activeFlower.image_url} alt={activeFlower.name} />
              ) : (
                <span className="image-fallback-icon" aria-hidden="true">
                  🖼️
                </span>
              )}
            </div>
          </div>

          <div className="thumbnail-column" aria-hidden="true">
            <div className="thumbnail-placeholder">🖼️</div>
            <div className="thumbnail-placeholder">🖼️</div>
            <div className="thumbnail-placeholder">🖼️</div>
          </div>
        </div>
      </section>

      <section className="flower-details-section">
        <h2>Flower Details</h2>
        {isLoading && <p className="flower-note">Loading flower details...</p>}
        {!isLoading && activeFlower.description && (
          <p className="flower-note">{activeFlower.description}</p>
        )}

        <div className="flower-details-grid">
          {detailsRows.map(([label, key]) => (
            <p key={key} className="detail-item">
              <span>{label}:</span> {activeFlower[key] || "..."}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
};

export default IndividualFlowerPage;
