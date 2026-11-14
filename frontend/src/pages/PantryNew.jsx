import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import PageHeader from "../components/PageHeader.jsx";
import PantryForm from "../components/PantryForm.jsx";
import "../styles/pantry.css";

export default function PantryNew() {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader title="Add ingredient" subtitle="Add something to your pantry." />
      <div className="card pad narrow">
        <PantryForm submitLabel="Add to pantry" onCancel={() => navigate("/pantry")}
          onSubmit={async (p) => { await api.post("/pantry-items", p); navigate("/pantry"); }} />
      </div>
    </>
  );
}
