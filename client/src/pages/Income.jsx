// import "../css/Income.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UpdateModal from "../components/update";
import incomeService from "../services/Income";

const Income = () => {
  const user_id = Number(useParams().user_id);
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [form, setForm] = useState({
    user_id: user_id,
    type: "income",
    amount: "",
    source: "",
    date: "",
    isSubmitting: false,
  });
  const [modalData, setModalData] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await incomeService.getIncome(user_id);
        setEntries(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [entries, user_id]);

  const updateModal = (entry) => {
    setShowModal(true);
    setModalData(entry);
  };

  const deleteEntry = async (id) => {
    try {
      await incomeService.deleteIncome(id);
      setEntries(entries.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const addData = async (newEntry) => {
    try {
      newEntry.user_id = user_id;
      newEntry.date = new Date(newEntry.date).toISOString();
      const response = await incomeService.addIncome(newEntry);
      setEntries([...entries, response.data]);
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setForm({ ...form, isSubmitting: true });

    await addData(form);
    setForm({
      type: "income",
      amount: "",
      source: "",
      date: "",
    });
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <>
      {isNaN(user_id) ? (
        <div>
          <h1>Please Login to access this page</h1>
        </div>
      ) : (
        <div>
          <h1>Track Your Incomes</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                <b>Source: </b>
                <input
                  type="text"
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                  required
                  disabled={form.isSubmitting}
                />
              </label>
            </div>
            <div>
              <label>
                <b>Amount: </b>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  disabled={form.isSubmitting}
                />
              </label>
            </div>
            <div>
              <label>
                <b>Date: </b>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  disabled={form.isSubmitting}
                />
              </label>
            </div>
            <button
              type="submit"
              className="add-entry"
              disabled={form.isSubmitting}
            >
              {form.isSubmitting ? "Submitting..." : "Add Entry"}
            </button>
          </form>
          <h2>Tracked Entries</h2>
          <table align="center" style={{ borderSpacing: "15px" }}>
            <thead>
              <tr>
                <th>User</th>
                <th>Source</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length !== 0
                ? filteredEntries.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.user_id}</td>
                      <td>{entry.source}</td>
                      <td>{entry.amount}</td>
                      <td>{new Date(entry.date).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => updateModal(entry)}>Edit</button>
                      </td>
                    </tr>
                  ))
                : entries.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.user_id}</td>
                      <td>{entry.source}</td>
                      <td>{entry.amount}</td>
                      <td>{new Date(entry.date).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => updateModal(entry)}>Edit</button>

                        <button
                          className="delete-button"
                          onClick={() => deleteEntry(entry.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {showModal && (
            <UpdateModal
              show={showModal}
              setShow={setShowModal}
              entry={modalData}
              type="income"
            />
          )}
        </div>
      )}
    </>
  );
};

export default Income;
