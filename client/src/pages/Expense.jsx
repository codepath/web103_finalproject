/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import expenseService from "../services/Expense";
import "../css/Expense.css";
import UpdateModal from "../components/update";

const Expense = (props) => {
  const user_id = useParams().user_id;
  const categories = props.categories;
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [form, setForm] = useState({
    user_id: Number(user_id),
    category_id: "",
    type: "expense",
    amount: "",
    description: "",
    date: "",
    isSubmitting: false,
  });
  const [modalData, setModalData] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await expenseService.getExpenses(user_id);
        setEntries(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [entries, user_id]);
  //       try {
  //           const response = await expenseService.updateExpenses(`/api/expenses/update/${expenseid}`, newEntry);
  //           setEntries([...entries, response.data]);
  //       } catch (error) {
  //           console.error('Error updating data:', error);
  //       }
  //   };

  const updateModal = (entry) => {
    setShowModal(true);
    setModalData(entry);
  };

  const deleteEntry = async (id) => {
    try {
      await expenseService.deleteExpenses(id);
      setEntries(entries.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const addData = async (newEntry) => {
    try {
      newEntry.user_id = Number(user_id);
      newEntry.date = new Date(newEntry.date).toISOString();
      const response = await expenseService.addExpenses(newEntry);
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
      type: "expense",
      amount: "",
      description: "",
      date: "",
      category_id: "",
    });
    // document.querySelector('input[name="category_id"]:checked').checked = false;
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <>
      {user_id === "undefined" ? (
        <div>
          <h1>Please Login to access this page</h1>
        </div>
      ) : (
        <div>
          {loading && (
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
          <h1>Track Your Expenses</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <div>
                <label>
                  <b>Search by Category: </b>
                  <select
                    name="searchCategory"
                    onChange={(e) => {
                      const selectedCategory = e.target.value;
                      if (selectedCategory === "") {
                        setFilteredEntries([]);
                        setEntries(entries);
                      } else {
                        const localEntries = [...entries];
                        const filteredEntries = localEntries.filter(
                          (entry) =>
                            entry.category_id === parseInt(selectedCategory)
                        );
                        if (filteredEntries.length === 0) {
                          alert("No entries found for the selected category");
                        }
                        if (filteredEntries.length > 0) {
                          setFilteredEntries(filteredEntries);
                        }
                      }
                    }}
                    disabled={form.isSubmitting}
                  >
                    <option value="">All</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <div>
              <label>
                <b> Category </b>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={(e) => handleChange(e)}
                  disabled={form.isSubmitting}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
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
                <b>Description:</b>
                <input
                  type="text"
                  name="description"
                  value={form.description}
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
                <th>Category</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length !== 0
                ? filteredEntries.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.user_id}</td>
                      <td>
                        {
                          categories.find(
                            (category) => category.id === entry.category_id
                          )?.name
                        }
                      </td>
                      <td>{entry.amount}</td>
                      <td>{entry.description}</td>
                      <td>
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          timeZone: "UTC",
                        })}
                      </td>
                    </tr>
                  ))
                : entries.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.user_id}</td>
                      <td>
                        {
                          categories.find(
                            (category) => category.id === entry.category_id
                          )?.name
                        }
                      </td>
                      <td>{entry.amount}</td>
                      <td>{entry.description}</td>
                      <td>{new Date(entry.date).toLocaleDateString()}</td>
                      {/* <td><a href={`update/${entry.id}`}>Edit</a></td> */}
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
              categories={categories}
              type="expense"
            />
          )}
        </div>
      )}
    </>
  );
};

export default Expense;
