const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Pool } = require('pg');
const cors = require('cors');

const JWT_SECRET = process.env.JWT_SECRET


const app = express();
app.use(bodyParser.json());
app.use(cors());


const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Connect to PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER, 
  host: process.env.DB_HOST,
  database: process.env.DB, 
  password: process.env.DB_PASSWORD, 
  port: process.env.DB_PORT, 
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Error connecting to PostgreSQL:', err));


app.post("/signup", async (req, res) => {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10); 
      const userRecord = await admin.auth().createUser({
        email,
        password: hashedPassword, 
      });
      console.log(userRecord.uid);
      const query = 'INSERT INTO users (id, email, password) VALUES ($1, $2, $3)';
      const values = [userRecord.uid, email, hashedPassword];
      await pool.query(query, values);
   
      const token = jwt.sign({ email :email , user_id : userRecord.uid}, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: "User created successfully", token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    const user = rows[0];
  
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ email : user.email , user_id : user.id}, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(401).json({ error: "Invalid credentials" });
  }
});


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) return res.sendStatus(403);
    req.email = decodedToken.email; 
    req.user_id = decodedToken.user_id; 
    next();
  });
};

app.get("/me", authenticateToken ,(req,res)=>{
  res.json({ email: req.email }); 
});


// GET route to fetch all quizzes
app.get("/quizzes", authenticateToken, async (req, res) => {
  try {
    const query = 'SELECT * FROM quizzes';
    const { rows } = await pool.query(query);
    res.status(200).json({ quizzes: rows });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET route to fetch questions for a specific quiz ID
app.get("/quizzes/:quizId", authenticateToken, async (req, res) => {
  try {
    const { quizId } = req.params;
    const query = 'SELECT * FROM questions WHERE quiz_id = $1';
    const { rows } = await pool.query(query, [quizId]);
    res.status(200).json({ questions: rows });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/submit-quiz", authenticateToken ,(req, res) => {
  const { quizId, score } = req.body;
  const userId =req.user_id;

  pool.query(
      'INSERT INTO quiz_scores (user_id, quiz_id, score) VALUES ($1, $2, $3)',
      [userId, quizId, score],
      (error, results) => {
          if (error) {
              console.error("Error submitting quiz:", error);
              res.status(500).json({ error: 'Internal server error' });
          } else {
              res.json({ message: 'Quiz submitted successfully' });
          }
      }
  );
});

app.get("/user/scores/", authenticateToken, async (req, res) => {
  try {
      const userId = req.user_id;
      const query = 'SELECT * FROM quiz_scores WHERE user_id = $1';
      const { rows } = await pool.query(query, [userId]);
      res.json({ scores: rows });
  } catch (error) {
      console.error("Error fetching quiz scores:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/quizzes/:quizId/title", authenticateToken, async (req, res) => {
  try {
      const { quizId } = req.params;
      const query = 'SELECT title FROM quizzes WHERE quiz_id = $1';
      const { rows } = await pool.query(query, [quizId]);
      if (rows.length === 0) {
          return res.status(404).json({ error: "Quiz not found" });
      }
      res.json({ quizId, quizTitle: rows[0].title });
  } catch (error) {
      console.error("Error fetching quiz title:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
