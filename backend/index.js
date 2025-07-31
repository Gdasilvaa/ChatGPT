const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(path.join(__dirname, 'data.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    hourlyRate REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS shifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    startTime TEXT,
    endTime TEXT,
    role TEXT,
    location TEXT,
    employeeId INTEGER,
    hours REAL,
    FOREIGN KEY(employeeId) REFERENCES employees(id)
  )`);
});

// Employee endpoints
app.get('/employees', (req, res) => {
  db.all('SELECT * FROM employees', [], (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.post('/employees', (req, res) => {
  const { name, role, hourlyRate } = req.body;
  db.run('INSERT INTO employees(name, role, hourlyRate) VALUES(?,?,?)', [name, role, hourlyRate], function(err) {
    if (err) return res.status(500).json({error: err.message});
    res.json({ id: this.lastID, name, role, hourlyRate });
  });
});

app.put('/employees/:id', (req, res) => {
  const { name, role, hourlyRate } = req.body;
  db.run('UPDATE employees SET name=?, role=?, hourlyRate=? WHERE id=?', [name, role, hourlyRate, req.params.id], function(err) {
    if (err) return res.status(500).json({error: err.message});
    res.json({ updated: this.changes });
  });
});

app.delete('/employees/:id', (req, res) => {
  db.run('DELETE FROM employees WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(500).json({error: err.message});
    res.json({ deleted: this.changes });
  });
});

// Shift endpoints
function calculateHours(startTime, endTime) {
  const start = new Date(`1970-01-01T${startTime}:00Z`);
  const end = new Date(`1970-01-01T${endTime}:00Z`);
  const diff = (end - start) / (1000*60*60);
  return diff > 0 ? diff : 0;
}

app.get('/shifts', (req, res) => {
  db.all('SELECT * FROM shifts', [], (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.post('/shifts', (req, res) => {
  const { date, startTime, endTime, role, location, employeeId } = req.body;
  const hours = calculateHours(startTime, endTime);
  db.run('INSERT INTO shifts(date,startTime,endTime,role,location,employeeId,hours) VALUES(?,?,?,?,?,?,?)',
    [date, startTime, endTime, role, location, employeeId || null, hours], function(err) {
    if (err) return res.status(500).json({error: err.message});
    res.json({ id: this.lastID, date, startTime, endTime, role, location, employeeId, hours });
  });
});

app.put('/shifts/:id', (req, res) => {
  const { date, startTime, endTime, role, location, employeeId } = req.body;
  const hours = calculateHours(startTime, endTime);
  db.run(`UPDATE shifts SET date=?, startTime=?, endTime=?, role=?, location=?, employeeId=?, hours=? WHERE id=?`,
    [date, startTime, endTime, role, location, employeeId || null, hours, req.params.id], function(err) {
    if (err) return res.status(500).json({error: err.message});
    res.json({ updated: this.changes });
  });
});

app.delete('/shifts/:id', (req, res) => {
  db.run('DELETE FROM shifts WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(500).json({error: err.message});
    res.json({ deleted: this.changes });
  });
});

app.get('/hours/:employeeId', (req, res) => {
  const { weekStart, weekEnd } = req.query;
  db.all(`SELECT SUM(hours) as totalHours FROM shifts WHERE employeeId=? AND date BETWEEN ? AND ?`,
    [req.params.employeeId, weekStart, weekEnd],
    (err, rows) => {
      if (err) return res.status(500).json({error: err.message});
      res.json(rows[0]);
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
