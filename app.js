const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./database.db');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Database
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        duration TEXT
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER,
        title TEXT,
        description TEXT,
        embed_link TEXT,
        FOREIGN KEY (course_id) REFERENCES courses(id)
    )`);
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/courses', (req, res) => {
    const { title, description, duration } = req.body;
    db.run(`INSERT INTO courses (title, description, duration) VALUES (?, ?, ?)`, [title, description, duration], (err) => {
        if (err) {
            res.status(500).send('Error inserting course');
        } else {
            res.redirect('/');
        }
    });
});

app.get('/courses', (req, res) => {
    db.all(`SELECT * FROM courses`, (err, rows) => {
        if (err) {
            res.status(500).send('Error fetching courses');
        } else {
            res.json(rows);
        }
    });
});

app.post('/courses/:id', (req, res) => {
    const { title, description, duration } = req.body;
    const { id } = req.params;
    db.run(`UPDATE courses SET title = ?, description = ?, duration = ? WHERE id = ?`, [title, description, duration, id], (err) => {
        if (err) {
            res.status(500).send('Error updating course');
        } else {
            res.redirect('/');
        }
    });
});

app.delete('/courses/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM courses WHERE id = ?`, id, (err) => {
        if (err) {
            res.status(500).send('Error deleting course');
        } else {
            res.redirect('/');
        }
    });
});

// Materi Routes
app.post('/courses/:id/materials', (req, res) => {
    const { title, description, embed_link } = req.body;
    const { id } = req.params;
    db.run(`INSERT INTO materials (course_id, title, description, embed_link) VALUES (?, ?, ?, ?)`, [id, title, description, embed_link], (err) => {
        if (err) {
            res.status(500).send('Error inserting material');
        } else {
            res.redirect('/');
        }
    });
});

app.get('/courses/:id/materials', (req, res) => {
    const { id } = req.params;
    db.all(`SELECT * FROM materials WHERE course_id = ?`, id, (err, rows) => {
        if (err) {
            res.status(500).send('Error fetching materials');
        } else {
            res.json(rows);
        }
    });
});

app.post('/materials/:id', (req, res) => {
    const { title, description, embed_link } = req.body;
    const { id } = req.params;
    db.run(`UPDATE materials SET title = ?, description = ?, embed_link = ? WHERE id = ?`, [title, description, embed_link, id], (err) => {
        if (err) {
            res.status(500).send('Error updating material');
        } else {
            res.redirect('/');
        }
    });
});

app.delete('/materials/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM materials WHERE id = ?`, id, (err) => {
        if (err) {
            res.status(500).send('Error deleting material');
        } else {
            res.redirect('/');
        }
    });
});

// Start Server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
// Update course
app.post('/courses/:id', (req, res) => {
    const { title, description, duration } = req.body;
    const { id } = req.params;
    db.run(`UPDATE courses SET title = ?, description = ?, duration = ? WHERE id = ?`, [title, description, duration, id], (err) => {
        if (err) {
            res.status(500).send('Error updating course');
        } else {
            res.redirect('/');
        }
    });
});
// Delete course
app.delete('/courses/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM courses WHERE id = ?`, id, (err) => {
        if (err) {
            res.status(500).send('Error deleting course');
        } else {
            res.redirect('/');
        }
    });
});