const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Definir esquema y modelo de historial de búsqueda
const searchSchema = new mongoose.Schema({
  city: String,
  country: String,
  temperature: Number,
  condition: String,
  conditionText: String,
  icon: String,
  date: { type: Date, default: Date.now },
});

const Search = mongoose.model('Search', searchSchema);

// Ruta para guardar el historial de búsqueda
app.post('/api/search', async (req, res) => {
  try {
    const newSearch = new Search(req.body);
    await newSearch.save();
    res.status(201).json(newSearch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ruta para obtener el historial de búsqueda
app.get('/api/search', async (req, res) => {
  try {
    const searches = await Search.find().sort({ date: -1 }).limit(10); // Limitamos a los últimos 10 registros
    res.json(searches);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});