/* eslint-disable react/prop-types */
// import  { useState } from 'react';

// const Tracker = (props) => {
//     // const [entries, setEntries] = useState([]);
//     // const [props.form, setForm] = useState({props.props.form});
//     const [isEditing, setIsEditing] = useState(false);
//     const [editIndex, setEditIndex] = useState(null);

//     // const handleChange = (e) => {
//     //     const { name, value } = e.target;
//     //     props.setForm({ ...props.form, [name]: value });
//     // };

//     // const handleSubmit = (e) => {
//     //     e.preventDefault();
//     //     // if (isEditing) {
//     //     //     const updatedEntries = entries.map((entry, index) =>
//     //     //         index === editIndex ? props.form : entry
//     //     //     );
//     //         setEntries(updatedEntries);
//     //         // setIsEditing(false);
//     //         // setEditIndex(null);
//     //     } else {
//     //         setEntries([...entries, props.form]);
//     //     }
//     //     props.setForm({ type: 'income', description: '', amount: '' });
//     // };

//     const handleEdit = (index) => {
//         props.setForm(props.entries[index]);
//         setIsEditing(true);
//         setEditIndex(index);
//     };

//     const handleDelete = (index) => {
//         const updatedEntries = props.entries.filter((_, i) => i !== index);
//         props.setEntries(updatedEntries);
//     };

//     return (
//         <div>
//             <h2>Income and Expense Tracker</h2>
//             <form onSubmit={props.handleSubmit}>
//                 <label>
//                     Type:
//                     <select name="type" value={props.form.type} onChange={props.handleChange}>
//                         <option value="income">Income</option>
//                         <option value="expense">Expense</option>
//                     </select>
//                 </label>
//                 <label>
//                     Description:
//                     <input
//                         type="text"
//                         name="description"
//                         value={props.form.description}
//                         onChange={props.handleChange}
//                         required
//                     />
//                 </label>
//                 <label>
//                     Amount:
//                     <input
//                         type="number"
//                         name="amount"
//                         value={props.form.amount}
//                         onChange={props.handleChange}
//                         required
//                     />
//                 </label>
//                 <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
//             </form>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Type</th>
//                         <th>Description</th>
//                         <th>Amount</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {props.entries.map((entry, index) => (
//                         <tr key={index}>
//                             <td>{entry.type}</td>
//                             <td>{entry.description}</td>
//                             <td>{entry.amount}</td>
//                             <td>
//                                 <button onClick={() => handleEdit(index)}>Edit</button>
//                                 <button onClick={() => handleDelete(index)}>Delete</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default Tracker;
import { useState, useEffect } from 'react';
// import { fetchEntries, addEntry, updateEntry, deleteEntry } from '../services/entryService';

const Tracker = () => {
    const [entries, setEntries] = useState([]);
    const [form, setForm] = useState({ type: 'income', description: '', amount: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        const loadEntries = async () => {
            const fetchedEntries = await fetchEntries();
            setEntries(fetchedEntries);
        };
        loadEntries();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await updateEntry(editIndex, form);
            const updatedEntries = entries.map((entry, index) =>
                index === editIndex ? form : entry
            );
            setEntries(updatedEntries);
            setIsEditing(false);
            setEditIndex(null);
        } else {
            const newEntry = await addEntry(form);
            setEntries([...entries, newEntry]);
        }
        setForm({ type: 'income', description: '', amount: '' });
    };

    const handleEdit = (index) => {
        setForm(entries[index]);
        setIsEditing(true);
        setEditIndex(index);
    };

    const handleDelete = async (index) => {
        await deleteEntry(index);
        const updatedEntries = entries.filter((_, i) => i !== index);
        setEntries(updatedEntries);
    };

    return (
        <div>
            <h2>Income and Expense Tracker</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Type:
                    <select name="type" value={form.type} onChange={handleChange}>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </label>
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
                <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.type}</td>
                            <td>{entry.description}</td>
                            <td>{entry.amount}</td>
                            <td>
                                <button onClick={() => handleEdit(index)}>Edit</button>
                                <button onClick={() => handleDelete(index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Tracker;