import { useState } from 'react';
import '../css/UserRegister.css';

const UserRegister = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const validate = () => {
        let errors = {};

        if (!form.username) {
            errors.username = 'Username is required';
        }

        if (!form.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            errors.email = 'Email address is invalid';
        }

        if (!form.password) {
            errors.password = 'Password is required';
        } else if (form.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (!form.confirmPassword) {
            errors.confirmPassword = 'Confirm Password is required';
        } else if (form.confirmPassword !== form.password) {
            errors.confirmPassword = 'Passwords do not match';
        }

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            fetch('/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Form submitted successfully');
                } else {
                    setErrors(data.errors);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
            console.log('Form submitted successfully');
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div className="register">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                    />
                    {errors.username && <p>{errors.username}</p>}
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p>{errors.email}</p>}
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                    />
                    {errors.password && <p>{errors.password}</p>}
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default UserRegister;