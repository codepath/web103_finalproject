import { useState, useEffect } from 'react'
import api from '../services/api.jsx'

const Admin = () => {
  const [recipes, setRecipes] = useState([])
  const [form, setForm] = useState({ title: '', description: '', instructions: '', image_url: '' })

  const refreshRecipes = async () => {
    const data = await api.getRecipes()
    setRecipes(data || [])
  }

  useEffect(() => {
    refreshRecipes()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    await api.createRecipe(form)
    setForm({ title: '', description: '', instructions: '', image_url: '' })
    refreshRecipes()
  }

  const handleDelete = async (id) => {
    await api.deleteRecipe(id)
    setRecipes((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div>
      <h1 style={styles.title}>Admin — Manage Recipes</h1>

      <form style={styles.form} onSubmit={handleCreate}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} style={styles.input} />
        <input name="image_url" placeholder="Image URL" value={form.image_url} onChange={handleChange} style={styles.input} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} style={styles.input} />
        <textarea name="instructions" placeholder="Instructions" value={form.instructions} onChange={handleChange} style={styles.textarea} />
        <button type="submit" style={styles.btn}>Create Recipe</button>
      </form>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.header}>Title</th>
            <th style={styles.header}>Avg Rating</th>
            <th style={styles.header}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((r) => (
            <tr key={r.id}>
              <td style={styles.cell}>{r.title}</td>
              <td style={styles.cell}>{r.avg_rating}</td>
              <td style={styles.cell}>
                <button style={styles.btn} onClick={() => handleDelete(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Admin

const styles = {
  title: {
    marginLeft: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '10px',
    maxWidth: '400px',
  },
  input: {
    height: '35px',
    borderRadius: '5px',
  },
  textarea: {
    height: '100px',
    borderRadius: '5px',
  },
  btn: {
    cursor: 'pointer',
    height: '35px',
    border: 'solid black',
    borderWidth: '1px',
    borderRadius: '5px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  header: {
    backgroundColor: '#333',
    color: 'white',
    padding: '12px',
    textAlign: 'left',
  },
  cell: {
    border: '1px solid #ddd',
    padding: '12px',
  },
}
