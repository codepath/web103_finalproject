import Tracker from "../components/tracker.jsx";
import { useState } from "react";

const Income = () => {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    type: "income",
    amount: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEntries([...entries, form]);
    setForm({ type: "income", amount: "", description: "" });
  };

  return (
    <div>
      <h1>Income Tracker</h1>
      <Tracker
        entries={entries}
        setEntries={setEntries}
        form={form}
        setForm={setForm}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Income;
