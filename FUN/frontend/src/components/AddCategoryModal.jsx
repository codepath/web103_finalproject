import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createCategory } from '../services/api';
import '../styles/AddCategoryModal.css'
import {X, Check} from "lucide-react"

const AddCategoryModal = ({ show, onClose, onRefreshCategories }) => {
  const { user } = useAuth();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createCategory(user.userID, newCategoryName);
      setNewCategoryName('');
      onRefreshCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!show) return null;

  return (
    <div className="add-category-modal-content">
      {error && <p className="error-text" style={{color: 'red'}}>{error}</p>}

      <form onSubmit={handleAdd} className="category-form">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Work, Personal, etc."
          required
        />
        <button type="submit" className="icon-button"><Check type='submit' color='#10B981' size={20}/></button>
        <X onClick={onClose} color='#666666' size={20}/>
      </form>
    </div>
  );
};

export default AddCategoryModal;