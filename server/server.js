import express from 'express';
import './config/dotenv.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">Welcome to the Custom Climbing Routes API</h1>');
});

app.listen(PORT, () => {
	console.log(`server listening on http://localhost:${PORT}`);
});
