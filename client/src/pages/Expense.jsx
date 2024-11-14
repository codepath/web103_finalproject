import { useState } from 'react';

const Expense = () => {
    const [entries, setEntries] = useState([]);
    const [form, setForm] = useState({ type: 'income', amount: '', description: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setEntries([...entries, form]);
        setForm({ type: 'income', amount: '', description: '' });
    };

    return (
        <div>
            <h1>Track Your Income and Expenses</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Type:
                        <select name="type" value={form.type} onChange={handleChange}>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Amount:
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
                        Description:
                        <input
                            type="text"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Add Entry</button>
            </form>
            <h2>Tracked Entries</h2>
            <table>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.type}</td>
                            <td>{entry.amount}</td>
                            <td>{entry.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Expense;