import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res
    .status(200)
    .send('<h1 style="text-align: center; margin-top: 50px;">BookEZ API</h1>')
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
