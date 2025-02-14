/* eslint-disable react/prop-types */
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import expenseService from "../services/Expense";
import incomeService from "../services/Income";

const UpdateModal = (props) => {
    const { show, setShow, entry, type } = props;

    const [form, setForm] = useState({ ...entry });

    const handleChange = (e) => {
        e.preventDefault();
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            form.date = new Date(form.date).toISOString();
            if (type === "expense") {
                await expenseService.updateExpenses(entry.id, form);
            } else if (type === "income") {
                await incomeService.updateIncome(entry.id, form);
            }
            setForm({ ...form, isSubmitting: true });

            setForm(type === "expense" ? {
                user_id: entry.user_id,
                amount: "",
                description: "",
                date: "",
                category_id: "",
            } : {
                user_id: entry.user_id,
                amount: "",
                source: "",
                date: "",
            });
            setShow(false);
            props.onUpdate(); // Notify parent component about the update
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };

    const handleClose = () => {
        setShow(false);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update Entry</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {type === "expense" ? (
                        <>
                            <Form.Group controlId="formCategory">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="category_id"
                                    value={form.category_id}
                                    onChange={(e) => handleChange(e)}
                                >
                                    {props.categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formAmount">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="amount"
                                    value={form.amount}
                                    onChange={(e) => handleChange(e)}
                                />
                            </Form.Group>
                            <Form.Group controlId="formDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    value={form.description}
                                    onChange={(e) => handleChange(e)}
                                />
                            </Form.Group>
                        </>
                    ) : (
                        <>
                            <Form.Group controlId="formSource">
                                <Form.Label>Source</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="source"
                                    value={form.source}
                                    onChange={(e) => handleChange(e)}
                                />
                            </Form.Group>
                            <Form.Group controlId="formAmount">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="amount"
                                    value={form.amount}
                                    onChange={(e) => handleChange(e)}
                                />
                            </Form.Group>
                        </>
                    )}
                    <Form.Group controlId="formDate">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="date"
                            value={new Date(form.date).toISOString().split("T")[0]}
                            onChange={(e) => handleChange(e)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
//     const [form, setForm] = useState({ ...entry });

//     const handleChange = (e) => {
//         e.preventDefault();
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             form.date = new Date(form.date).toISOString();
//             await expenseService.updateExpenses(entry.id, form);
//             setForm({ ...form, isSubmitting: true });

//             setForm({
//                 user_id: entry.user_id,
//                 amount: "",
//                 description: "",
//                 date: "",
//                 category_id: "",
//             });
//             setShow(false);
//             // setEntries(entries.filter((entry) => entry.id !== id));
//             props.onUpdate(); // Notify parent component about the update
//         } catch (error) {
//             console.error("Error updating data:", error);
//         }
//     };

//     const handleClose = () => {
//         setShow(false);
//     };

//     return (
//         <Modal show={show} onHide={handleClose}>
//             <Modal.Header closeButton>
//                 <Modal.Title>Update Entry</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <Form>
//                     <Form.Group controlId="formCategory">
//                         <Form.Label>Category</Form.Label>
//                         <Form.Control
//                             as="select"
//                             name="category_id"
//                             value={form.category_id}
//                             onChange={(e) => handleChange(e)}
//                         >
//                             {props.categories.map((category) => (
//                                 <option key={category.id} value={category.id}>
//                                     {category.name}
//                                 </option>
//                             ))}
//                         </Form.Control>
//                     </Form.Group>
//                     <Form.Group controlId="formAmount">
//                         <Form.Label>Amount</Form.Label>
//                         <Form.Control
//                             type="number"
//                             name="amount"
//                             value={form.amount}
//                             onChange={(e) => handleChange(e)}
//                         />
//                     </Form.Group>
//                     <Form.Group controlId="formDescription">
//                         <Form.Label>Description</Form.Label>
//                         <Form.Control
//                             type="text"
//                             name="description"
//                             value={form.description}
//                             onChange={(e) => handleChange(e)}
//                         />
//                     </Form.Group>
//                     <Form.Group controlId="formDate">
//                         <Form.Label>Date</Form.Label>
//                         <Form.Control
//                             type="date"
//                             name="date"
//                             value={new Date(form.date).toISOString().split("T")[0]}
//                             onChange={(e) => handleChange(e)}
//                         />
//                     </Form.Group>
//                 </Form>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={handleClose}>
//                     Close
//                 </Button>
//                 <Button variant="primary" onClick={handleSubmit}>
//                     Save Changes
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     );
// };

export default UpdateModal;
