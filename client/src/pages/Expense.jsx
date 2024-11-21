/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import axios from 'axios';
import expenseService from "../services/Expense";

const Expense = (props) => {
  const { id } = useParams();
  // eslint-disable-next-line react/prop-types
  const categories = props.categories;
  // const [categoriesId, setCategoriesId] = useState();
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [form, setForm] = useState({
    user_id: id,
    type: "expense",
    amount: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await expenseService.getExpenses(id);
        setEntries(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // const updateData = async (newEntry) => {
  //     try {
  //         const response = await expenseService.updateExpenses(`/api/expenses/${id}`, newEntry);
  //         setEntries([...entries, response.data]);
  //     } catch (error) {
  //         console.error('Error updating data:', error);
  //     }
  // };

  const addData = async (newEntry) => {
    try {
      newEntry.date = new Date(newEntry.date).toISOString();
      const response = await expenseService.addExpenses(newEntry);
      setEntries([...entries, response.data]);
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addData(form);
    setForm({
      type: "expense",
      amount: "",
      description: "",
      date: "",
      category_id: "",
    });
    document.querySelector('input[name="category_id"]:checked').checked = false;
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div>
      <h1>Track Your Expenses</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <b>Type: </b>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="expense">Expense</option>
            </select>
          </label>
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
            {categories.map((category) => (
              <label key={category.id}>
                <input
                  type="radio"
                  name="category_id"
                  value={category.id}
                  // checked={category.name}
                  onChange={handleChange}
                />
                {category.name}
              </label>
            ))}
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
            />
          </label>
        </div>
        <button type="submit" className="add-entry">
          Add Entry
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
                  <td>{new Date(entry.date).toLocaleDateString()}</td>
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
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default Expense;
