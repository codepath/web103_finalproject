import { SquarePen, Trash2, Pin } from "lucide-react"
import '../styles/Note.css'
import {getNoteTags} from '../services/api'
import {useEffect, useState} from 'react'

const Note = ({ note, onEdit, onDelete, onPin }) => {
  const [tags, setTags] = useState([])

  useEffect(() => {
    const fetchTags = async () => {
      const data = await getNoteTags(note.id)
      setTags(data)
    }
    fetchTags()
  }, [note.id])
  console.log(note)


  return (
    <div className="note-card" style={{ "--note-color": note.color }}>
      <div className="note-header">
        <h3>{note.title}</h3>
        <Pin onClick={() => onPin(note)} color={note.is_pinned ? '#3b82f6' : '#666666'} size={20} style={{ cursor: 'pointer' }} />
      </div>
      <p className="note-content">{note.content}</p>
      {tags.length > 0 && (
        <div className="note-tags">
          {tags.map(tag => (
            <span key={tag.id} className="tag">#{tag.name}</span>
          ))}
        </div>
      )}
      <div className="note-footer">
        <button onClick={() => onEdit(note)} className="icon-btn"><SquarePen color='#666666' size={20} /></button>
        <button onClick={() => onDelete(note.id)} className="icon-btn"><Trash2 color='#666666' size={20} /></button>
      </div>
    </div>
  );
};

export default Note;
