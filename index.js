import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();


app.use(express.static('public'));     
app.use(express.json());             
app.use(cors());


app.get('/', (req, res) => {
  res.send('Monster Match API running! Go to /index.html');
});


const DB_FILE = 'monsters.json';

function loadMonsters() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveMonsters(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}


app.get('/api/monsters', (req, res) => {
  res.json(loadMonsters());
});

app.post('/api/monsters', (req, res) => {
  const { name, period, imageUrl } = req.body;
  if (!name || !period || !imageUrl) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const monsters = loadMonsters();
  const monster = { id: Date.now(), name, period, imageUrl };
  monsters.push(monster);
  saveMonsters(monsters);
  res.json(monster);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Express server initialized on port', port);
});
