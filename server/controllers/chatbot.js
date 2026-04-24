import jwt from 'jsonwebtoken'
import { pool } from '../config/database.js'

const SYSTEM_PROMPT = `You are NutriBot, the built-in nutrition assistant for MacroMate — an app that helps users track their daily macros and meals.

MacroMate tracks: calories, protein, carbs, and fat. Users set a goal (cut, bulk, or maintain) with specific daily targets for each macro.

You have access to two tools:
- get_user_profile: call this when the user asks about their goals, targets, remaining macros, or calorie budget
- get_user_recent_meals: call this when the user asks what they've eaten, their meal history, or today's intake

Only call a tool when the user is clearly asking about their own personal data. For general nutrition questions, answer directly without calling any tool.

Be concise, friendly, and specific. When you have the user's data, reference it directly in your answer.`

const TOOLS = [
  {
    functionDeclarations: [
      {
        name: 'get_user_profile',
        description: 'Fetches the user\'s name, goal (cut/bulk/maintain), and daily macro targets (calories, protein, carbs, fat).',
        parameters: { type: 'OBJECT', properties: {}, required: [] }
      },
      {
        name: 'get_user_recent_meals',
        description: 'Fetches the user\'s recent meals with all food items and their macros.',
        parameters: { type: 'OBJECT', properties: {}, required: [] }
      }
    ]
  }
]

const executeTool = async (toolName, userId) => {
  if (toolName === 'get_user_profile') {
    const result = await pool.query(
      'SELECT name, goal, calorie_target, protein_target, carb_target, fat_target FROM users WHERE id = $1',
      [userId]
    )
    return result.rows[0] || {}
  }

  if (toolName === 'get_user_recent_meals') {
    const result = await pool.query(
      `SELECT m.name AS meal_name, m.date, m.notes,
              fi.name AS food_name, fi.calories, fi.protein, fi.carbs, fi.fat, fi.serving_unit
       FROM meals m
       LEFT JOIN meal_food_items mfi ON mfi.meal_id = m.id
       LEFT JOIN food_items fi ON fi.id = mfi.food_item_id
       WHERE m.user_id = $1
       ORDER BY m.date DESC
       LIMIT 30`,
      [userId]
    )
    return result.rows
  }

  return {}
}

const chat = async (req, res) => {
  try {
    const { message, history } = req.body

    let userId = null
    const authHeader = req.headers.authorization
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET || 'your-secret-key-change-this')
        userId = decoded.id
      } catch { /* unauthenticated — tools will be skipped */ }
    }

    const contents = [
      ...(history || []),
      { role: 'user', parts: [{ text: message }] }
    ]

    let response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          tools: TOOLS,
          contents
        })
      }
    )

    let data = await response.json()

    while (data.candidates?.[0]?.content?.parts?.some(p => p.functionCall)) {
      const toolCallPart = data.candidates[0].content.parts.find(p => p.functionCall)
      const toolName = toolCallPart.functionCall.name

      const toolResult = userId
        ? await executeTool(toolName, userId)
        : { error: 'User not authenticated' }

      contents.push({ role: 'model', parts: [{ functionCall: toolCallPart.functionCall }] })
      contents.push({
        role: 'user',
        parts: [{ functionResponse: { name: toolName, response: { result: toolResult } } }]
      })

      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            tools: TOOLS,
            contents
          })
        }
      )
      data = await response.json()
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!reply) {
      const reason = data.error?.message || data.candidates?.[0]?.finishReason || 'Unknown reason'
      return res.json({ reply: `No response from Gemini: ${reason}` })
    }

    res.json({ reply })
  } catch (error) {
    console.error('Chatbot error:', error)
    res.status(500).json({ error: 'Chatbot request failed: ' + error.message })
  }
}

export default { chat }
