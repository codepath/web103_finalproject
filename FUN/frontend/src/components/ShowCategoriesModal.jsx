import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import { getCategories, createCategory, deleteCategory } from '../services/api';
import '../styles/ShowCategoriesModal.css';
import {X, Trash2} from 'lucide-react'

const ShowCategoriesModal = ({ show, onClose, onRefreshCategories }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  // Fetch categories when modal opens
  useEffect(() => {
    if (!show || !user?.userID) return;

    let cancelled = false;

    (async () => {
      try {
        const data = await getCategories(user.userID);
        if (!cancelled) setCategories(data);
      } catch (err) {
        if (!cancelled) setError("Failed to load categories.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [show, user?.userID]);

  const handleDelete = async (categoryID) => {
    if (!window.confirm("Delete this category? Notes in this category might be affected.")) return;
    try {
      await deleteCategory(categoryID, user.userID);
      const data = await getCategories(user.userID);
      setCategories(data);
      onRefreshCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-content">
        <div className="modal-header">
          <div className="title">
            <span>Your categories:</span>
          </div>
          <div className="closeBtn">
            <X onClick={onClose} color='#666666' size={20}/>
          </div>
        </div>
        <div className="category-list">
          {error && <p className="error-text" style={{color: 'red'}}>{error}</p>}
          <ul className="category-list">
            {categories.map(cat => (
              <li key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
                <p>{cat.name}</p>
                <button className='icon-button' onClick={() => handleDelete(cat.id)}><Trash2 color='#666666' size={20}/></button>
              </li>
            ))}
          </ul>
        </div>
    </div>
  )

}

export default ShowCategoriesModal