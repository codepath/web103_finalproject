import { useState, useRef, useEffect } from 'react'
import './NutriBot.css'

const NutriBot = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hi! I\'m NutriBot 🥗 Ask me anything about nutrition, macros, or meal planning!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', text }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    const history = updatedMessages
      .slice(1)
      .slice(0, -1)
      .map(m => ({ role: m.role, parts: [{ text: m.text }] }))

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: text, history })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'model', text: data.reply || data.error }])
    } catch {
      setMessages(prev => [...prev, { role: 'model', text: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="nutribot-wrapper">
      {open && (
        <div className="nutribot-window">
          <div className="nutribot-header">
            <span>🥗 NutriBot</span>
            <button className="nutribot-close" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="nutribot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`nutribot-msg ${msg.role === 'user' ? 'nutribot-msg--user' : 'nutribot-msg--bot'}`}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="nutribot-msg nutribot-msg--bot nutribot-typing">
                <span /><span /><span />
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="nutribot-input-row">
            <textarea
              className="nutribot-input"
              placeholder="Ask about nutrition..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
            />
            <button className="nutribot-send" onClick={sendMessage} disabled={loading}>
              ➤
            </button>
          </div>
        </div>
      )}
      <button className="nutribot-fab" onClick={() => setOpen(o => !o)} title="NutriBot">
        {open ? '✕' : '🥗'}
      </button>
    </div>
  )
}

export default NutriBot
